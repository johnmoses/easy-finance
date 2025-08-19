from app.extensions import db
from datetime import datetime, date

class Investment(db.Model):
    __tablename__ = "investments"
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), nullable=False)  # AAPL, BTC, etc.
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    purchase_price = db.Column(db.Float, nullable=False)
    current_price = db.Column(db.Float, default=0.0)
    investment_type = db.Column(db.String(20), default='stock')  # stock, crypto, bond
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=True)
    purchase_date = db.Column(db.Date, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    @property
    def total_value(self):
        return self.quantity * self.current_price
    
    @property
    def profit_loss(self):
        return (self.current_price - self.purchase_price) * self.quantity
    
    @property
    def profit_loss_percentage(self):
        if self.purchase_price > 0:
            return ((self.current_price - self.purchase_price) / self.purchase_price) * 100
        return 0

class SavingsGoal(db.Model):
    __tablename__ = "savings_goals"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, default=0.0)
    deadline = db.Column(db.Date)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    @property
    def progress_percentage(self):
        if self.target_amount > 0:
            return min((self.current_amount / self.target_amount) * 100, 100)
        return 0
    
    @property
    def remaining_amount(self):
        return max(self.target_amount - self.current_amount, 0)
    
    @property
    def days_remaining(self):
        if self.deadline:
            delta = self.deadline - date.today()
            return max(delta.days, 0)
        return None

class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notification_type = db.Column(db.String(50), nullable=False)  # budget_alert, bill_due, price_alert, defi_reward
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, urgent
    is_read = db.Column(db.Boolean, default=False)
    action_url = db.Column(db.String(200))  # Optional URL for action
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    read_at = db.Column(db.DateTime)

class PriceAlert(db.Model):
    __tablename__ = "price_alerts"
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), nullable=False)  # BTC, ETH, AAPL
    target_price = db.Column(db.Float, nullable=False)
    condition = db.Column(db.String(10), nullable=False)  # above, below
    is_active = db.Column(db.Boolean, default=True)
    is_triggered = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    triggered_at = db.Column(db.DateTime)