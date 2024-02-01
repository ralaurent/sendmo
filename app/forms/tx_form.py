from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, FloatField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import user

class TxForm(FlaskForm):
    username = StringField('payment_method')
    type = BooleanField('type', false_values=(False, 'false'))
    amount = FloatField('amount', validators=[DataRequired()])
    recipient = IntegerField('amount', validators=[DataRequired()])