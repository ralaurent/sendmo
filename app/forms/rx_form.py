from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, FloatField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import user

class RxForm(FlaskForm):
    amount = FloatField('amount', validators=[DataRequired()])
    sender = IntegerField('amount', validators=[DataRequired()])

class UpdateRxForm(FlaskForm):
    amount = FloatField('amount', validators=[DataRequired()])