from flask import session, request, jsonify
from accounts import bp
from accounts.controllers import UserController
from accounts.schemas import UserSchema

@bp.route('/user', methods=['GET'])
def get_users():
    users = UserController.get_users()
    return UserSchema(many=True).dump(users), 200

@bp.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    user = UserController.get_user(id)
    return UserSchema().dump(user), 200

@bp.route('/userbyname/<username>', methods=['GET'])
def get_user_by_name(username):
    user = UserController.get_user_by_name(username)
    return UserSchema().dump(user), 200

@bp.route('/user', methods=['POST'])
def create_user():
    request_data = request.get_json()
    username = request_data['username']
    password = request_data['password']
    email = request_data['email']
    mobile = request_data['mobile']
    if not username or not password:
        return jsonify(message='Could not create user now'), 401
    else:
        UserController.create_user(username,password,email,mobile)
        print('Create successful!')
        return jsonify('Create successful'), 200

@bp.route('/user', methods=['PUT'])
def update_user():
    request_data = request.get_json()
    id = request_data['id']
    first_name = request_data['first_name']
    last_name = request_data['last_name']
    if not id:
        return jsonify(message='Could not create chat now'), 401
    else:
        UserController.update_user(id,first_name,last_name)
        # print('Update successful!')
        return jsonify('Update successful'), 200