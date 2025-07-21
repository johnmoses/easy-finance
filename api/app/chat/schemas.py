from app.extensions import ma
from app.chat.models import ChatMessage

class ChatMessageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ChatMessage
        load_instance = True

chat_message_schema = ChatMessageSchema()
chat_messages_schema = ChatMessageSchema(many=True)
