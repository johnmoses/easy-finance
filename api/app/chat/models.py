from datetime import datetime
from app.extensions import db

class ChatRoom(db.Model):
    __tablename__ = 'chat_rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    messages = db.relationship('ChatMessage', backref='room', lazy='dynamic')
    participants = db.relationship('ChatParticipant', backref='room', lazy='dynamic')
    
class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('chat_rooms.id'), nullable=False)
    sender_id = db.Column(db.Integer, nullable=False)  # User ID from auth blueprint
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    role = db.Column(db.String(50), nullable=False, default='user')  # user, advisor, assistant, admin
    is_ai = db.Column(db.Boolean, default=False)

    message_type = db.Column(db.String(50), default='text')  # text, transaction, alert, chart, system
    status = db.Column(db.String(50), default='sent')       # sent, delivered, read, etc.

class ChatParticipant(db.Model):
    __tablename__ = 'chat_participants'
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('chat_rooms.id'), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('room_id', 'user_id', name='_room_user_uc'),)

