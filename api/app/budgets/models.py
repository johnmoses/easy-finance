from app.extensions import db
from datetime import date

class Budget(db.Model):
    __tablename__ = "budget"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    limit = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    period_start = db.Column(db.Date, nullable=False, default=date.today)
    period_end = db.Column(db.Date, nullable=False)
