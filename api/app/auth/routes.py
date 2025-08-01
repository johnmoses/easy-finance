from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies,
)
from app.extensions import db
from app.auth.models import User
from app.auth.schemas import UserSchema
from datetime import timedelta

auth_bp = Blueprint("auth", __name__)

user_schema = UserSchema()
users_schema = UserSchema(many=True)


# List users (admin only)
@auth_bp.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    users = User.query.all()
    return jsonify(users_schema.dump(users))


# User registration
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        username=data["username"],
        email=data["email"],
        role=data.get("role", "user"),  # default role if not specified
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    result = user_schema.dump(user)
    return jsonify(result), 201


# User login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    additional_claims = {"roles": [user.role]}
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1), additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=user.id, expires_delta=timedelta(days=7), additional_claims=additional_claims)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user_schema.dump(user)
    }), 200


# Refresh access token
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    additional_claims = {"roles": []}  # or get from previous token if needed
    access_token = create_access_token(identity=current_user_id, expires_delta=timedelta(hours=1), additional_claims=additional_claims)
    return jsonify({"access_token": access_token}), 200


# Get current logged-in user's profile
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user_schema.dump(user))


# Update user info (excluding password)
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Only allow update for certain fields
    allowed_fields = {"username", "email"}
    for field in allowed_fields:
        if field in data:
            # Check for duplicates
            if field == "username" and User.query.filter_by(username=data[field]).filter(User.id != user.id).first():
                return jsonify({"error": "Username already exists"}), 409
            if field == "email" and User.query.filter_by(email=data[field]).filter(User.id != user.id).first():
                return jsonify({"error": "Email already registered"}), 409
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify(user_schema.dump(user))


# Change password
@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    old_password = data.get("old_password")
    new_password = data.get("new_password")
    if not old_password or not new_password:
        return jsonify({"error": "Old and new passwords are required"}), 400

    if not user.check_password(old_password):
        return jsonify({"error": "Old password is incorrect"}), 401

    user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Password changed successfully"})


# Logout (add token to blacklist)
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    from flask_jwt_extended import get_jwt
    from app.extensions import jwt_blacklist
    
    jti = get_jwt()["jti"]
    jwt_blacklist.add(jti)
    
    response = jsonify({"message": "Logged out successfully"})
    unset_jwt_cookies(response)
    return response
