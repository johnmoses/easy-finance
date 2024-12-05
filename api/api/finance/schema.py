import graphene
from .queries import Query
from .mutations import (
    AccountCreate, AccountUpdate, AccountDelete, AccountRemove,
    TransactionCreate
)


class Queries(Query, graphene.ObjectType):
    pass


class Mutations(graphene.ObjectType):
    account_create = AccountCreate.Field()
    account_update = AccountUpdate.Field()
    account_delete = AccountDelete.Field()
    account_remove = AccountRemove.Field()
    transaction_create = TransactionCreate.Field()
