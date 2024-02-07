from flask import Blueprint, request
from app.models import User, Transaction, Request, PaymentMethod, Following, db
from app.forms import TxForm, RxForm, PaymentMethodForm
from flask_login import current_user, login_user, logout_user, login_required
from datetime import datetime, timedelta
from sqlalchemy import and_

follow_routes = Blueprint('follow', __name__)

@follow_routes.route('/')
def get_user_following(id):
    user_id = current_user.id 
    following = Following.query.filter(Following.subscriber_id == user_id).all()
    return {"Following": [follow.to_dict() for follow in following]}

@follow_routes.route('/<int:id>', methods=["POST"])
def follow_user(id):
    user_id = current_user.id 

    try:
        params = {
            "subscriber_id": user_id,
            "subscribed_id": id,
        }

        follow = Following(**params)

        db.session.add(follow)
        db.session.commit() 

        return { "Following": follow.to_dict() }, 201
    
    except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 

@follow_routes.route('/<int:id>', methods=["DELETE"])
def unfollow_user(id):
    user_id = current_user.id 
    following = Following.query.filter(and_(Following.subscriber_id == user_id, Following.subscribed_id == id)).all()

    if following:
        try:
            db.session.delete(following)
            db.session.commit()

            return { "message": "Successfully deleted!" }, 201
        
        except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 
    
    return { "errors": { "message": "Not currently following user!" } }, 404