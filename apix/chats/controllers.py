# """
# API functions
# """
from sqlalchemy import desc, text
from sqlalchemy.dialects.postgresql import insert
from .models import db, Chat, Message
from accounts.models import User, ChatsUsers


class ChatController:
    def __init__():
        pass

    def get_chats(name, last):
        """
        Look up chats generally given a chat name as filter
        Important for joining existing chats
        """
        chats = Chat.query.filter(Chat.name.icontains(
            name)).order_by(desc('modified_at')).limit(last)
        return chats if chats else []

    def get_user_chats(user_id, name, last):
        """
        Look up chats given a user id and chat name.
        This helps users easily search and find chats in their rooms
        """
        chats = Chat.query.filter(Chat.participants.any(
            id=user_id), Chat.name.icontains(name)).order_by(desc('modified_at')).limit(last).all()
        return chats if chats else []

    def get_chat(id):
        """Look up a chat given a chat id."""
        chat = Chat.query.filter_by(id=id).first()
        return chat if chat else []

    def get_user_chat(user_id, chat_name):
        """Look up a chat given user id and chat name."""
        chat = Chat.query.filter(Chat.participants.any(
            id=user_id), Chat.name.icontains(chat_name)).first()
        return chat if chat else []

    def get_chats_names(name):
        """Look up chats given a name."""
        chats = Chat.query.filter(Chat.name.icontains(name))
        return chats if chats else []

    def create_chat(name, starter_id, user_ids, is_private, is_bot):
        """Start a new chat"""
        userids = user_ids.split(',')
        insert_stmt = text(
            "INSERT INTO chats_chat(name,starter_id,is_bot,is_private,is_deleted,unread_messages) values(:name,:starter_id,:is_bot,:is_private,:is_deleted,:unread_messages) returning(chats_chat.id)")
        db.session.execute(
            insert_stmt, {'name':name,'starter_id':starter_id,'is_bot':is_bot,'is_private':is_private,'is_deleted':False,'unread_messages':0})
        select_stmt = text("SELECT * FROM chats_chat WHERE name = :name")
        res = db.session.execute(select_stmt, {'name': name})
        user = User.query.filter_by(id=starter_id).first()
        if res:
            chatid = res.fetchone()[0]
            # if is_bot:
            #     user.hasAssist = True
            entries = []
            entries.append([chatid, starter_id])
            for uid in userids:
                entries.append([chatid, uid])
            db.session.execute(
                ChatsUsers.__table__.insert(),
                [{'chat_id': chatid, 'user_id': uid}
                    for chatid, uid in entries]
            )
            db.session.commit()
            return chatid

    def create_chat_with_usernames(name, starter_id, user_names):
        """Start a new chat with usernames"""
        starter = User.query.filter_by(id=starter_id).first()
        usernames = user_names.split(',')
        users = []
        users.append(starter)
        for username in usernames:
            user = User.query.filter_by(username=username).first()
            users.append(user)
        chat = Chat(name, starter_id)
        db.session.add(chat)
        for user in users:
            chat.participants.append(user)
        db.session.commit()

    def create_chat_private(name, starter_id, user_id):
        """Start a private chat"""
        insert_stmt = text(
            "INSERT INTO chats_chat(name,starter_id) values(:name,:starter_id) returning(chats_chat.id)")
        db.session.execute(
            insert_stmt, {'name': name, 'starter_id': starter_id})
        select_stmt = text("SELECT * FROM chats_chat WHERE name = :name")
        res = db.session.execute(select_stmt, {'name': name})
        if res:
            chatid = res.fetchone()[0]
            # print('new chatid: " ', chatid)
            db.session.execute(
                ChatsUsers.__table__.insert(), [
                    {'chat_id': chatid, 'user_id': starter_id},
                    {'chat_id': chatid, 'user_id': user_id}
                ]
            )
            db.session.commit()

    def update_chat(id, name, description):
        """Change chat name and description"""
        chat = Chat.query.filter_by(id=id).first()
        chat.name = name
        chat.description = description
        db.session.commit()

    def update_chat_pic(user_id, id, pic):
        """Change chat photo"""
        chat = Chat.query.filter_by(id=id).first()
        if chat.is_private == True and user_id == chat.starter_id:
            chat.pic1 = pic
        elif chat.is_private == True and user_id != chat.starter_id:
            chat.pic2 = pic
        elif chat.is_private == False:
            chat.pic = pic
        else:
            chat.pic = pic
        db.session.commit()

    def delete_chat(id, username):
        """Do a soft delete on a chat by starter or admin"""
        chat = Chat.query.filter_by(id=id).first()
        user = User.query.filter_by(username=username).first()
        if chat.starter_id == user.id:
            chat.is_deleted = True
        elif user.is_admin == True:
            chat.is_deleted = True
            db.session.commit()

    def remove_chat(id, username):
        """Delete a chat completely"""
        chat = Chat.query.filter_by(id=id).first()
        user = User.query.filter_by(username=username).first()
        if user.is_admin == True:
            db.session.delete(chat)
            db.session.commit()

    def join_chat(chat_id, user_ids):
        """Join a chat room"""
        chat = Chat.query.filter_by(id=chat_id).first()
        userids = user_ids.split(',')
        if len(chat.participants) + len(userids) > 2:
            chat.is_private = False
        else:
            chat.is_private = True
        entries = []
        for uid in userids:
            entries.append([chat_id, uid])
        db.session.execute(
            ChatsUsers.__table__.insert(),
            [{'chat_id': chat_id, 'user_id': uid} for chat_id, uid in entries]
        )
        db.session.commit()

    def join_chat_with_usernames(chat_id, user_names):
        """Join a chat room with user name"""
        chat = Chat.query.filter_by(id=chat_id).first()
        usernames = user_names.split(',')
        users = []
        for username in usernames:
            user = User.query.filter_by(username=username).first()
            users.append(user)
        for user in users:
            chat.participants.append(user)
        db.session.commit()

    def leave_chat(chat_id, user_id):
        """Leave chat room"""
        delete_stmt = text(
            "DELETE FROM chats_users WHERE chat_id=:chat_id AND user_id=:user_id")
        delete_values = {'chat_id': chat_id, 'user_id': user_id}
        db.session.execute(delete_stmt, delete_values)
        chat = Chat.query.filter_by(id=chat_id).first()
        if len(chat.participants) > 2:
            chat.is_private = False
        else:
            chat.is_private = True
        db.session.commit()
        # print('participants: ',chat.participants)

    def create_message(content, attachment, chat_id, sender_id):
        """Create message"""
        msg = Message(content, attachment, chat_id, sender_id)
        msgs = Message.query.filter_by(chat_id=chat_id, is_read=False).count()
        chat = Chat.query.filter_by(id=chat_id).first()
        chat.last_content = content[0:20]+'...'
        chat.unread_messages = msgs + 1
        chat.modified_at = db.func.now()
        db.session.add(msg)
        db.session.commit()
        return msg.id

    def create_message_upsert(data):
        """Create a new message as push from offline device"""
        stmt = insert(Message).values(data)
        stmt = stmt.on_conflict_do_update(
            index_elements=['id'],
            set_={
                "content": stmt.excluded.content,
            }
        )
        db.session.execute(stmt)
        db.session.commit()

    def get_messages():
        """Get all messages"""
        message = Message.query.all()
        return message if message else []

    def get_chat_messages(chat_id, content, last):
        """Get messages for a selected chat by id """
        msgs = Message.query.filter(Message.chat_id==chat_id, Message.content.icontains(
            content)).order_by(desc('created_at')).limit(last).all()[::-1]
        return msgs if msgs else []

    def get_message(id):
        """Look up a message given a message id."""
        message = Message.query.filter_by(id=id).first()
        return message if message else []

    def count_unread_messages(user_id):
        """Count all unread messages of user """
        count = Message.query.filter_by(sender_id=user_id, is_read=False).count()
        return count if count else []

    def read_message(id):
        """Flag message status as read"""
        message = Message.query.filter_by(id=id).first()
        message.is_read = True
        db.session.commit()

    def read_messages(chat_id):
        """Flag chat messages status as read"""
        chat = Chat.query.filter_by(id=chat_id).first()
        chat.unread_messages = 0
        messages = Message.query.filter_by(chat_id=chat_id, is_read=False)
        for msg in messages:
            msg.is_read = True
        db.session.commit()

    def delete_message(id):
        """Show message status as deleted"""
        message = Message.query.filter_by(id=id).first()
        message.is_deleted = True
        db.session.commit()
