import graphene
from django.db.models import Q, F, ExpressionWrapper, IntegerField
from graphene_django.filter import DjangoFilterConnectionField
from .models import (
    Account, Transaction
)
from .types import (
    AccountType, TransactionType
)


class Query(graphene.ObjectType):
    accounts = DjangoFilterConnectionField(
        AccountType, search=graphene.String(),  max_limit=None)
    transactions = DjangoFilterConnectionField(
        TransactionType, max_limit=None)

    account = graphene.relay.Node.Field(AccountType)
    transaction = graphene.relay.Node.Field(TransactionType)

    def resolve_accounts(root, info, search=None, **kwargs):
        if search:
            filter = (
                Q(name__icontains=search)
            )
            return Account.objects.filter(filter)
        return Account.objects.all()

    def resolve_transactions(root, info, **kwargs):
        return Transaction.objects.all()

    def resolve_account(root, info, **kwargs):
        return Account.objects.get(id=kwargs.get('id'))

    def resolve_transaction(root, info, **kwargs):
        return Transaction.objects.get(id=kwargs.get('id'))
