from flask import Blueprint

bp = Blueprint('orders', __name__)

from orders import routes
