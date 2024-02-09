import pytest
import json
from flask import Flask
import os
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from app.models import User, Transaction, Comment
from datetime import datetime, timedelta 
import traceback
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

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    client = app.test_client()

    with app.app_context():
        db.create_all()

        response = client.get('/users')
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

# def test_get_all_transactions(client):
#     response = client.get('/api/transactions')
#     assert response.status_code == 200

# def test_get_current_users_transactions(client):
#     response = client.get('/api/transactions/current')
#     assert response.status_code == 200

def test_send_transaction(client):
    response = client.post('/api/transactions', json={
        'recipient': 2,
        'amount': 10.0,
        'type': False,
        'strict': False
    })
    assert response.status_code == 201

# def test_delete_transaction(client):
#     response = client.delete('/api/transactions/1')
#     assert response.status_code == 200

# def test_get_transaction_comment(client):
#     response = client.get('/api/transactions/1/comments')
#     assert response.status_code == 200

# def test_add_comment_to_transaction(client):
#     response = client.post('/api/transactions/1/comments', json={
#         'content': 'Test comment'
#     })
#     assert response.status_code == 200
