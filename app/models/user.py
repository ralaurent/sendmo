from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    balance = db.Column(db.Float, nullable=False, default=0)
    card_added = db.Column(db.Boolean, nullable=False, default=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    send_tx = db.relationship("Transaction", foreign_keys="[Transaction.sender_id]", back_populates="sender")
    send_rx = db.relationship("Transaction", foreign_keys="[Transaction.recipient_id]", back_populates="recipient")
    request_tx = db.relationship("Request", foreign_keys="[Request.requester_id]", back_populates="requester")
    request_rx = db.relationship("Request", foreign_keys="[Request.sender_id]", back_populates="sender")
    payment_method = db.relationship("PaymentMethod", back_populates="user_payment_method")
    user = db.relationship("Following", back_populates="following")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'balance': self.balance,
            'card_added': self.card_added,
            'email': self.email
        }
