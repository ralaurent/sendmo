import pytest
import json
from flask import Flask
import os
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from app.models import User, Transaction, Comment
from datetime import datetime, timedelta 
from flask_login import login_user, current_user
import traceback
from .test_tx_routes import test_get_user1, test_get_user2
from dotenv import load_dotenv
load_dotenv() 

def _extract_csrf(set_cookie_header):
    if set_cookie_header:
        cookies = set_cookie_header.split(';')
        for cookie in cookies:
            if 'csrf_token' in cookie:
                csrf_token = cookie.split('=')[1]
                return csrf_token
    return None

@pytest.fixture(scope='function')
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    client = app.test_client()

    with app.app_context():
        db.create_all()

        response = client.get('api/users')
        cookies = response.headers.get('Set-Cookie')
        csrf_token = _extract_csrf(cookies)

        with client:
            login_response = client.post('/api/auth/login', data={
                'email': 'demo@aa.io',
                'password': 'password',
                '_csrf_token': csrf_token,},
                headers={'X-CSRF-TOKEN': csrf_token}
            )

        assert login_response.status_code == 200

        yield client

@pytest.fixture(scope='function')
def client2():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    client2 = app.test_client()

    with app.app_context():
        db.create_all()

        response = client2.get('/api/users')
        cookies = response.headers.get('Set-Cookie')
        csrf_token = _extract_csrf(cookies)

        with client2:
            login_response = client2.post('/api/auth/login', data={
                'email': 'marnie@aa.io',
                'password': 'password',
                '_csrf_token': csrf_token,},
                headers={'X-CSRF-TOKEN': csrf_token}
            )

        assert login_response.status_code == 200

        yield client2

        logout_response = client2.get('/api/auth/logout')
        assert logout_response.status_code == 200

@pytest.fixture
def test_send_request(client):
    response = client.post('/api/requests', json={
        'sender': 2,
        'amount': 5.0,
    })
    res = response.json

    assert res["sender_id"] == 2
    assert res["requester_id"] == 1
    assert res["amount"] == 5.0
    assert response.status_code == 201
   
    return res

@pytest.fixture
def test_edit_request(client, test_send_request):
    response = client.put(f'/api/requests/{test_send_request["id"]}', json={
        'sender': 2,
        'amount': 250.0,
    })
    res = response.json

    assert res["sender_id"] == 2
    assert res["requester_id"] == 1
    assert res["amount"] == 250.0
    assert response.status_code == 201
   
    return res

@pytest.fixture
def test_accept_request(test_send_request, client2):
    response = client2.put(f'/api/requests/{test_send_request["id"]}/accept')
    res = response.json

    assert res["accepted"] == True
    assert res["declined"] == False
    assert response.status_code == 201

    return test_send_request

def test_check_request(client, test_get_user1, test_get_user2, test_accept_request):
    requester_balance = test_get_user1["balance"]
    sender_balance = test_get_user2["balance"]

    rx = test_accept_request

    user1 = client.get('/api/users/1')
    requester = user1.json

    user2 = client.get('/api/users/2')
    sender = user2.json

    assert requester["balance"] == requester_balance + rx["amount"]
    assert sender["balance"] == sender_balance - rx["amount"]


def test_decline_request(test_send_request, client2):
    response = client2.put(f'/api/requests/{test_send_request["id"]}/decline')
    res = response.json

    assert res["accepted"] == False
    assert res["declined"] == True
    assert response.status_code == 201

def test_accept_request_unathorized_user_error(test_send_request, client):
    response = client.put(f'/api/requests/{test_send_request["id"]}/accept')
    res = response.json

    assert response.status_code == 402
    assert res["errors"]["message"] == 'Unauthorized Access!'

def test_accept_request_invalid_update(test_accept_request, client2):
    response = client2.put(f'/api/requests/{test_accept_request["id"]}/accept')
    res = response.json
    
    assert response.status_code == 402
    assert res["errors"]["message"] == "Request can't be updated after it's accepted or declined!"

def test_accept_request_insufficient_funds_error(test_edit_request, client2):
    response = client2.put(f'/api/requests/{test_edit_request["id"]}/accept')
    res = response.json

    assert response.status_code == 402
    assert res["errors"]["message"] == 'Insufficient funds!'