import os
from flask import Flask
from app.extensions import db, migrate, jwt, socketio, ma, init_milvus_client
from app.auth.routes import auth_bp
from app.budgets.routes import budgets_bp
from app.transactions.routes import transactions_bp
from app.chat.routes import chat_bp

def create_app():
    app = Flask(__name__)

    env = os.environ.get('FLASK_ENV', 'development')
    if env == 'production':
        app.config.from_object('app.config.ProductionConfig')
    elif env == 'testing':
        app.config.from_object('app.config.TestingConfig')
    else:
        app.config.from_object('app.config.DevelopmentConfig')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")
    ma.init_app(app)

    # Register blueprints for all modules
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(budgets_bp, url_prefix="/api/budgets")
    app.register_blueprint(transactions_bp, url_prefix="/api/transactions")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")

    # Import socket events (registers handlers)
    from app.chat import socket_events  # optional, if using SocketIO

    # Initialize Milvus Lite client with DB file
    with app.app_context():
        # Initialize db
        db.create_all()
        # Initialize Milvus Lite client and collection
        init_milvus_client()

    return app
