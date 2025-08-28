from flask import Flask
from flask_cors import CORS
from app.extensions import (
    db,
    migrate,
    jwt,
    jwt_blacklist,
    socketio,
    ma,
    init_milvus_client, 
    init_embed_model,
    init_llama_model # Import the Llama initialization function
)
# Import all models for database creation
from app.auth.models import User

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    # --- Initialize Flask extensions ---
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    socketio.init_app(app)
    ma.init_app(app)

    # Register consolidated blueprints
    from app.auth.routes import auth_bp
    from app.chat.routes import chat_bp
    from app.finance.routes import finance_bp
    from app.wealth.routes import wealth_bp
    from app.blockchain.routes import blockchain_bp
    from app.billing.routes import billing_bp
    from app.support.routes import support_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(finance_bp, url_prefix="/api/finance")
    app.register_blueprint(wealth_bp, url_prefix="/api/wealth")
    app.register_blueprint(blockchain_bp, url_prefix="/api/blockchain")
    app.register_blueprint(billing_bp, url_prefix="/api/billing")
    app.register_blueprint(support_bp, url_prefix="/api/support")
    

    # --- JWT Token Revocation (Blacklist) ---
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in jwt_blacklist

    # --- Application Context Initializations (DB, Milvus, Models) ---
    with app.app_context():
        # Initialize Database Tables (for dev/first run; use Flask-Migrate in prod)
        db.create_all()

        # Ensure 'finance_assistant' user exists for AI/RAG interactions
        finance_bot = User.query.filter_by(username="finance_assistant").first()
        if not finance_bot:
            try:
                finance_bot = User(username="finance_assistant", email="assistant@easyfinance.com", role="assistant") 
                finance_bot.set_password(app.config.get("BOT_PASSWORD", "secure_bot_password"))
                db.session.add(finance_bot)
                db.session.commit()
                app.logger.info("Created 'finance_assistant' user.")
            except Exception as e:
                app.logger.error(f"Failed to create 'finance_assistant' user: {e}", exc_info=True)


        # Initialize Milvus Client and Collection for financial document embeddings
        try:
            milvus_db_path = app.config.get("MILVUS_DB_PATH")
            milvus_collection = app.config.get("MILVUS_COLLECTION")
            milvus_dimension = app.config.get("MILVUS_DIMENSION")
            
            if not all([milvus_db_path, milvus_collection, milvus_dimension]):
                app.logger.warning("Missing Milvus configuration. RAG features will be disabled.")
                return app  # Continue without Milvus for basic functionality
                
            init_milvus_client(
                db_path=milvus_db_path,
                collection=milvus_collection,
                dim=milvus_dimension,
            )
            app.logger.info("Milvus client initialized successfully.")
        except Exception as e:
            app.logger.error(f"Failed to initialize Milvus client: {e}", exc_info=True)
            app.logger.warning("Continuing without RAG capabilities")

        # Initialize Embedding Model
        try:
            embed_model_name = app.config.get("EMBED_MODEL_NAME")
            if embed_model_name:
                init_embed_model(model_name=embed_model_name)
                app.logger.info("Embedding model initialized successfully.")
            else:
                app.logger.warning("No embedding model configured")
        except Exception as e:
            app.logger.error(f"Failed to initialize embedding model: {e}", exc_info=True)

        # Initialize Llama Model
        try:
            llama_model_path = app.config.get("LLAMA_MODEL_PATH")
            if llama_model_path:
                init_llama_model(
                    model_path=llama_model_path,
                    n_ctx=app.config.get("LLAMA_N_CTX", 4096),
                    n_gpu_layers=app.config.get("LLAMA_N_GPU_LAYERS", 0)
                )
                app.logger.info("Llama model initialized successfully.")
            else:
                app.logger.warning("LLAMA_MODEL_PATH not configured. Using fallback responses.")
        except Exception as e:
            app.logger.error(f"Failed to initialize Llama model: {e}", exc_info=True)
            app.logger.warning("Continuing with limited AI capabilities")

    return app

