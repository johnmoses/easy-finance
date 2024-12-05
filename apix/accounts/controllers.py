# """
# API functions
# """
from .models import db, User

class UserController:
    def __init__(self):
        pass

    def get_users():
        users = User.query.all()
        return users if users else []
    
    def get_user(id):
        user = User.query.filter_by(id=id).first()
        return user if user else []

    def get_user_by_name(username):
        """Look up a user given a username."""
        user = User.query.filter_by(username=username).first()
        return user if user else []

    def create_user(username,password,email,mobile):
        user = User(username,password,email,mobile)
        db.session.add(user)
        db.session.commit()

    def update_user(id,first_name,last_name):
        user = User.query.filter_by(id=id).first()
        user.first_name = first_name
        user.last_name = last_name
        db.session.commit()

    def update_user_photo(id,photo):
        user = User.query.filter_by(id=id).first()
        user.photo = photo
        db.session.commit()

    def reset_user_password(id,password):
        user = User.query.filter_by(id=id).first()
        user.password = password
        db.session.commit()
