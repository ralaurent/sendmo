from .db import db
from datetime import datetime

class PaymentMethod(db.Model):
    __tablename__ = "payment_methods"

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    last_4_digits = db.Column(db.String(4), nullable=True)
    exp_date = db.Column(db.String(5), nullable=True)
    payment_method_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user_payment_method = db.relationship("User", back_populates="payment_method")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'last_4_digits': self.last_4_digits,
            'exp_date': self.exp_date,
            # 'payment_method_id': self.payment_method_id,
            'created_at': self.created_at
        }
