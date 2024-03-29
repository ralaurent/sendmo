from flask import Blueprint, request
from app.models import User, Transaction, Request, db
from app.forms import TxForm, RxForm, UpdateRxForm
from flask_login import current_user, login_user, logout_user, login_required
from datetime import datetime, timedelta
from sqlalchemy import or_

rx_routes = Blueprint('requests', __name__)

@rx_routes.route('')
def get_all_requests():
    # rxs = Request.query.all()

    rxs = db.session.query(Request).all()
    return {"Requests": [rx.to_dict() for rx in rxs]}

@rx_routes.route('/current')
def get_current_users_requests():
    user_id = current_user.id 
    # rxs = Request.query.filter(or_(Request.requester_id == user_id, Request.sender_id == user_id)).all()

    rxs = db.session.query(Request).filter(or_(Request.requester_id == user_id, Request.sender_id == user_id)).all()
    return {"Requests": [rx.to_dict() for rx in rxs]}

@rx_routes.route('', methods=["POST"])
def send_request():
    user_id = current_user.id 

    form = RxForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if round(form.amount.data, 5) > 0:
            params = {
                "requester_id": user_id,
                "sender_id": form.sender.data,
                "amount": form.amount.data,
            }

            rx = Request(**params)

            db.session.add(rx)
            db.session.commit()

            return rx.to_dict(), 201
        
        return { "errors": { "message": "Invalid amount!" } }, 402

    return form.errors, 422

@rx_routes.route('/<int:id>', methods=["PUT"])
def update_request(id):
    user_id = current_user.id 
    # rx = Request.query.get(id)

    rx = db.session.get(Request, id)

    form = UpdateRxForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if rx:
        try:
            if form.validate_on_submit():
                if not rx.accepted or not rx.declined:
                    if rx.requester_id == user_id:
                        if round(form.amount.data, 5) > 0:
                            rx.amount = round(form.amount.data, 5)
                            db.session.commit()

                            return rx.to_dict(), 201
                        
                        return { "errors": { "message": "Invalid amount!" } }, 402
                    
                    return { "errors": { "message": "Unauthorized Access!" } }, 402
                
                return { "errors": { "message": "Request can't be changed after it's accepted!" } }, 402

            return form.errors, 422
        
        except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 
    
    return { "errors": { "message": "Request not found!" } }, 404 

@rx_routes.route('/<int:id>', methods=["DELETE"])
def delete_request(id):
    user_id = current_user.id 
    # rx = Request.query.get(id)

    rx = db.session.get(Request, id)
    
    if rx:
        try:
            if not rx.accepted or not rx.declined:
                if rx.requester_id == user_id:
                    db.session.delete(rx)
                    db.session.commit()

                    return { "message": "Successfully deleted!" }, 201
                
                return { "errors": { "message": "Unauthorized Access!" } }, 402
            
            return { "errors": { "message": "Request can't be deleted after it's accepted!" } }, 402
        
        except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 
    
    return { "errors": { "message": "Request not found!" } }, 404 

@rx_routes.route('/<int:id>/accept', methods=["PUT"])
def accept_request(id):
    user_id = current_user.id
    # rx = Request.query.get(id)

    rx = db.session.get(Request, id)

    if rx:
        # requester = User.query.get(rx.requester_id)
        # sender = User.query.get(rx.sender_id)

        requester = db.session.get(User, rx.requester_id)
        sender = db.session.get(User, rx.sender_id)

        try:
            if not rx.accepted and not rx.declined:
                if user_id == rx.sender_id:
                    if round(rx.amount, 5) <= round(sender.balance, 5):

                        requester.balance = round(requester.balance, 5) + round(rx.amount, 5)
                        db.session.commit()

                        sender.balance = round(sender.balance, 5) - round(rx.amount, 5)
                        db.session.commit()

                        params = {
                            "sender_id": rx.sender_id,
                            "recipient_id": rx.requester_id,
                            "amount": rx.amount,
                            # "strict_mode": strict_mode
                        }

                        tx = Transaction(**params)
                        db.session.add(tx)
                        db.session.commit()

                        rx.accepted = True
                        db.session.commit()

                        return rx.to_dict(), 201
                    
                    return { "errors": { "message": "Insufficient funds!" } }, 402 
                
                return { "errors":  { "message": "Unauthorized Access!" } }, 402
            
            return { "errors": { "message": "Request can't be updated after it's accepted or declined!" } }, 402
        
        except Exception as e:
            db.session.rollback()
            print(e)
            return { "errors": { "message": "Something went wrong!" } }, 500 
    
    return { "errors": { "message": "Request not found!" } }, 404 

@rx_routes.route('/<int:id>/decline', methods=["PUT"])
def decline_request(id):
    user_id = current_user.id 
    # rx = Request.query.get(id)
    
    rx = db.session.get(Request, id)

    if rx:
        try:
            if not rx.accepted and not rx.declined:
                if rx.sender_id == user_id:
                    rx.declined = True
                    db.session.commit()

                    return rx.to_dict(), 201
                
                return { "errors": { "message": "Unauthorized Access!" } }, 402
            
            return { "errors": { "message": "Request can't be declined after it's accepted or declined!" } }, 402
        
        except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 
    
    return { "errors": { "message": "Request not found!" } }, 404 