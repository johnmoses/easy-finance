from django.db import models
from django.conf import settings
from django.utils import timezone


class Account(models.Model):
    """ 
    Banking accounts
    """
    name = models.CharField(max_length=15, blank=False)
    description = models.CharField(max_length=225, null=True, blank=True)
    balance = models.FloatField(blank=True,null=True)
    currency = models.CharField(max_length=15, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)
    modified_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(auto_now_add=True)
    restored_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class Transaction(models.Model):
    """ 
    Account transactions
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='user_transactions',
        on_delete=models.CASCADE
    )
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE,
        related_name='account_transactions', null=True
    )
    amount = models.FloatField(blank=True,null=True)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(default=timezone.now, blank=True)
