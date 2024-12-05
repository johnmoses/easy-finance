from django.contrib import admin
from .models import (
    Chat, Message, ChatsUsers
)

admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(ChatsUsers)