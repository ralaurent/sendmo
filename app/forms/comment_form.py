from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import user

class CommentForm(FlaskForm):
    content = StringField('content', validators=[DataRequired(), Length(max=140)])