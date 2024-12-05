import graphene
from .queries import Query
from .mutations import (
    BannerCreate, BannerUpdate, BannerDelete, BannerRemove
)


class Queries(Query, graphene.ObjectType):
    pass


class Mutations(graphene.ObjectType):
    banner_create = BannerCreate.Field()
    banner_update = BannerUpdate.Field()
    banner_delete = BannerDelete.Field()
    banner_remove = BannerRemove.Field()
