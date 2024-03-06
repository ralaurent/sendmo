import os
from flask import Blueprint, request, jsonify
from app.models import User, Transaction, Request, PaymentMethod, db
from app.forms import TxForm, RxForm, PaymentMethodForm
from flask_login import current_user, login_user, logout_user, login_required
from datetime import datetime, timedelta
from sqlalchemy import or_
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode

payment_method_routes = Blueprint('payments', __name__)

configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        'clientId': os.environ.get('PLAID_CLIENT'),
        'secret': os.environ.get('PLAID_SECRET'),
    }
)

api_client = plaid.ApiClient(configuration)
plaid_client = plaid_api.PlaidApi(api_client)

@payment_method_routes.route('/link')
def get_plaid_link_token():
    user_id = current_user.id 
    user = db.session.get(User, user_id)

    try:
        request = LinkTokenCreateRequest(
            products=[Products("auth")],
            client_name=user.username,
            country_codes=[CountryCode('US')],
            redirect_uri=os.environ.get('PLAID_REDIRECT_URI'),
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(user_id)
            )
        )
        response = plaid_client.link_token_create(request)

        return response.to_dict(), 200
    
    except Exception as e:
        return { "errors": { "message": "Something went wrong!", "e": str(e), "test": os.environ.get('PLAID_REDIRECT_URI') } }, 500 
    

@payment_method_routes.route('')
def get_current_users_payment_info():
    user_id = current_user.id 
    # payment_methods = PaymentMethod.query.filter(PaymentMethod.user_id == user_id).all()

    payment_methods = db.session.query(PaymentMethod).filter(PaymentMethod.user_id == user_id).all()
    return {"Payments": [payment_method.to_dict() for payment_method in payment_methods]}


@payment_method_routes.route('', methods=["POST"])
def add_users_payment_info():
    user_id = current_user.id 

    form = PaymentMethodForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        try:    
            params = {
                "user_id": user_id,
                "last_4_digits": form.card.data,
                "exp_date": form.exp.data,
                "cvc": form.cvc.data,
            }

            payment_method = PaymentMethod(**params)
            db.session.add(payment_method)
            db.session.commit()

            return payment_method.to_dict(), 201
        
        except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 
    
    return form.errors, 422

@payment_method_routes.route('/<int:id>', methods=["PUT"])
def update_users_payment_info(id):
    # payment_method = PaymentMethod.query.get(id)

    payment_method = db.session.get(PaymentMethod, id)

    form = PaymentMethodForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        try:
            payment_method.last_4_digits = form.card.data
            payment_method.exp_date = form.exp.data
            payment_method.cvc = form.cvc.data

            db.session.add(payment_method)
            db.session.commit()

            return payment_method.to_dict(), 201
        
        except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 
        
    return form.errors, 422

@payment_method_routes.route('/<int:id>', methods=["DELETE"])
def delete_users_payment_info(id):
    # payment_method = PaymentMethod.query.get(id)
    
    payment_method = db.session.get(PaymentMethod, id)

    if payment_method:
        try:
            db.session.delete(payment_method)
            db.session.commit()

            return { "message": "Successfully deleted!" }, 201
        except Exception as e:
                db.session.rollback()
                return { "errors": { "message": "Something went wrong!" } }, 500 
        
    return { "errors": { "message": "Payment method not found!" } }, 404
    
