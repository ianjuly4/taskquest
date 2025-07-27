from sqlalchemy.orm import validates, relationship
from sqlalchemy import ForeignKey
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-tasks.user', '-dates.user', '-user.dates', '-user.tasks', '-date.tasks', '-tasks.date')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)

    dates = relationship('Date', back_populates='user', cascade="all, delete-orphan")
    tasks = relationship('Task', back_populates='user', cascade="all, delete-orphan")

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username cannot be empty")
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters")
        return username

    @validates('password_hash')
    def validate_password_hash(self, key, password_hash):
        if not password_hash:
            raise ValueError("Password hash cannot be empty")
        return password_hash


class Date(db.Model, SerializerMixin):
    __tablename__ = 'dates'

    serialize_rules = ('-user.date', '-tasks.date', '-dates.user', '-date.tasks', '-user.tasks','-tasks.user' )

    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, nullable=False)

    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    user = relationship('User', back_populates='dates')
    tasks = relationship('Task', back_populates='date', cascade="all, delete-orphan")

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    serialize_rules = ('-user.tasks', '-date.tasks',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)  
    category = db.Column(db.String, nullable=True) 
    duration_minutes = db.Column(db.Integer, nullable=True)  
    due_datetime = db.Column(db.DateTime, nullable=True)    
    status = db.Column(db.String, nullable=False, default="pending")
    color = db.Column(db.String, nullable=True)
    color_meaning = db.Column(db.String, nullable=True)
    repeat = db.Column(db.String, nullable=True)
    comments = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text, nullable=True)
    repeat_group_id = db.Column(db.String(36), nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date_id = db.Column(db.Integer, db.ForeignKey('dates.id'), nullable=True)  

    user = relationship('User', back_populates='tasks')
    date = relationship('Date', back_populates='tasks')

