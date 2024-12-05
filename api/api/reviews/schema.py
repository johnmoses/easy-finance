import graphene
from .queries import Query
from .mutations import (
    ReviewCreate, ReviewDelete, ReviewRemove
)


class Queries(Query, graphene.ObjectType):
    pass


class Mutations(graphene.ObjectType):
    review_create = ReviewCreate.Field()
    review_delete = ReviewDelete.Field()
    review_remove = ReviewRemove.Field()
