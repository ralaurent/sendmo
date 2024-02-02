from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, FloatField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import user

class PaymentMethodForm(FlaskForm):
    exp = StringField('expiry date', validators=[DataRequired()])
    card = StringField('card number', validators=[DataRequired()])
    cvc = StringField('cvc', validators=[DataRequired()])
