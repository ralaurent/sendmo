from flask import Blueprint, request
from app.models import User, Transaction, Comment, db
from app.forms import TxForm, CommentForm
from flask_login import current_user, login_user, logout_user, login_required
from datetime import datetime, timedelta
from sqlalchemy import or_

tx_routes = Blueprint('transactions', __name__)

@tx_routes.route('')
def get_all_transactions():
    txs = Transaction.query.all()
    return {"Transactions": [tx.to_dict() for tx in txs]}

@tx_routes.route('/current')
def get_current_users_transactions():
    user_id = current_user.id 
    txs = Transaction.query.filter(or_(Transaction.sender_id == user_id, Transaction.recipient_id == user_id)).all()
    return {"Transactions": [tx.to_dict() for tx in txs]}

@tx_routes.route('', methods=["POST"])
def send_transaction():
    user_id = current_user.id 
    from_sendmo_balance = request.get_json()["type"]
    strict_mode = request.get_json()["strict"]

    form = TxForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # sender = User.query.get(user_id)
        # recipient = User.query.get(form.recipient.data)

        sender = db.session.get(User, user_id)
        recipient = db.session.get(User, form.recipient.data)
        try:
            if round(form.amount.data, 5) > 0:

                if from_sendmo_balance:

                    if round(form.amount.data, 5) <= round(sender.balance, 5):
                        sender.balance = round(sender.balance, 5) - round(form.amount.data, 5) 
                        db.session.commit()

                    else:
                        return { "errors": { "message": "Insufficient funds!" } }, 402 
                    
                recipient.balance = round(recipient.balance, 5) + round(form.amount.data, 5) 
                db.session.commit()
            
            
                params = {
                    "sender_id": user_id,
                    "recipient_id": form.recipient.data,
                    "amount": form.amount.data,
                    "strict_mode": strict_mode
                }

                tx = Transaction(**params)

                db.session.add(tx)
                db.session.commit()

                return tx.to_dict(), 201
            
            return { "errors": { "message": "Invalid amount!" } }, 402
            
        except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 

    return form.errors, 422

@tx_routes.route('/<int:id>', methods=["DELETE"])
def delete_transaction(id):
    user_id = current_user.id 

    tx = Transaction.query.get(id)

    if tx:
        sender = User.query.get(user_id)
        recipient = User.query.get(tx.recipient_id)

        delay = datetime.utcnow() - tx.created_at
        # if (tx.strict_mode and delay <= timedelta(minutes=1)) or not tx.strict_mode:
        if (tx.strict_mode and delay <= timedelta(seconds=30)) or not tx.strict_mode:
            if tx.sender_id == user_id:

                try:
                    sender.balance = round(sender.balance, 5) + round(tx.amount, 5) 
                    db.session.commit()

                    recipient.balance = round(recipient.balance, 5) - round(tx.amount, 5) 
                    db.session.commit()

                    db.session.delete(tx)
                    db.session.commit()

                    return { "message": "Successfully deleted!" }, 200 
                
                except Exception as e:
                    db.session.rollback()
                    return { "errors": { "message": "Something went wrong!" } }, 500 
        
            return { "errors": { "message": "Unauthorized Access!" } }, 402
        
        return { "errors": { "message": "Too much time has elapsed!" } }, 402
    
    return { "errors": { "message": "Transaction not found!" } }, 404 

@tx_routes.route('/<int:id>/comments')
def get_transaction_comment(id):
    comments = Comment.query.filter(Comment.transaction_id == id).first()
    return { "Comments": comments.to_dict() }

@tx_routes.route('/<int:id>/comments', methods=["POST"])
def add_comment_to_transaction(id):
    tx = Transaction.query.get(id)
    comments = Comment.query.all()

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if tx:
        if len(comments) < 2:
            if form.validate_on_submit():
                
                    params = {
                        "transaction_id": tx.id,
                        "content": form.content.data,
                    }

                    tx_comment = Comment(**params)

                    db.session.add(tx_comment)
                    db.session.commit()

                    return { "Comment": tx_comment.to_dict() }

            return form.errors, 422
        
        return { "errors": { "message": "Comment limit reached!" } }, 402
            
    return { "errors": { "message": "Transaction not found!" } }, 404 