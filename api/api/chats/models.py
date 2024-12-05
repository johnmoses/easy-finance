from django.db import models
from django.conf import settings
from django.utils import timezone


class Chat(models.Model):
    name = models.TextField(max_length=50)
    description = models.TextField(max_length=100, null=True, blank=True)
    pic = models.CharField(max_length=50, null=True, blank=True)
    pic1 = models.CharField(max_length=50, null=True, blank=True)
    pic2 = models.CharField(max_length=50, null=True, blank=True)
    is_bot = models.BooleanField(default=False)
    is_private = models.BooleanField(default=True)
    last_content = models.TextField(max_length=100, null=True, blank=True)
    unread_messages = models.IntegerField(default=0)
    starter_id = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)
    modified_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(auto_now_add=True)
    restored_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.name


class Message(models.Model):
    idx = models.CharField(max_length=50, blank=True, null=True)
    content = models.TextField(null=True, blank=True)
    attachment = models.CharField(max_length=50, null=True, blank=True)
    chat_id = models.IntegerField(default=0)
    sender_id = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(auto_now_add=True)

class ChatsUsers(models.Model):
    chat_id = models.IntegerField(default=0)
    user_id = models.IntegerField(default=0)
