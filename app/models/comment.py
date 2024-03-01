from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Comment(db.Model):
    __tablename__ = "comments"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("transactions.id")), nullable=False)
    content = db.Column(db.String(140), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    transaction = db.relationship("Transaction", back_populates="tx_comment", cascade="all, delete-orphan", single_parent=True)

    def to_dict(self):
        return {
            'id': self.id,
            'transaction_id': self.transaction_id,
            'content': self.content,
            'created_at': self.created_at
        }
