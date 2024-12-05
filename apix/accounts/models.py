import datetime
from config.db import db

class ChatsUsers(db.Model):
    __tablename__ = 'chats_users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    chat_id = db.Column(db.Integer, db.ForeignKey("chats_chat.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("User.id"))

    chat = db.relationship('Chat', backref='chatsuserschat', cascade='all,delete')
    user = db.relationship('User', backref='chatsusersuser', cascade='all,delete')

class User(db.Model):
    __tablename__ = 'User'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    first_name = db.Column(db.String(20), nullable=True)
    last_name = db.Column(db.String(20), nullable=True)
    avatar = db.Column(db.String(20), nullable=True)
    mobile = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(50), nullable=True)
    gender = db.Column(db.String(5), nullable=True)
    bio = db.Column(db.String(100), nullable=True)
    address = db.Column(db.String(100), nullable=True)
    birth_date = db.Column(db.DateTime, nullable=True)
    preferences = db.Column(db.String(50), nullable=True)
    is_bot = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    is_used = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_superuser = db.Column(db.Boolean, default=False)
    is_staff = db.Column(db.Boolean, default=False)
    is_active= db.Column(db.Boolean, default=False)
    date_joined = db.Column(db.DateTime, default=datetime.datetime.now())
    is_modified = db.Column(db.Boolean, default=False)
    modified_at = db.Column(db.DateTime, default=datetime.datetime.now())
    is_deleted = db.Column(db.Boolean, default=False)
    deleted_at = db.Column(db.DateTime, default=datetime.datetime.now())
    restored_at = db.Column(db.DateTime, default=datetime.datetime.now())

    chats = db.relationship("Chat", backref="userchats",secondary="chats_users", viewonly=True, cascade='all,delete')
   
    def __init__(self, username, password, email, mobile):
        self.username = username
        self.password = password
        self.email = email
        self.mobile = mobile

    def __repr__(self):
        return 'User {}'.format(self.id)
    