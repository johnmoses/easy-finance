import datetime
from config.db import db

class Account(db.Model):
    __tablename__ = 'finance_account'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(15), nullable=False)
    description = db.Column(db.String(225), nullable=True)
    balance = db.Column(db.Float, nullable=True)
    currency = db.Column(db.String(15), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    is_modified = db.Column(db.Boolean, default=False)
    modified_at = db.Column(db.DateTime, default=datetime.datetime.now())
    is_deleted = db.Column(db.Boolean, default=False)
    deleted_at = db.Column(db.DateTime, default=datetime.datetime.now())
    restored_at = db.Column(db.DateTime, default=datetime.datetime.now())

    def __init__(self, name, description):
        self.name = name
        self.description = description

    def __repr__(self):
        return 'Account {}'.format(self.id)

class Transaction(db.Model):
    __tablename__ = 'finance_transaction'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(225), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    account_id = db.Column(db.Integer, db.ForeignKey('finance_account.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('User.id'))

    account = db.relationship("Account", backref="accounttransactions", viewonly=True, cascade='all,delete')
    user = db.relationship('User', backref="usertransactions", cascade='all,delete')


    def __init__(self, amount, description):
        self.amount = amount
        self.description = description

    def __repr__(self):
        return 'Transaction {}'.format(self.id)
    