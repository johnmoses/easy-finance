import os
import time
from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_session import Session
from flask_migrate import Migrate
from accounts import bp as accounts_bp
from chats import bp as chats_bp
from finance import bp as finace_bp
from stocks import bp as stock_bp
from orders import bp as orders_bp
from portfolios import bp as portfolio_bp
from config.base import Config
from config.db import db
from config.ma import ma
from accounts.models import ChatsUsers
from chats.models import Chat, Message
from chats.controllers import ChatController
from stocks.controllers import StockController, StockPriceController
from ml.models import base_response, sql_response, support_response

app = Flask(__name__)
app.config.from_object(Config)
app.json.compact = False

db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db, compare_type=True)

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
    ]
)
Session(app)

app.register_blueprint(accounts_bp)
app.register_blueprint(chats_bp)
app.register_blueprint(finace_bp)
app.register_blueprint(stock_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(portfolio_bp)

entity_vars = {}

@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    # db.drop_all()
    db.create_all()
    print('Initialized the database.')


@app.cli.command('recreatedb')
def recreatedb_command():
    """Recreates local database tables."""
    Message.__table__.drop(db.engine)
    ChatsUsers.__table__.drop(db.engine)
    Chat.__table__.drop(db.engine)
    db.create_all()
    print('Recreated the database.')

@app.cli.command('populatestock')
def populatestock_command():
    StockController.populate_stock()
    print('Polulated the stock tables.')

@app.cli.command('populatestockprices')
def populatestockprices_command():
    StockPriceController.populate_stock_prices()
    print('Polulated the stock prices tables.')

@app.route('/test/')
def test_page():
    return '<h1>Testing the Flask Application</h1>'


@app.route('/')
def index():
    return '<p>Welcome to Easy Finance</p>'


@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    filename = request.form['filename']
    destination = request.form['destination']
    try:
        file.save(os.path.join(app.config["UPLOADS"], destination, filename))
        print('uploaded: ', filename)
        return 'OK', 200
    except Exception as e:
        print('could not upload file', e)
        return 'Not Uploaded file', 500


@socketio.on('connect')
def connected():
    emit(
        'message',
        {'content': f"{request.sid} connected"},
        room=None
    )


@socketio.on('disconnect')
def disconnected():
    emit(
        'message',
        {'content': f"{request.sid} disconnected"},
        room=None
    )


@socketio.on('start chat')
def start_chat(data):
    try:
        new_chatid = ChatController.create_chat(
            data['name'],
            data['starter_id'],
            data['user_ids'],
            data['is_private'],
            data['is_bot'],
        )
        join_room(new_chatid)
        emit(
            'announce chat',
            {'content': f"New chat started"},
            room=new_chatid
        )
        print('started chat: ', new_chatid)
    except Exception as e:
        print(e)


@socketio.on('update chat')
def update_chat(data):
    chat_id = data['id']
    join_room(chat_id)
    emit(
        'message',
        {'chat_id': data['id']},
        {'content': f"updated {data['name']}"},
        room=chat_id
    )
    try:
        ChatController.update_chat(
            data['id'],
            data['name'],
            data['description']
        )
    except Exception as e:
        print(e)


@socketio.on('update chats')
def update_chats(data):
    chat_id = data['chat_id']
    join_room(chat_id)
    emit(
        'chats update',
        {'content': f"Updated chats at {data['chat_id']}"},
        room=chat_id
    )
    print('chats updated at ', chat_id)


@socketio.on('join chat')
def join_chat(data):
    chat_id = data['chat_id']
    join_room(chat_id)
    try:
        ChatController.join_chat(
            data['chat_id'],
            data['user_ids'],
        )
        emit(
            'join',
            {
                'user_ids': data['user_ids'],
                'chat_id': data['chat_id'],
                'content': f"Users {data['user_ids']} joined chat.",
            },
            room=chat_id, broadcast=True,
        )
        print('user joined')
    except Exception as e:
        print(e)


@socketio.on('leave chat')
def leave_chat(data):
    chat_id = data['chat_id']
    user_id = data['user_id']
    leave_room(chat_id)
    try:
        ChatController.leave_chat(
            data['chat_id'],
            data['user_id'],
        )
        emit(
            'leave',
            {
                'user_id': data['user_id'],
                'chat_id': data['chat_id'],
                'content': f"{data['content']}",
            },
            room=chat_id, broadcast=True,
        )
        print('user left')
    except Exception as e:
        print(e)


@socketio.on('send message')
def send_message(data):
    content = data['content']
    sender_id = data['sender_id']
    starter_id = data['starter_id']
    chat_id = data['chat_id']
    is_private = data['is_private']
    is_bot = data['is_bot']
    join_room(chat_id)

    if is_private == True and is_bot == True:
        # Support module
        if starter_id == 715:
            response = support_response(content)
            print(response)
            ai_response(
                {
                    "content": response,
                    'attachment': data['attachment'],
                    'chat_id': data['chat_id'],
                    'sender_id': data['starter_id'],
                    # 'sender_username': "Assistant",
                })
        # SQL module
        if starter_id == 715:
            response = sql_response(content)
            print(response)
            ai_response(
                {
                    "content": response,
                    'attachment': data['attachment'],
                    'chat_id': data['chat_id'],
                    'sender_id': data['starter_id'],
                    # 'sender_username': "Assistant",
                })
        # Base module
        else:
            response, ent_vars = base_response(
                content, sender_id, entity_vars)
            print(response)
            for key, value in ent_vars.items():
                entity_vars[key] = value
                print(f"k: {key} v: {value}")
            for key, value in entity_vars.items():
                entity_vars[key] = value
                print(f"key: {key} value: {value}")
            ai_response(
                {
                    "content": response,
                    'attachment': data['attachment'],
                    'chat_id': data['chat_id'],
                    'sender_id': data['starter_id'],
                    # 'sender_username': "Assistant",
                })

        emit(
            'send response',
            {
                'content': data['content'],
                'attachment': data['attachment'],
                'chat_id': data['chat_id'],
                'sender_id': data['sender_id'],
                # 'sender_username': data['sender_username'],
            },
            room=chat_id, broadcast=True,
        )
    else:
        try:
            new_msgid = ChatController.create_message(
                data['content'],
                data['attachment'],
                data['chat_id'],
                data['sender_id'],
            )
            emit(
                'send response',
                {
                    # 'id': new_msgid,
                    'content': data['content'],
                    'attachment': data['attachment'],
                    'chat_id': data['chat_id'],
                    'sender_id': data['sender_id'],
                    # 'sender_username': data['sender_username'],
                },
                room=chat_id, broadcast=True,
            )
        except Exception as e:
            print(e)


@socketio.on('ai response')
def ai_response(data):
    chat_id = data['chat_id']
    join_room(chat_id)
    emit(
        'send response',
        {
            'content': data['content'],
            'attachment': data['attachment'],
            'chat_id': data['chat_id'],
            'sender_id': data['sender_id'],
            # 'sender_username': data['sender_username'],
        },
        room=chat_id, broadcast=True,
    )
    # print('assisted response')


@socketio.on('read messages')
def read_messages(data):
    emit(
        'message',
        {'content': data['content']},
        room=None
    )
    try:
        ChatController.read_messages(
            data['chat_id'],
        )
    except Exception as e:
        print(e)


@socketio.on('read message')
def read_message(data):
    emit(
        'message',
        {'content': data['content']},
        room=None
    )
    try:
        ChatController.read_message(
            data['id'],
        )
    except Exception as e:
        print(e)


@socketio.on('delete message')
def delete_message(data):
    emit(
        'message',
        {'content': data['content']},
        room=None
    )
    try:
        ChatController.delete_message(
            data['id'],
        )
    except Exception as e:
        print(e)


@socketio.on('upload file')
def upload_file(data):
    utime = int(time.time())
    file = data['file']
    fname = data['attachment']
    name, extension = os.path.splitext(fname)
    filename = str(data['sender_id'])+str(utime)+extension
    bucket = os.path.join(app.config['UPLOADS'], 'chats')
    emit(
        'message',
        {'content': data['content']},
        room=None
    )
    try:
        ChatController.create_message(
            data['content'],
            filename,
            data['chat_id'],
            data['sender_id'],
        )
        with open(bucket+'/'+filename, "wb") as f:
            f.write(file)
            # print('filename: ', filename)
    except Exception as e:
        print(e)


if __name__ == '__main__':
    debug = bool(os.environ.get("DEBUG", True))
    port = int(os.environ.get("PORT", 5001))
    host = str(os.environ.get("HOST", "127.0.0.1"))
    socketio.run(app, debug=debug, port=port, host=host)
