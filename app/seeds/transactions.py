from app.models import db, Transaction, environment, SCHEMA
from sqlalchemy.sql import text

def seed_transactions():
    tx1 = Transaction(
        amount=100, sender_id=3, recipient_id=1, strict_mode=True)
    tx2 = Transaction(
        amount=20, sender_id=2,  recipient_id=3, strict_mode=True)
    tx3 = Transaction(
        amount=30, sender_id=1, recipient_id=2, strict_mode=True)
    tx4 = Transaction(amount=50, sender_id=1, recipient_id=2, strict_mode=True)
    tx5 = Transaction(amount=25, sender_id=1, recipient_id=3, strict_mode=True)
    tx6 = Transaction(amount=15, sender_id=1, recipient_id=3, strict_mode=True)
    tx7 = Transaction(amount=40, sender_id=1, recipient_id=2, strict_mode=True)
    tx8 = Transaction(amount=10, sender_id=1, recipient_id=3, strict_mode=True)
    tx9 = Transaction(amount=18, sender_id=2, recipient_id=1, strict_mode=True)
    tx10 = Transaction(amount=22, sender_id=2, recipient_id=3, strict_mode=True)
    tx11 = Transaction(amount=30, sender_id=2, recipient_id=1, strict_mode=True)
    tx12 = Transaction(amount=15, sender_id=2, recipient_id=1, strict_mode=True)
    tx13 = Transaction(amount=25, sender_id=2, recipient_id=3, strict_mode=True)
    tx14 = Transaction(amount=35, sender_id=3, recipient_id=1, strict_mode=True)
    tx15 = Transaction(amount=20, sender_id=3, recipient_id=2, strict_mode=True)
    tx16 = Transaction(amount=12, sender_id=3, recipient_id=1, strict_mode=True)
    tx17 = Transaction(amount=28, sender_id=3, recipient_id=2, strict_mode=True)
    tx18 = Transaction(amount=22, sender_id=3, recipient_id=1, strict_mode=True)

    db.session.add(tx1)
    db.session.add(tx2)
    db.session.add(tx3)
    db.session.add_all([tx4, tx5, tx6, tx7, tx8, tx9, tx10, tx11, tx12, tx13, tx14, tx15, tx16, tx17, tx18])
    db.session.commit()

def undo_transactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transactions"))
        
    db.session.commit()