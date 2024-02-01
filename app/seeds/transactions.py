from app.models import db, Transaction, environment, SCHEMA
from sqlalchemy.sql import text

def seed_transactions():
    tx1 = Transaction(
        amount=100, sender_id=3, recipient_id=1)
    tx2 = Transaction(
        amount=20, sender_id=2,  recipient_id=3)
    tx3 = Transaction(
        amount=30, sender_id=1, recipient_id=2)

    db.session.add(tx1)
    db.session.add(tx2)
    db.session.add(tx3)
    db.session.commit()

def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transactions"))
        
    db.session.commit()