import pytest
import json
from flask import Flask
import os
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from app.models import User, Transaction, Comment
from datetime import datetime, timedelta 
import traceback
import time
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

        response = client.get('/api/users')
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
                'email': 'bobbie@aa.io',
                'password': 'password',
                '_csrf_token': csrf_token,},
                headers={'X-CSRF-TOKEN': csrf_token}
            )

        assert login_response.status_code == 200

        yield client2

        logout_response = client2.get('/api/auth/logout')
        assert logout_response.status_code == 200

@pytest.fixture
def test_get_user1(client):
    response = client.get('/api/users/1')

    res = response.json

    assert res["id"] == 1
    assert res["username"] == "Demo"
    assert response.status_code == 200

    return res

@pytest.fixture
def test_get_user2(client):
    response = client.get('/api/users/2')

    res = response.json

    assert res["id"] == 2
    assert res["username"] == "marnie"
    assert response.status_code == 200

    return res

@pytest.fixture
def test_send_transaction(client, test_get_user1):
    response = client.post('/api/transactions', json={
        'recipient': 2,
        'amount': 10.0,
        'type': True,
        'strict': False
    })
    res = response.json

    assert res["sender_id"] == test_get_user1["id"]
    assert res["recipient_id"] == 2
    assert res["amount"] == 10.0
    assert response.status_code == 201

    return res

@pytest.fixture
def test_send_strict_transaction(client, test_get_user1):
    response = client.post('/api/transactions', json={
        'recipient': 2,
        'amount': 10.0,
        'type': True,
        'strict': True
    })
    res = response.json

    assert res["sender_id"] == test_get_user1["id"]
    assert res["recipient_id"] == 2
    assert res["amount"] == 10.0
    assert response.status_code == 201

    return res

def test_check_transactions(client, test_get_user1, test_get_user2, test_send_transaction):
    sender_balance = test_get_user1["balance"]
    recipient_balance = test_get_user2["balance"]

    tx = test_send_transaction

    user1 = client.get('/api/users/1')
    sender = user1.json

    user2 = client.get('/api/users/2')
    recipient = user2.json

    assert sender["balance"] == sender_balance - tx["amount"]
    assert recipient["balance"] == recipient_balance + tx["amount"]

@pytest.fixture
def test_delete_transaction(client, test_send_transaction):
    response = client.delete(f'/api/transactions/{test_send_transaction["id"]}')

    assert response.status_code == 200

    return test_send_transaction

def test_delete_transaction_not_found_error(client, test_delete_transaction):
    response = client.delete(f'/api/transactions/{test_delete_transaction["id"]}')
    res = response.json

    assert response.status_code == 404
    assert res["errors"]["message"] == 'Transaction not found!'

def test_delete_transaction_unathorized_user_error(test_send_transaction, client2):
    response = client2.delete(f'/api/transactions/{test_send_transaction["id"]}')
    res = response.json

    assert response.status_code == 402
    assert res["errors"]["message"] == 'Unauthorized Access!'

def test_strict_transaction_delete_error(client, test_send_strict_transaction):
    time.sleep(30)
    
    response = client.delete(f'/api/transactions/{test_send_strict_transaction["id"]}')
    res = response.json

    assert response.status_code == 402
    assert res["errors"]["message"] == 'Too much time has elapsed!'

def test_send_transaction_invalid_amount_error(client):
    response = client.post('/api/transactions', json={
        'recipient': 2,
        'amount': -10.0,
        'type': True,
        'strict': False
    })
    res = response.json

    assert response.status_code == 402
    assert res["errors"]["message"] == 'Invalid amount!'