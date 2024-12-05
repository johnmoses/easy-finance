import datetime
from config.db import db

class Portfolio(db.Model):
    __tablename__ = 'portfolios_portfolio'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(15), nullable=False)
    description = db.Column(db.String(225), nullable=True)
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
        return 'Portfolio {}'.format(self.id)
