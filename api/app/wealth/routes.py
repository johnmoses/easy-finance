from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.wealth.models import Investment, SavingsGoal, Notification, PriceAlert
from app.extensions import db
from datetime import datetime, date

wealth_bp = Blueprint("wealth", __name__)

# ===== INVESTMENTS ROUTES =====
@wealth_bp.route("/investments", methods=["GET"])
@jwt_required()
def get_investments():
    user_id = get_jwt_identity()
    investments = Investment.query.filter_by(user_id=user_id).all()
    results = [{
        "id": inv.id,
        "symbol": inv.symbol,
        "name": inv.name,
        "quantity": inv.quantity,
        "purchase_price": inv.purchase_price,
        "current_price": inv.current_price,
        "total_value": inv.total_value,
        "profit_loss": inv.profit_loss,
        "profit_loss_percentage": inv.profit_loss_percentage,
        "investment_type": inv.investment_type
    } for inv in investments]
    return jsonify(results)

@wealth_bp.route("/investments", methods=["POST"])
@jwt_required()
def create_investment():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    investment = Investment(
        symbol=data.get("symbol"),
        name=data.get("name"),
        quantity=data.get("quantity"),
        purchase_price=data.get("purchase_price"),
        current_price=data.get("current_price", data.get("purchase_price")),
        investment_type=data.get("investment_type", "stock"),
        user_id=get_jwt_identity(),
        account_id=data.get("account_id")
    )
    
    try:
        db.session.add(investment)
        db.session.commit()
        return jsonify({"id": investment.id, "message": "Investment created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create investment"}), 500

@wealth_bp.route("/portfolio-summary", methods=["GET"])
@jwt_required()
def portfolio_summary():
    user_id = get_jwt_identity()
    investments = Investment.query.filter_by(user_id=user_id).all()
    
    total_value = sum(inv.total_value for inv in investments)
    total_cost = sum(inv.purchase_price * inv.quantity for inv in investments)
    total_profit_loss = total_value - total_cost
    
    return jsonify({
        "total_investments": len(investments),
        "total_value": total_value,
        "total_cost": total_cost,
        "total_profit_loss": total_profit_loss,
        "profit_loss_percentage": (total_profit_loss / total_cost * 100) if total_cost > 0 else 0
    })

# ===== GOALS ROUTES =====
@wealth_bp.route("/goals", methods=["GET"])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    goals = SavingsGoal.query.filter_by(user_id=user_id).all()
    results = [{
        "id": goal.id,
        "name": goal.name,
        "description": goal.description,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "progress_percentage": goal.progress_percentage,
        "remaining_amount": goal.remaining_amount,
        "target_date": goal.target_date.isoformat() if goal.target_date else None,
        "days_remaining": goal.days_remaining,
        "priority": goal.priority,
        "is_completed": goal.is_completed
    } for goal in goals]
    return jsonify(results)

@wealth_bp.route("/goals", methods=["POST"])
@jwt_required()
def create_goal():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    # Parse target_date if provided
    target_date = None
    if data.get("target_date"):
        try:
            target_date = datetime.strptime(data["target_date"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    
    # Validate required fields
    if not data.get("name"):
        return jsonify({"error": "Goal name is required"}), 400
    if not data.get("target_amount") or data.get("target_amount") <= 0:
        return jsonify({"error": "Target amount must be positive"}), 400
    
    goal = SavingsGoal(
        name=data.get("name"),
        description=data.get("description"),
        target_amount=float(data.get("target_amount")),
        target_date=target_date,
        priority=data.get("priority", "medium"),
        user_id=get_jwt_identity()
    )
    
    try:
        db.session.add(goal)
        db.session.commit()
        return jsonify({"id": goal.id, "message": "Goal created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create goal: {str(e)}"}), 500

@wealth_bp.route("/goals/<int:goal_id>/contribute", methods=["POST"])
@jwt_required()
def contribute_to_goal(goal_id):
    user_id = get_jwt_identity()
    goal = SavingsGoal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found"}), 404
    
    data = request.get_json()
    amount = data.get("amount", 0)
    
    if amount <= 0:
        return jsonify({"error": "Amount must be positive"}), 400
    
    try:
        goal.current_amount += amount
        if goal.current_amount >= goal.target_amount:
            goal.is_completed = True
        db.session.commit()
        return jsonify({
            "message": "Contribution added",
            "current_amount": goal.current_amount,
            "progress_percentage": goal.progress_percentage,
            "is_completed": goal.is_completed
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add contribution"}), 500

@wealth_bp.route("/wealth-summary", methods=["GET"])
@jwt_required()
def wealth_summary():
    user_id = get_jwt_identity()
    
    # Investment summary
    investments = Investment.query.filter_by(user_id=user_id).all()
    portfolio_value = sum(inv.total_value for inv in investments)
    
    # Goals summary
    goals = SavingsGoal.query.filter_by(user_id=user_id).all()
    total_goal_amount = sum(goal.target_amount for goal in goals)
    total_saved = sum(goal.current_amount for goal in goals)
    completed_goals = len([g for g in goals if g.is_completed])
    
    return jsonify({
        "portfolio_value": portfolio_value,
        "total_investments": len(investments),
        "total_goals": len(goals),
        "completed_goals": completed_goals,
        "total_goal_amount": total_goal_amount,
        "total_saved": total_saved,
        "savings_progress": (total_saved / total_goal_amount * 100) if total_goal_amount > 0 else 0
    })
# ===== NOTIFICATIONS ROUTES =====
@wealth_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    results = [{
        "id": notif.id,
        "title": notif.title,
        "message": notif.message,
        "notification_type": notif.notification_type,
        "priority": notif.priority,
        "is_read": notif.is_read,
        "action_url": notif.action_url,
        "created_at": notif.created_at.isoformat()
    } for notif in notifications]
    return jsonify(results)

@wealth_bp.route("/notifications/<int:notification_id>/read", methods=["PUT"])
@jwt_required()
def mark_notification_read(notification_id):
    user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
    if not notification:
        return jsonify({"error": "Notification not found"}), 404
    
    try:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "Notification marked as read"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update notification"}), 500

@wealth_bp.route("/price-alerts", methods=["GET"])
@jwt_required()
def get_price_alerts():
    user_id = get_jwt_identity()
    alerts = PriceAlert.query.filter_by(user_id=user_id, is_active=True).all()
    results = [{
        "id": alert.id,
        "symbol": alert.symbol,
        "target_price": alert.target_price,
        "condition": alert.condition,
        "is_triggered": alert.is_triggered
    } for alert in alerts]
    return jsonify(results)

@wealth_bp.route("/price-alerts", methods=["POST"])
@jwt_required()
def create_price_alert():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    alert = PriceAlert(
        symbol=data.get("symbol"),
        target_price=data.get("target_price"),
        condition=data.get("condition"),
        user_id=get_jwt_identity()
    )
    
    try:
        db.session.add(alert)
        db.session.commit()
        return jsonify({"id": alert.id, "message": "Price alert created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create price alert"}), 500