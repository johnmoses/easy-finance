from flask import Blueprint

bp = Blueprint('finance', __name__)

from finance import routes
