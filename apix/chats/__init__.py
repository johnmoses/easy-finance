from flask import Blueprint

bp = Blueprint('chats', __name__)

from chats import routes
