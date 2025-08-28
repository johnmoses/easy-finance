from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import billing_bp
from app.auth.schemas import plans_schema, subscription_schema
from .services import SubscriptionService
from app.auth.models import Plan, User

@billing_bp.route("/plans", methods=["GET"])
@jwt_required()
def list_plans():
    """List all available subscription plans."""
    plans = SubscriptionService.get_all_plans()
    return jsonify(plans_schema.dump(plans)), 200

@billing_bp.route("/subscription", methods=["GET"])
@jwt_required()
def get_subscription():
    """Get the current user's team subscription details."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.team_membership:
        return jsonify({"msg": "User is not part of a team."}), 404
    
    team = user.team_membership.team
    subscription = SubscriptionService.get_subscription_by_team_id(team.id)
    
    if not subscription:
        return jsonify({"msg": "No active subscription found for your team."}), 404
    return jsonify(subscription_schema.dump(subscription)), 200

@billing_bp.route("/subscribe", methods=["POST"])
@jwt_required()
def subscribe():
    """Subscribe the current user's team to a new plan."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.team_membership:
        return jsonify({"msg": "User is not part of a team."}), 403
    
    # In a real app, you'd check for role here. e.g., only 'admin' can subscribe.
    # if user.team_membership.role != 'admin':
    #     return jsonify({"msg": "You do not have permission to change the team's subscription."}), 403

    team = user.team_membership.team
    data = request.get_json()
    plan_id = data.get('plan_id')

    if not plan_id:
        return jsonify({"msg": "plan_id is required."}), 400

    plan = Plan.query.get(plan_id)
    if not plan:
        return jsonify({"msg": "Plan not found."}), 404

    subscription = SubscriptionService.create_subscription(team.id, plan_id)
    
    return jsonify({
        "msg": f"Team '{team.name}' successfully subscribed to the {plan.name} plan.",
        "subscription": subscription_schema.dump(subscription)
    }), 200

@billing_bp.route("/subscription/cancel", methods=["POST"])
@jwt_required()
def cancel():
    """Cancel the current user's team subscription."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.team_membership:
        return jsonify({"msg": "User is not part of a team."}), 403

    # Add role check here as well
    # if user.team_membership.role != 'admin':
    #     return jsonify({"msg": "You do not have permission to change the team's subscription."}), 403

    team = user.team_membership.team
    if SubscriptionService.cancel_subscription(team.id):
        return jsonify({"msg": "Team subscription canceled successfully."}), 200
    return jsonify({"msg": "Could not cancel subscription or no subscription found."}), 400
