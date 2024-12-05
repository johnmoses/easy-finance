import graphene
from .queries import Query
from .mutations import (
    CategoryCreate, CategoryUpdate,
    CategoryDelete, CategoryRemove,
    HelpCreate, HelpUpdate,
    HelpDelete, HelpRemove,
)


class Queries(Query, graphene.ObjectType):
    pass


class Mutations(graphene.ObjectType):
    category_create = CategoryCreate.Field()
    category_update = CategoryUpdate.Field()
    category_delete = CategoryDelete.Field()
    category_remove = CategoryRemove.Field()
    help_create = HelpCreate.Field()
    help_update = HelpUpdate.Field()
    help_delete = HelpDelete.Field()
    help_remove = HelpRemove.Field()
