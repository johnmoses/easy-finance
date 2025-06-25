import os
from flask import Flask, request, Response, url_for
from flask_cors import CORS
from flask_login import LoginManager
from flask_socketio import SocketIO, emit
from flask_session import Session
from flask_migrate import Migrate
from mcp_utils.core import MCPServer
from mcp_utils.queue import RedisResponseQueue
import redis
import re
import uuid
from flask import jsonify
from accounts import bp as accounts_bp
from finance import bp as finace_bp
from config.base import Config
from config.db import db
from config.ma import ma
from accounts.models import User

app = Flask(__name__)
app.config.from_object(Config)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "super secret key"
app.json.compact = False

redis_client = redis.Redis(host="localhost", port=6379, db=0)
mcp = MCPServer(
    "example-mcp-server", "1.0", response_queue=RedisResponseQueue(redis_client)
)

db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db, compare_type=True)

login_manager = LoginManager(app)
login_manager.login_view = "accounts.signin"

CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    # cors_allowed_origins="*"
    cors_allowed_origins=[
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5001",
        "http://localhost:8000",
        "http://127.0.0.1",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5001",
        "http://127.0.0.1:8000",
        "http://0.0.0.0",
        "http://0.0.0.0:3000",
        "http://10.0.2.2:5001",
        "http://10.0.2.2:8000",
    ],
)
Session(app)

app.register_blueprint(accounts_bp)
app.register_blueprint(finace_bp)

entity_vars = {}


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.cli.command("initdb")
def initdb_command():
    """Creates the database tables."""
    db.drop_all()
    db.create_all()
    print("Initialized the database.")


@app.cli.command("recreatedb")
def recreatedb_command():
    """Recreates local database tables."""
    print("Recreated the database.")


@app.route("/test/")
def test_page():
    return "<h1>Testing Easy Finance</h1>"


@app.route("/")
def index():
    return "<p>Welcome to Easy Finance</p>"


@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["file"]
    filename = request.form["filename"]
    destination = request.form["destination"]
    try:
        file.save(os.path.join(app.config["UPLOADS"], destination, filename))
        print("uploaded: ", filename)
        return "OK", 200
    except Exception as e:
        print("could not upload file", e)
        return "Not Uploaded file", 500


@socketio.on("connect")
def connected():
    emit("message", {"content": f"{request.sid} connected"}, room=None)


@socketio.on("disconnect")
def disconnected():
    emit("message", {"content": f"{request.sid} disconnected"}, room=None)


@socketio.on("start chat")
def start_chat(data):
    pass


@socketio.on("update chat")
def update_chat(data):
    pass


@socketio.on("update chats")
def update_chats(data):
    pass


@socketio.on("join chat")
def join_chat(data):
    pass


@socketio.on("leave chat")
def leave_chat(data):
    pass


@socketio.on("send message")
def send_message(data):
    pass


@socketio.on("ai response")
def ai_response(data):
    pass


def calculator(expression):
    try:
        # WARNING: eval can be dangerous; use a safe parser in production
        result = eval(expression, {"__builtins__": {}})
        return str(result)
    except Exception as e:
        return f"Error: {str(e)}"


# MCP parsing: detect tool calls in the message (e.g., [calc:2+2])
def parse_tools(message):
    pattern = r"\[calc:(.*?)\]"
    matches = re.findall(pattern, message)
    return matches


context_store = {}


@app.route("/mcp", methods=["POST"])
def mcp_endpoint():
    data = request.get_json()
    session_id = data.get("session_id")
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    if not session_id:
        # Create new session
        session_id = str(uuid.uuid4())
        context_store[session_id] = []

    if session_id not in context_store:
        context_store[session_id] = []

    # Store user message in context
    context_store[session_id].append({"role": "user", "content": user_message})
    # Parse tool invocations
    tool_calls = parse_tools(user_message)
    tool_responses = []
    for expr in tool_calls:
        result = calculator(expr)
        tool_responses.append(result)
        # Store tool response in context
        context_store[session_id].append({"role": "tool", "content": result})

    # Generate a simple assistant response including tool results
    if tool_responses:
        response_text = "Tool results: " + ", ".join(tool_responses)
    else:
        response_text = f"Received: {user_message}"

    # Store assistant response in context
    context_store[session_id].append({"role": "assistant", "content": response_text})

    return jsonify({"session_id": session_id, "response": response_text})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        db.session.commit()

    debug = bool(os.environ.get("DEBUG", True))
    port = int(os.environ.get("PORT", 5001))
    host = str(os.environ.get("HOST", "127.0.0.1"))
    socketio.run(app, debug=debug, port=port, host=host)
