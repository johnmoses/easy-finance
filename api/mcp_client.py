import os
from app import create_app, socketio

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        from app import db
        db.create_all()

    debug_mode = os.environ.get("FLASK_DEBUG", "1") == "1"

    socketio.run(app, debug=debug_mode, host="127.0.0.1", port=5001)
