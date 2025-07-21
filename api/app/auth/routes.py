from flask import Blueprint, request, jsonify
from app.auth.models import User
from app.extensions import db
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data.get("username")).first():
        return jsonify({"error": "Username already exists"}), 400
    if User.query.filter_by(email=data.get("email")).first():
        return jsonify({"error": "Email already registered"}), 400

    user = User(
        username=data.get("username"),
        email=data.get("email")
    )
    user.set_password(data.get("password"))
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get("username")).first()
    if user and user.check_password(data.get("password")):
        token = create_access_token(identity=user.id)
        return jsonify({"access_token": token})
    return jsonify({"error": "Invalid credentials"}), 401
