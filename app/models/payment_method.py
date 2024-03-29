from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class PaymentMethod(db.Model):
    __tablename__ = "payment_methods"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    last_4_digits = db.Column(db.String(4), nullable=True)
    cvc = db.Column(db.String(3), nullable=True)
    exp_date = db.Column(db.String(5), nullable=True)
    payment_method_id = db.Column(db.Integer, nullable=True)
    access_token = db.Column(db.String, nullable=True)
    item_id = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user_payment_method = db.relationship("User", back_populates="payment_method")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'last_4_digits': self.last_4_digits,
            'exp_date': self.exp_date,
            'cvc': self.cvc,
            # 'payment_method_id': self.payment_method_id,
            'created_at': self.created_at
        }
