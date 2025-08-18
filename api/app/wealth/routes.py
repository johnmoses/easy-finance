from flask import Blueprint, request, jsonify, current_app
import requests
import alpaca_trade_api as tradeapi
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.wealth.models import Investment, SavingsGoal, Notification, PriceAlert
from app.extensions import db
from datetime import datetime, date
from marshmallow import ValidationError
from app.wealth.schemas import InvestmentSchema, SavingsGoalSchema, PriceAlertSchema

wealth_bp = Blueprint("wealth", __name__)

investment_schema = InvestmentSchema()
investments_schema = InvestmentSchema(many=True)
savings_goal_schema = SavingsGoalSchema()
savings_goals_schema = SavingsGoalSchema(many=True)
price_alert_schema = PriceAlertSchema()
price_alerts_schema = PriceAlertSchema(many=True)

# ===== INVESTMENTS ROUTES =====
@wealth_bp.route("/investments", methods=["GET"])
@jwt_required()
def get_investments():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    investments_query = Investment.query.filter_by(user_id=user_id)

    # Filtering options (example: by investment_type)
    investment_type = request.args.get('investment_type')
    if investment_type:
        investments_query = investments_query.filter_by(investment_type=investment_type)

    # Filtering options (example: by symbol)
    symbol = request.args.get('symbol')
    if symbol:
        investments_query = investments_query.filter(Investment.symbol.ilike(f'%{symbol}%'))

    investments_pagination = investments_query.paginate(page=page, per_page=per_page, error_out=False)
    investments = investments_pagination.items

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
    return jsonify({
        "investments": results,
        "total_items": investments_pagination.total,
        "total_pages": investments_pagination.pages,
        "current_page": investments_pagination.page,
        "per_page": investments_pagination.per_page
    })

@wealth_bp.route("/investments/<int:investment_id>", methods=["PUT"])
@jwt_required()
def update_investment(investment_id):
    user_id = get_jwt_identity()
    investment = Investment.query.filter_by(id=investment_id, user_id=user_id).first()
    if not investment:
        return jsonify({"error": "Investment not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        investment.symbol = data.get("symbol", investment.symbol)
        investment.name = data.get("name", investment.name)
        investment.quantity = data.get("quantity", investment.quantity)
        investment.purchase_price = data.get("purchase_price", investment.purchase_price)
        investment.current_price = data.get("current_price", investment.current_price)
        investment.investment_type = data.get("investment_type", investment.investment_type)
        # Recalculate derived fields
        investment.total_value = investment.quantity * investment.current_price
        investment.profit_loss = investment.total_value - (investment.quantity * investment.purchase_price)
        investment.profit_loss_percentage = (investment.profit_loss / (investment.quantity * investment.purchase_price) * 100) if (investment.quantity * investment.purchase_price) > 0 else 0

        db.session.commit()
        return jsonify({"id": investment.id, "message": "Investment updated"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update investment: {str(e)}"}), 500

@wealth_bp.route("/investments/<int:investment_id>", methods=["DELETE"])
@jwt_required()
def delete_investment(investment_id):
    user_id = get_jwt_identity()
    investment = Investment.query.filter_by(id=investment_id, user_id=user_id).first()
    if not investment:
        return jsonify({"error": "Investment not found"}), 404

    try:
        db.session.delete(investment)
        db.session.commit()
        return jsonify({"message": "Investment deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete investment: {str(e)}"}), 500

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
        "target_date": goal.target_date.isoformat() if goal.target_date else None,
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

    # Parse target_date if provided
    target_date = None
    if data.get("target_date"):
        try:
            target_date = datetime.strptime(data["target_date"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    try:
        goal.name = data.get("name", goal.name)
        goal.description = data.get("description", goal.description)
        goal.target_amount = data.get("target_amount", goal.target_amount)
        goal.current_amount = data.get("current_amount", goal.current_amount)
        goal.target_date = target_date if target_date else goal.target_date
        goal.priority = data.get("priority", goal.priority)
        goal.is_completed = data.get("is_completed", goal.is_completed)

        db.session.commit()
        return jsonify({"id": goal.id, "message": "Goal updated"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update goal: {str(e)}"})

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
        return jsonify({"error": f"Failed to delete goal: {str(e)}"})

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
        # print(f"Alpha Vantage response: {data}")
        
        # Extract relevant data from the Alpha Vantage response
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

# ===== INVESTMENT ADVICE ROUTES =====
@wealth_bp.route("/investment-advice", methods=["POST"])
@jwt_required()
def get_investment_advice():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Validate input
    if "risk_tolerance" not in data or "financial_goals" not in data:
        return jsonify({"error": "Missing required fields: risk_tolerance, financial_goals"}), 400

    risk_tolerance = data["risk_tolerance"]
    financial_goals = data["financial_goals"]

    # In a real application, you would use a more sophisticated algorithm to generate investment advice.
    # This could involve analyzing the user's risk tolerance, financial goals, and market conditions.
    # For demonstration purposes, we'll return some generic advice based on risk tolerance.
    if risk_tolerance == "low":
        advice = {
            "message": "Based on your low risk tolerance, we recommend a conservative portfolio focused on capital preservation.",
            "recommendations": [
                {"symbol": "BND", "name": "Vanguard Total Bond Market ETF", "action": "buy"},
                {"symbol": "VTIP", "name": "Vanguard Short-Term Inflation-Protected Securities ETF", "action": "buy"}
            ]
        }
    elif risk_tolerance == "medium":
        advice = {
            "message": "Based on your medium risk tolerance, we recommend a balanced portfolio with a mix of stocks and bonds.",
            "recommendations": [
                {"symbol": "VOO", "name": "Vanguard S&P 500 ETF", "action": "buy"},
                {"symbol": "BND", "name": "Vanguard Total Bond Market ETF", "action": "buy"}
            ]
        }
    elif risk_tolerance == "high":
        advice = {
            "message": "Based on your high risk tolerance, we recommend an aggressive portfolio with a focus on growth stocks.",
            "recommendations": [
                {"symbol": "QQQ", "name": "Invesco QQQ Trust", "action": "buy"},
                {"symbol": "ARKK", "name": "ARK Innovation ETF", "action": "buy"}
            ]
        }
    else:
        return jsonify({"error": "Invalid risk tolerance. Please choose from: low, medium, high"}), 400

    return jsonify(advice)

# ===== PORTFOLIO REBALANCE ROUTES =====
@wealth_bp.route("/portfolio-rebalance", methods=["POST"])
@jwt_required()
def rebalance_portfolio():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Validate input
    if "target_allocation" not in data:
        return jsonify({"error": "Missing required field: target_allocation"}), 400

    target_allocation = data["target_allocation"]

    # In a real application, you would implement a portfolio rebalancing algorithm.
    # This would involve fetching the user's current portfolio, comparing it to the target allocation,
    # and generating a series of trades to bring the portfolio back in line.
    # For demonstration purposes, we'll return a mock response.
    response = {
        "message": "Portfolio rebalanced successfully.",
        "trades": [
            {"symbol": "AAPL", "action": "sell", "quantity": 10},
            {"symbol": "BND", "action": "buy", "quantity": 20}
        ]
    }
    return jsonify(response)

# ===== TRADES ROUTES =====
@wealth_bp.route("/trades", methods=["POST"])
@jwt_required()
def execute_trade():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Validate input
    if "symbol" not in data or "quantity" not in data or "side" not in data:
        return jsonify({"error": "Missing required fields: symbol, quantity, side"}), 400

    symbol = data["symbol"]
    quantity = data["quantity"]
    side = data["side"]
    trading_mode = data.get("trading_mode", "paper")  # Default to paper trading

    # Initialize Alpaca API
    if trading_mode == 'live':
        api = tradeapi.REST(
            key_id=current_app.config.get("ALPACA_LIVE_API_KEY_ID"),
            secret_key=current_app.config.get("ALPACA_LIVE_SECRET_KEY"),
            base_url="https://api.alpaca.markets"
        )
    else:
        api = tradeapi.REST(
            key_id=current_app.config.get("ALPACA_PAPER_API_KEY_ID"),
            secret_key=current_app.config.get("ALPACA_PAPER_SECRET_KEY"),
            base_url="https://paper-api.alpaca.markets"
        )

    try:
        # Submit order
        order = api.submit_order(
            symbol=symbol,
            qty=quantity,
            side=side,
            type="market",
            time_in_force="day"
        )
        return jsonify({"message": "Trade executed successfully", "order_id": order.id}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to execute trade: {str(e)}"}), 500

# ===== ORDERS ROUTES =====
@wealth_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    trading_mode = request.args.get("trading_mode", "paper")  # Default to paper trading

    # Initialize Alpaca API
    if trading_mode == 'live':
        api = tradeapi.REST(
            key_id=current_app.config.get("ALPACA_LIVE_API_KEY_ID"),
            secret_key=current_app.config.get("ALPACA_LIVE_SECRET_KEY"),
            base_url="https://api.alpaca.markets"
        )
    else:
        api = tradeapi.REST(
            key_id=current_app.config.get("ALPACA_PAPER_API_KEY_ID"),
            secret_key=current_app.config.get("ALPACA_PAPER_SECRET_KEY"),
            base_url="https://paper-api.alpaca.markets"
        )

    try:
        # Get a list of orders
        orders = api.list_orders(status="all")
        return jsonify([order._raw for order in orders])
    except Exception as e:
        return jsonify({"error": f"Failed to fetch orders: {str(e)}"}), 500

# ===== TOP INVESTMENTS =====
@wealth_bp.route("/top-investments", methods=["GET"])
@jwt_required()
def get_top_investments():
    # In a real application, you would use a more sophisticated algorithm to determine the top investments.
    # This could involve analyzing market data, news sentiment, and other factors.
    # For demonstration purposes, we'll return some mock data.
    top_investments = [
        {"symbol": "AAPL", "name": "Apple Inc.", "price": 231.59, "change": -1.19},
        {"symbol": "GOOGL", "name": "Alphabet Inc.", "price": 175.95, "change": 1.23},
        {"symbol": "MSFT", "name": "Microsoft Corporation", "price": 447.67, "change": -2.33},
        {"symbol": "AMZN", "name": "Amazon.com, Inc.", "price": 184.88, "change": 0.94},
        {"symbol": "TSLA", "name": "Tesla, Inc.", "price": 183.01, "change": -1.87}
    ]
    return jsonify(top_investments)




# ===== ALERTS ROUTES =====
@wealth_bp.route("/alerts", methods=["GET"])
@jwt_required()
def get_alerts():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    notifications_query = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc())

    # Filtering options (example: by is_read)
    is_read = request.args.get('is_read')
    if is_read is not None:
        notifications_query = notifications_query.filter_by(is_read=is_read.lower() == 'true')

    # Filtering options (example: by notification_type)
    notification_type = request.args.get('notification_type')
    if notification_type:
        notifications_query = notifications_query.filter_by(notification_type=notification_type)

    # Filtering options (example: by priority)
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

    # Filtering options (example: by is_active)
    is_active = request.args.get('is_active')
    if is_active is not None:
        alerts_query = alerts_query.filter_by(is_active=is_active.lower() == 'true')

    # Filtering options (example: by symbol)
    symbol = request.args.get('symbol')
    if symbol:
        alerts_query = alerts_query.filter(PriceAlert.symbol.ilike(f'%{symbol}%'))

    # Filtering options (example: by condition)
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
        return jsonify({"error": f"Failed to create price alert"}), 500