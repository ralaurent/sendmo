from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Following(db.Model):
    __tablename__ = "following"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    following_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="follows")

    def to_dict(self):
        return {
            'id': self.id,
            'follower_id': self.follower_id,
            'following_id': self.following_id,
            'created_at': self.created_at
        }
