from app import create_app, db, socketio
import logging
import os


# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

app = create_app()
app.logger.setLevel(logging.INFO)
logging.getLogger('werkzeug').setLevel(logging.INFO)  # HTTP request logs at INFO level

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()  # Create database tables if they don't exist
            app.logger.info("Database tables created successfully")
        except Exception as e:
            app.logger.error(f"Database initialization failed: {e}")
            raise

    # Environment-based configuration
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    port = int(os.getenv('PORT', 5001))
    
    app.logger.info(f"Starting EasyFinance API on port {port}")
    socketio.run(app, host='0.0.0.0', port=port, use_reloader=False, debug=debug_mode)
