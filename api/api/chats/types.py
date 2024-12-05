from graphene import Connection, Node, Int
from graphene_django.types import DjangoObjectType
from .models import (
    Chat, Message, ChatsUsers
)


class ChatConnection(Connection):
    class Meta:
        abstract = True
    count = Int()

    def resolve_count(root, info):
        return len(root.edges)

class ChatType(DjangoObjectType):
    total_count = Int()
    class Meta:
        model = Chat
        filter_fields = {
            'id': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = ChatConnection

class MessageType(DjangoObjectType):
    total_count = Int()
    class Meta:
        model = Message
        filter_fields = {
            'id': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = ChatConnection

class ChatsUsersType(DjangoObjectType):
    total_count = Int()
    class Meta:
        model = ChatsUsers
        filter_fields = {
            'id': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = ChatConnection