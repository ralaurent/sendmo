from .db import db
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    strict_mode = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    sender = db.relationship("User", foreign_keys=[sender_id], back_populates="send_tx")
    recipient = db.relationship("User", foreign_keys=[recipient_id], back_populates="send_rx")
    tx_comment = db.relationship("Comment", back_populates="transaction", cascade="all, delete-orphan")

    def to_dict(self):
        content = None
        if self.tx_comment:
            content = self.tx_comment[0].content

        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'recipient_id': self.recipient_id,
            'sender_name': self.sender.username,
            'recipient_name': self.recipient.username,
            'amount': self.amount,
            'strict_mode': self.strict_mode,
            'comment': content,
            'created_at': self.created_at
        }
