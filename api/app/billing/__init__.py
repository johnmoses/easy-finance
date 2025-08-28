from flask import Blueprint

billing_bp = Blueprint('billing', __name__)

from . import routes
