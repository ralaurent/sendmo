from app.models import db, Request, environment, SCHEMA
from sqlalchemy.sql import text

def seed_requests():
    rx1 = Request(
        amount=100, requester_id=1, sender_id=2, declined=True)
    rx2 = Request(
        amount=20, requester_id=1,  sender_id=3, accepted=True)
    rx3 = Request(
        amount=30, requester_id=2, sender_id=3)
    rx4 = Request(amount=50, requester_id=1, sender_id=3, accepted=True)
    rx5 = Request(amount=25, requester_id=1, sender_id=2, declined=True)
    rx6 = Request(amount=15, requester_id=1, sender_id=3)
    rx7 = Request(amount=4, requester_id=1, sender_id=2)
    rx8 = Request(amount=10, requester_id=1, sender_id=2, accepted=True)
    rx9 = Request(amount=18, requester_id=2, sender_id=3, declined=True)
    rx10 = Request(amount=22, requester_id=2, sender_id=1, accepted=True)
    rx11 = Request(amount=3, requester_id=2, sender_id=1)
    rx12 = Request(amount=15, requester_id=2, sender_id=3, accepted=True)
    rx13 = Request(amount=25, requester_id=2, sender_id=1, declined=True)
    rx14 = Request(amount=5, requester_id=3, sender_id=1)
    rx15 = Request(amount=20, requester_id=3, sender_id=2, declined=True)
    rx16 = Request(amount=12, requester_id=3, sender_id=1, accepted=True)
    rx17 = Request(amount=28, requester_id=3, sender_id=2, accepted=True)
    rx18 = Request(amount=22, requester_id=3, sender_id=2, declined=True)

    db.session.add(rx1)
    db.session.add(rx2)
    db.session.add(rx3)
    db.session.add_all([rx4, rx5, rx6, rx7, rx8, rx9, rx10, rx11, rx12, rx13, rx14, rx15, rx16, rx17, rx18])
    db.session.commit()

def undo_requests():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.requests RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM requests"))
        
    db.session.commit()