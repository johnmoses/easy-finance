from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from datetime import datetime
import requests

from app.extensions import db
from app.wealth.models import Investment, SavingsGoal, Notification, PriceAlert
from app.wealth.schemas import InvestmentSchema, SavingsGoalSchema, PriceAlertSchema

wealth_bp = Blueprint('wealth', __name__)

investment_schema = InvestmentSchema()
savings_goal_schema = SavingsGoalSchema()
price_alert_schema = PriceAlertSchema()

@wealth_bp.route("/investments", methods=["GET"])
@jwt_required()
def get_investments():
    user_id = get_jwt_identity()
    investments = Investment.query.filter_by(user_id=user_id).all()
    return jsonify(investment_schema.dump(investments, many=True)), 200

@wealth_bp.route("/investments", methods=["POST"])
@jwt_required()
def create_investment():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    try:
        investment = investment_schema.load(data)
        investment.user_id = get_jwt_identity() # Set user_id after loading
        db.session.add(investment)
        db.session.commit()
        return jsonify(investment_schema.dump(investment)), 201
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 400
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
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    goals_query = SavingsGoal.query.filter_by(user_id=user_id)

    # Filtering options (example: by is_completed)
    is_completed = request.args.get('is_completed')
    if is_completed is not None:
        goals_query = goals_query.filter_by(is_completed=is_completed.lower() == 'true')

    # Filtering options (example: by priority)
    priority = request.args.get('priority')
    if priority:
        goals_query = goals_query.filter_by(priority=priority)

    goals_pagination = goals_query.paginate(page=page, per_page=per_page, error_out=False)
    goals = goals_pagination.items

    results = [{
        "id": goal.id,
        "name": goal.name,
        "description": goal.description,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "progress_percentage": goal.progress_percentage,
        "remaining_amount": goal.remaining_amount,
        "deadline": goal.deadline.isoformat() if goal.deadline else None,
        "days_remaining": goal.days_remaining,
        "priority": goal.priority,
        "is_completed": goal.is_completed
    } for goal in goals]
    return jsonify({
        "goals": results,
        "total_items": goals_pagination.total,
        "total_pages": goals_pagination.pages,
        "current_page": goals_pagination.page,
        "per_page": goals_pagination.per_page
    })

@wealth_bp.route("/goals/<int:goal_id>", methods=["PUT"])
@jwt_required()
def update_goal(goal_id):
    user_id = get_jwt_identity()
    goal = SavingsGoal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Parse deadline if provided
    deadline = None
    if data.get("deadline"):
        try:
            deadline = datetime.strptime(data["deadline"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    try:
        goal.name = data.get("name", goal.name)
        goal.description = data.get("description", goal.description)
        goal.target_amount = data.get("target_amount", goal.target_amount)
        goal.current_amount = data.get("current_amount", goal.current_amount)
        goal.deadline = deadline if deadline else goal.deadline
        goal.priority = data.get("priority", goal.priority)
        goal.is_completed = data.get("is_completed", goal.is_completed)

        db.session.commit()
        return jsonify({"id": goal.id, "message": "Goal updated"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update goal: {str(e)}"}), 500

@wealth_bp.route("/goals/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def delete_goal(goal_id):
    user_id = get_jwt_identity()
    goal = SavingsGoal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    try:
        db.session.delete(goal)
        db.session.commit()
        return jsonify({"message": "Goal deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete goal: {str(e)}"}), 500

@wealth_bp.route("/goals", methods=["POST"])
@jwt_required()
def create_goal():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    try:
        goal = savings_goal_schema.load(data)
        goal.user_id = get_jwt_identity()
        db.session.add(goal)
        db.session.commit()
        return jsonify(savings_goal_schema.dump(goal)), 201
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 400
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

# ===== MARKET DATA ROUTES =====
@wealth_bp.route("/market-data/<string:symbol>", methods=["GET"])
@jwt_required()
def get_market_data(symbol):
    print(f"Fetching market data for symbol: {symbol}")
    api_key = current_app.config.get("ALPHA_VANTAGE_API_KEY")
    if not api_key:
        print("Alpha Vantage API key not configured")
        return jsonify({"error": "Alpha Vantage API key not configured"}), 500

    url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        
        global_quote = data.get("Global Quote")
        if not global_quote:
            return jsonify({"error": "Invalid symbol or no data available"}), 404
            
        change_percent_str = global_quote.get("10. change percent", "0").replace("%", "")
        market_data = {
            "symbol": global_quote.get("01. symbol"),
            "price": float(global_quote.get("05. price")),
            "change": float(global_quote.get("09. change")),
            "change_percent": float(change_percent_str),
            "volume": int(global_quote.get("06. volume"))
        }
        return jsonify(market_data)
        
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch data from Alpha Vantage: {str(e)}")
        return jsonify({"error": f"Failed to fetch data from Alpha Vantage: {str(e)}"}), 500
    except (KeyError, ValueError) as e:
        print(f"Failed to parse data from Alpha Vantage: {str(e)}")
        return jsonify({"error": f"Failed to parse data from Alpha Vantage: {str(e)}"}), 500

# ===== ALERTS ROUTES =====
@wealth_bp.route("/alerts", methods=["GET"])
@jwt_required()
def get_alerts():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    notifications_query = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc())

    is_read = request.args.get('is_read')
    if is_read is not None:
        notifications_query = notifications_query.filter_by(is_read=is_read.lower() == 'true')

    notification_type = request.args.get('notification_type')
    if notification_type:
        notifications_query = notifications_query.filter_by(notification_type=notification_type)

    priority = request.args.get('priority')
    if priority:
        notifications_query = notifications_query.filter_by(priority=priority)

    notifications_pagination = notifications_query.paginate(page=page, per_page=per_page, error_out=False)
    notifications = notifications_pagination.items

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
    return jsonify({
        "alerts": results,
        "total_items": notifications_pagination.total,
        "total_pages": notifications_pagination.pages,
        "current_page": notifications_pagination.page,
        "per_page": notifications_pagination.per_page
    })

@wealth_bp.route("/alerts/<int:alert_id>/read", methods=["PUT"])
@jwt_required()
def mark_alert_read(alert_id):
    user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=alert_id, user_id=user_id).first()
    if not notification:
        return jsonify({"error": "Alert not found"}), 404
    
    try:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "Alert marked as read"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update alert"}), 500

@wealth_bp.route("/price-alerts", methods=["GET"])
@jwt_required()
def get_price_alerts():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    alerts_query = PriceAlert.query.filter_by(user_id=user_id)

    is_active = request.args.get('is_active')
    if is_active is not None:
        alerts_query = alerts_query.filter_by(is_active=is_active.lower() == 'true')

    symbol = request.args.get('symbol')
    if symbol:
        alerts_query = alerts_query.filter(PriceAlert.symbol.ilike(f'%{symbol}%'))

    condition = request.args.get('condition')
    if condition:
        alerts_query = alerts_query.filter_by(condition=condition)

    alerts_pagination = alerts_query.paginate(page=page, per_page=per_page, error_out=False)
    alerts = alerts_pagination.items

    results = [{
        "id": alert.id,
        "symbol": alert.symbol,
        "target_price": alert.target_price,
        "condition": alert.condition,
        "is_triggered": alert.is_triggered
    } for alert in alerts]
    return jsonify({
        "price_alerts": results,
        "total_items": alerts_pagination.total,
        "total_pages": alerts_pagination.pages,
        "current_page": alerts_pagination.page,
        "per_page": alerts_pagination.per_page
    })

@wealth_bp.route("/price-alerts/<int:alert_id>", methods=["PUT"])
@jwt_required()
def update_price_alert(alert_id):
    user_id = get_jwt_identity()
    alert = PriceAlert.query.filter_by(id=alert_id, user_id=user_id).first()
    if not alert:
        return jsonify({"error": "Price alert not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        alert.symbol = data.get("symbol", alert.symbol)
        alert.target_price = data.get("target_price", alert.target_price)
        alert.condition = data.get("condition", alert.condition)
        alert.is_active = data.get("is_active", alert.is_active)
        alert.is_triggered = data.get("is_triggered", alert.is_triggered)

        db.session.commit()
        return jsonify({"id": alert.id, "message": "Price alert updated"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update price alert: {str(e)}"}), 500

@wealth_bp.route("/price-alerts/<int:alert_id>", methods=["DELETE"])
@jwt_required()
def delete_price_alert(alert_id):
    user_id = get_jwt_identity()
    alert = PriceAlert.query.filter_by(id=alert_id, user_id=user_id).first()
    if not alert:
        return jsonify({"error": "Price alert not found"}), 404

    try:
        db.session.delete(alert)
        db.session.commit()
        return jsonify({"message": "Price alert deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete price alert: {str(e)}"}), 500

@wealth_bp.route("/price-alerts", methods=["POST"])
@jwt_required()
def create_price_alert():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    try:
        alert = price_alert_schema.load(data)
        alert.user_id = get_jwt_identity() # Set user_id after loading
        db.session.add(alert)
        db.session.commit()
        return jsonify(price_alert_schema.dump(alert)), 201
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create price alert"}), 500