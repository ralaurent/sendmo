from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, FloatField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import user

class RxForm(FlaskForm):
    username = StringField('payment_method')
    type = BooleanField('type', validators=[DataRequired()])
    amount = FloatField('amount', validators=[DataRequired()])
    recipient = IntegerField('amount', validators=[DataRequired()])