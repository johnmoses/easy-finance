from datetime import datetime
from app import db # Assuming 'db' is initialized in app/__init__.py

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    sender = db.Column(db.String(20), nullable=False) # 'user' or 'assistant'
    message_text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Optional: If you want to link messages to a specific conversation session
    # session_id = db.Column(db.String(255), index=True, nullable=True)

    def __repr__(self):
        return f'<ChatMessage id={self.id} user_id={self.user_id} sender={self.sender} at {self.timestamp}>'
