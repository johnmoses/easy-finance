from flask import Blueprint

bp = Blueprint('stocks', __name__)

from stocks import routes
