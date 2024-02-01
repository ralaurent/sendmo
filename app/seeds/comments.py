from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comments():
    rx1 = Comment(
        transaction_id=1, content="Transaction Comment")
    rx2 = Comment(
        transaction_id=2,  content="Transaction Comment")
    rx3 = Comment(
        transaction_id=3, content="...")

    db.session.add(rx1)
    db.session.add(rx2)
    db.session.add(rx3)
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()