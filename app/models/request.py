from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Request(db.Model):
    __tablename__ = "requests"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    requester_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    accepted = db.Column(db.Boolean, nullable=False, default=False)
    declined = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    requester = db.relationship("User", foreign_keys=[requester_id], back_populates="request_tx")
    sender = db.relationship("User", foreign_keys=[sender_id], back_populates="request_rx")

    def to_dict(self):
        return {
            'id': self.id,
            'requester_id': self.requester_id,
            'sender_id': self.sender_id,
            'requester_name': self.requester.username,
            'sender_name': self.sender.username,
            'amount': self.amount,
            'accepted': self.accepted,
            'declined': self.declined,
            'created_at': self.created_at
        }

