from app.models import db, Request, environment, SCHEMA
from sqlalchemy.sql import text

def seed_requests():
    rx1 = Request(
        amount=100, requester_id=1, sender_id=2)
    rx2 = Request(
        amount=20, requester_id=1,  sender_id=3)
    rx3 = Request(
        amount=30, requester_id=2, sender_id=3)

    db.session.add(rx1)
    db.session.add(rx2)
    db.session.add(rx3)
    db.session.commit()

def undo_requests():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.requests RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM requests"))
        
    db.session.commit()