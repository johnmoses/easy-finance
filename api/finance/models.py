import json
from datetime import datetime
from config.db import db


class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(120), nullable=False)
    recipient = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'sender': self.sender,
            'recipient': self.recipient,
            'amount': self.amount,
            'timestamp': self.timestamp.isoformat()
        }


class Block(db.Model):
    __tablename__ = "blocks"
    id = db.Column(db.Integer, primary_key=True)
    index = db.Column(db.Integer, unique=True, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    transactions = db.Column(db.Text, nullable=False)  # Store JSON string
    proof = db.Column(db.Integer, nullable=False)
    previous_hash = db.Column(db.String(64), nullable=False)

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp.isoformat(),
            "transactions": json.loads(self.transactions),
            "proof": self.proof,
            "previous_hash": self.previous_hash,
        }
