import graphene
from django.db.models import Q, F, ExpressionWrapper, IntegerField
from graphene_django.filter import DjangoFilterConnectionField
from .models import (
    Chat, Message, ChatsUsers
)
from .types import (
    ChatType, MessageType, ChatsUsersType
)


class Query(graphene.ObjectType):
    chats = DjangoFilterConnectionField(
        ChatType, search=graphene.String(), max_limit=None)

    messages = DjangoFilterConnectionField(
        MessageType, search=graphene.String(), max_limit=None)
    
    chat = graphene.relay.Node.Field(ChatType)

    def resolve_chats(root, info, search=None, **kwargs):
        if search:
            filter = (
                Q(name__icontains=search)
            )
            return Chat.objects.filter(filter)
        return Chat.objects.all()

    def resolve_chat(root, info, **kwargs):
        return Chat.objects.get(id=kwargs.get('id'))
