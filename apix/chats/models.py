import datetime
from config.db import db

class Chat(db.Model):
    __tablename__ = 'chats_chat'

    id = db.Column(db.BigInteger(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(100), nullable=True)
    pic = db.Column(db.String(50), nullable=True)
    pic1 = db.Column(db.String(50), nullable=True)
    pic2 = db.Column(db.String(50), nullable=True)
    is_bot = db.Column(db.Boolean, default=False)
    is_private = db.Column(db.Boolean, default=False)
    last_content = db.Column(db.String(100), nullable=True)
    unread_messages = db.Column(db.Integer, default=0)
    starter_id = db.Column(db.Integer, db.ForeignKey('User.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    is_modified = db.Column(db.Boolean, default=False)
    modified_at = db.Column(db.DateTime, onupdate=db.func.now())
    is_deleted = db.Column(db.Boolean, default=False)
    deleted_at = db.Column(db.DateTime, default=datetime.datetime.now())
    restored_at = db.Column(db.DateTime, default=datetime.datetime.now())

    starter = db.relationship('User', backref="chatschatstarter", cascade='all,delete')
    participants = db.relationship('User', backref='chatschatparticipants', secondary='chats_users', viewonly=True, cascade='all,delete')
    messages = db.relationship('Message', backref='chatschatmessages', cascade='all,delete')

    def __init__(self, name, starter_id):
        self.name = name
        self.starter_id = starter_id

    def __repr__(self):
        return 'Chat {}'.format(self.id)


class Message(db.Model):
    __tablename__ = 'chats_message'

    id = db.Column(db.BigInteger(), primary_key=True, autoincrement=True)
    idx = db.Column(db.Text(), nullable=True)
    content = db.Column(db.Text(), nullable=True)
    attachment = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    read_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)
    deleted_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    chat_id = db.Column(db.Integer, db.ForeignKey('chats_chat.id'))
    sender_id = db.Column(db.Integer, db.ForeignKey('User.id'))

    chat = db.relationship("Chat", backref="chatsmessagechat", viewonly=True, cascade='all,delete')
    sender = db.relationship('User', backref="chatsmessagesender", cascade='all,delete')

    def __init__(self, content, attachment, chat_id, sender_id):
        self.content = content
        self.attachment = attachment
        self.chat_id = chat_id
        self.sender_id = sender_id

    def __repr__(self):
        return 'Message {}'.format(self.id)
