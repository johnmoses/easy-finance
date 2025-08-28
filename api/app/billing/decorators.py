from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
from app.auth.models import User

def feature_required(feature_name):
    """
    A decorator to protect routes based on the team's subscription plan features.
    Assumes that the route is also protected by @jwt_required().
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user or not user.team_membership:
                return jsonify({"msg": "You are not part of a team."}), 403
            
            team = user.team_membership.team
            if not team or not team.subscription:
                return jsonify({"msg": f"Your team does not have an active subscription."}), 403

            plan = team.subscription.plan
            if not plan or not plan.features.get(feature_name, False):
                return jsonify({
                    "msg": f"Your team's plan ('{plan.name}') does not include the '{feature_name}' feature. Please contact your team admin to upgrade."
                }), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator
