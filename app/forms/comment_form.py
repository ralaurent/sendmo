from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, TextAreaField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import user

class CommentForm(FlaskForm):
    content = TextAreaField('content', validators=[DataRequired()])