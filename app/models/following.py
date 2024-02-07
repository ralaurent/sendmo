from .db import db
from datetime import datetime

class Following(db.Model):
    __tablename__ = "following"

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    following_id = db.Column(db.String(140), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    following = db.relationship("User", back_populates="user")

    def to_dict(self):
        return {
            'id': self.id,
            'follower_id': self.follower_id,
            'following_id': self.following_id,
            'created_at': self.created_at
        }
