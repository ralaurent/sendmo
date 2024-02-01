from app.models import db, PaymentMethod, environment, SCHEMA
from sqlalchemy.sql import text

def seed_payment_methods():
    amex = PaymentMethod(
        user_id=1, last_4_digits='4563', exp_date='12/34')
    mastercard = PaymentMethod(
        user_id=2, last_4_digits='7865',  exp_date='11/45')
    visa = PaymentMethod(
        user_id=3, last_4_digits='6798', exp_date='12/23')

    db.session.add(amex)
    db.session.add(mastercard)
    db.session.add(visa)
    db.session.commit()

def undo_payment_methods():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.payment_methods RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM payment_methods"))
        
    db.session.commit()