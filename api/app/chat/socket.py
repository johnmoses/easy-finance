from flask_socketio import emit, join_room, leave_room
from app.extensions import db, socketio
from .models import ChatMessage

@socketio.on('join')
def on_join(data):
    username = data.get('username')
    room = data.get('room')
    join_room(room)
    emit('status', {'msg': f'{username} has joined room {room}.'}, room=room)

@socketio.on('leave')
def on_leave(data):
    username = data.get('username')
    room = data.get('room')
    leave_room(room)
    emit('status', {'msg': f'{username} has left room {room}.'}, room=room)

@socketio.on('send_message')
def handle_message(data):
    room = data.get('room')
    sender_id = data.get('sender_id')
    content = data.get('content')
    if not (room and sender_id and content):
        emit('error', {'message': 'Missing data for message!'})
        return
    msg = ChatMessage(room_id=room, sender_id=sender_id, content=content)
    db.session.add(msg)
    db.session.commit()

    emit('receive_message', {
        'sender_id': sender_id,
        'content': content,
        'timestamp': msg.timestamp.isoformat()
    }, room=room)
