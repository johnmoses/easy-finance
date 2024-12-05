import graphene
from .queries import Query
from .mutations import (
    AnalyticCreate, AnalyticUpsert, AnalyticUpsertBulk, AnalyticUpdate
)


class Queries(Query, graphene.ObjectType):
    pass


class Mutations(graphene.ObjectType):
    analytic_create = AnalyticCreate.Field()
    analytic_upsert = AnalyticUpsert.Field()
    analytic_upsertbulk = AnalyticUpsertBulk.Field()
    analytic_update = AnalyticUpdate.Field()
