from flask import Blueprint

bp = Blueprint('portfolios', __name__)

from portfolios import routes
