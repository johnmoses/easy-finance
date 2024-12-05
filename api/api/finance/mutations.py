import graphene
from graphql_relay.node.node import from_global_id
from graphql import GraphQLError
from django.utils import timezone
from .models import (
    Account, Transaction
)
from .types import (
    AccountType, TransactionType
)
from ..accounts.models import User

currentTime = timezone.now()


class AccountCreate(graphene.relay.ClientIDMutation):
    account = graphene.Field(AccountType)

    class Input:
        name = graphene.String()
        description = graphene.String()
        currency = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        sender = info.context.user
        account = Account(
            name=input.get('name'),
            description=input.get('description'),
            currency=input.get('currency'),
            created_at=currentTime,
        )
        account.save()
        return AccountCreate(account=account)

class AccountUpdate(graphene.relay.ClientIDMutation):
    account = graphene.Field(AccountType)

    class Input:
        id = graphene.ID()
        name = graphene.String()
        description = graphene.String()
        currency = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        account = Account.objects.get(pk=from_global_id(input.get('id'))[1])
        account.name=input.get('name')
        account.description=input.get('description')
        account.currency=input.get('currency')
        account.is_modified=True
        account.modified_at=currentTime
        account.save()
        return AccountUpdate(account=account)
    
class AccountDelete(graphene.relay.ClientIDMutation):
    account = graphene.Field(AccountType)

    class Input:
        id = graphene.ID()
        is_deleted = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        account = Account.objects.get(pk=from_global_id(input.get('id'))[1])
        is_deleted = input.get('is_deleted')
        account.is_deleted = is_deleted
        if(is_deleted == False):
            account.restored_at=currentTime
        else:
            account.deleted_at=currentTime
        account.save()
        return AccountDelete(account=account)

    
class AccountRemove(graphene.relay.ClientIDMutation):
    account = graphene.Field(AccountType)

    class Input:
        id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_admin == False):
            raise GraphQLError('Need to be at least an admin user')
        account = Account.objects.get(pk=from_global_id(input.get('id'))[1])

        account.delete()
        return AccountRemove(account=account)

class TransactionCreate(graphene.relay.ClientIDMutation):
    transaction = graphene.Field(TransactionType)

    class Input:
        account_id = graphene.ID()
        amount = graphene.Float()
        description = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        user = info.context.user
        account = Account.objects.get(pk=from_global_id(input.get('account_id'))[1])
        transaction = Transaction(
            user=user,
            account=account,
            amount=input.get('amount'),
            description=input.get('description'),
            created_at=currentTime,
        )
        transaction.save()
        return TransactionCreate(transaction=transaction)