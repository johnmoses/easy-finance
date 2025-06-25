from flask import request, jsonify
from flask_login import login_required, login_user, logout_user
from flask_bcrypt import Bcrypt

from accounts import bp
from accounts.schemas import UserSchema
from .models import db, User

bcrypt = Bcrypt()


@bp.route("/user", methods=["GET"])
def get_users():
    users = User.query.all()
    return UserSchema(many=True).dump(users), 200


@bp.route("/user/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.filter_by(id=id).first()
    return UserSchema().dump(user), 200

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'message': 'User already exists'}), 400

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User signed up successfully'}), 201

@bp.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({'message': 'signed in successfully'}), 200
    return jsonify({'message': 'Invalid username or password'}), 401

@bp.route('/signout')
@login_required
def signout():
    logout_user()
    return jsonify({'message': 'Signed out successfully'}), 200