import graphene
from .queries import Query

class Queries(Query, graphene.ObjectType):
    pass