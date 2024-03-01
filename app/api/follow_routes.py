from flask import Blueprint, request
from app.models import User, Transaction, Request, PaymentMethod, Following, db
from app.forms import TxForm, RxForm, PaymentMethodForm
from flask_login import current_user, login_user, logout_user, login_required
from datetime import datetime, timedelta
from sqlalchemy import and_

follow_routes = Blueprint('follow', __name__)

@follow_routes.route('/<int:id>', methods=["POST"])
def follow_user(id):
    user_id = current_user.id 

    following = db.session.query(Following).filter(and_(Following.follower_id == user_id, Following.following_id == id)).first()

    if not following:
        try:
            params = {
                "follower_id": user_id,
                "following_id": id,
            }

            follow = Following(**params)

            db.session.add(follow)
            db.session.commit() 

            return { "message": "Successfully followed!" }, 200
        
        except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 
        
    return { "errors": { "message": "Already following user!" } }, 404

@follow_routes.route('/<int:id>', methods=["DELETE"])
def unfollow_user(id):
    user_id = current_user.id 
    # following = Following.query.filter(and_(Following.follower_id == user_id, Following.following_id == id)).first()

    following = db.session.query(Following).filter(and_(Following.follower_id == user_id, Following.following_id == id)).first()

    if following:
        try:
            db.session.delete(following)
            db.session.commit()

            return { "message": "Successfully unfollowed!" }, 200
        
        except Exception as e:
            db.session.rollback()
            return { "errors": { "message": "Something went wrong!" } }, 500 
    
    return { "errors": { "message": "Not currently following user!" } }, 404