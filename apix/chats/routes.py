from flask import request, jsonify
from chats import bp
from chats.controllers import ChatController
from chats.schemas import ChatItemSchema, ChatSchema, MessageSchema

@bp.route('/chats', methods=['POST'])
def get_chats():
    request_data = request.get_json()
    name = request_data['name']
    last = request_data['last']
    chats = ChatController.get_chats(name, last)
    return ChatItemSchema(many=True).dump(chats), 200

@bp.route('/chats/names', methods=['POST'])
def get_chats_names():
    request_data = request.get_json()
    name = request_data['name']
    chat = ChatController.get_chats_names(name)
    return ChatItemSchema(many=True).dump(chat), 200

@bp.route('/user/chats', methods=['POST'])
def get_user_chats():
    request_data = request.get_json()
    user_id = request_data['user_id']
    name = request_data['name']
    last = request_data['last']
    chats = ChatController.get_user_chats(user_id, name, last)
    return ChatItemSchema(many=True).dump(chats), 200

@bp.route('/chat/<int:id>', methods=['GET'])
def get_chat(id):
    chat = ChatController.get_chat(id)
    return ChatSchema().dump(chat), 200

@bp.route('/user/chat', methods=['POST'])
def get_user_chat():
    request_data = request.get_json()
    user_id = request_data['user_id']
    chat_name = request_data['chat_name']
    chat = ChatController.get_user_chat(user_id,chat_name)
    # print('Chat found!')
    return ChatSchema().dump(chat), 200


@bp.route('/chat', methods=['POST'])
def create_chat():
    request_data = request.get_json()
    name = request_data['name']
    starter_id = request_data['starter_id']
    user_ids = request_data['user_ids']
    is_private = request_data['is_private']
    is_bot = request_data['is_bot']
    if not name or not starter_id:
        return jsonify(message='Could not create chat now'), 401
    else:
        ChatController.create_chat(name,starter_id,user_ids,is_private,is_bot)
        # print('Created chat!')
        return jsonify('Created chat'), 200
    
@bp.route('/chat/username', methods=['POST'])
def create_chat_with_username():
    request_data = request.get_json()
    name = request_data['name']
    starter_id = request_data['starter_id']
    user_names = request_data['user_names']
    if not name or not starter_id:
        return jsonify(message='Need chat name'), 401
    else:
        ChatController.create_chat_with_usernames(name,starter_id,user_names)
        # print('Created chat!')
        return jsonify('Created chat'), 200

@bp.route('/chat/private', methods=['POST'])
def create_chat_private():
    request_data = request.get_json()
    name = request_data['name']
    starter_id = request_data['starter_id']
    user_id = request_data['user_id']
    if not name or not starter_id or not user_id:
        return jsonify(message='Could not create chat now'), 401
    else:
        ChatController.create_chat_private(name,starter_id,user_id)
        # print('Created chat!')
        return jsonify('Created chat'), 200

@bp.route('/chat', methods=['PUT'])
def update_chat():
    request_data = request.get_json()
    id = request_data['id']
    name = request_data['name']
    description = request_data['description']
    if not id or not name:
        return jsonify(message='Could not create chat now'), 401
    else:
        ChatController.update_chat(id,name,description)
        # print('Updated chat!')
        return jsonify('Updated chat'), 200
    
@bp.route('/chat/pic', methods=['PUT'])
def update_chat_pic():
    request_data = request.get_json()
    user_id = request_data['user_id']
    id = request_data['id']
    pic = request_data['pic']
    if not user_id or not id or not pic:
        return jsonify(message='Could not update chat pic now'), 401
    else:
        ChatController.update_chat_pic(user_id,id,pic)
        # print('Updated pic!')
        return jsonify('Update pic successful'), 200


@bp.route('/chat', methods=['DELETE'])
def delete_chat():
    request_data = request.get_json()
    id = request_data['id']
    username = request_data['username']
    if not id or not username:
        return jsonify(message='Could not delete chat now'), 401
    else:
        ChatController.delete_chat(id,username)
        # print('Deleted chat!')
        return jsonify('Deleted chat'), 200

@bp.route('/join', methods=['POST'])
def join_chat():
    request_data = request.get_json()
    chat_id = request_data['chat_id']
    user_ids = request_data['user_ids']
    if not user_ids  or not chat_id:
        return jsonify(message='Could not join chat now'), 401
    else:
        ChatController.join_chat(chat_id,user_ids)
        # print('Joined chat!')
        return jsonify('Joined chat'), 200
    
@bp.route('/join/usernames', methods=['POST'])
def join_chat_with_usernames():
    request_data = request.get_json()
    chat_id = request_data['chat_id']
    user_names = request_data['user_names']
    if not user_names  or not chat_id:
        return jsonify(message='Need chat id and user names to join'), 401
    else:
        ChatController.join_chat_with_usernames(chat_id,user_names)
        # print('Joined chat!')
        return jsonify('Joined chat'), 200


@bp.route('/leave', methods=['POST'])
def leave_chat():
    request_data = request.get_json()
    chat_id = request_data['chat_id']
    user_id = request_data['user_id']
    if not chat_id or not user_id:
        return jsonify(message='Could not leave now'), 401
    else:
        ChatController.leave_chat(chat_id,user_id)
        # print('Left chat!')
        return jsonify('Left chat'), 200
    
@bp.route('/messages', methods=['GET'])
def get_messages():
    messages = ChatController.get_messages()
    return MessageSchema(many=True).dump(messages), 200


@bp.route('/chat/messages', methods=['POST'])
def get_chat_messages():
    request_data = request.get_json()
    chat_id = request_data['chat_id']
    content = request_data['content']
    last = request_data['last']
    messages = ChatController.get_chat_messages(chat_id,content,last)
    return MessageSchema(many=True).dump(messages), 200

@bp.route('/message/<int:id>', methods=['GET'])
def get_message(id):
    message = ChatController.get_message(id)
    return MessageSchema().dump(message), 200

@bp.route('/message', methods=['POST'])
def create_message():
    request_data = request.get_json()
    content = request_data['content']
    attachment = request_data['attachment']
    chat_id = request_data['chat_id']
    sender_id = request_data['sender_id']
    if not chat_id or not sender_id:
        return jsonify('Cannot create message this time')
    else:
        ChatController.create_message(
            content,attachment,chat_id,sender_id
        )
        # print('Create successful!')
        return jsonify('Create successful'), 200
    
@bp.route('/message/upsert', methods=['POST'])
def create_message_upsert():
    request_data = request.get_json()
    data = request_data['data']
    if not data:
        return jsonify('Empty')
    else:
        ChatController.create_message_upsert(data)
        # print('Create upsert successful!')
        return jsonify('Create upsert successful'), 200

@bp.route('/message/del', methods=['PUT'])
def delete_message():
    request_data = request.get_json()
    id = request_data['id']
    ChatController.delete_message(id)
    # print('Delete successful!')
    return jsonify('Delete successful'), 200


@bp.route('/message/read', methods=['PUT'])
def read_message():
    request_data = request.get_json()
    id = request_data['id']
    ChatController.read_message(id)
    # print('Read message successful!')
    return jsonify('read message successful'), 200

@bp.route('/messages/read', methods=['PUT'])
def read_messages():
    request_data = request.get_json()
    chat_id = request_data['chat_id']
    ChatController.read_messages(chat_id)
    # print('Read messages successful!')
    return jsonify('Read messages successful'), 200

@bp.route('/unread/count', methods=['PUT'])
def count_unread():
    request_data = request.get_json()
    sender_id = request_data['sender_id']
    nums = ChatController.count_unread_messages(sender_id)
    # print('Got unread messages')
    return jsonify(nums), 200