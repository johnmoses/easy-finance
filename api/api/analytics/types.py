from graphene import Connection, Node, Int, InputObjectType, ID, String
from graphene_django import DjangoObjectType
from .models import (
    Analytic
)


class AnalyticConnection(Connection):
    class Meta:
        abstract = True
    count = Int()

    def resolve_count(root, info):
        return len(root.edges)


class AnalyticType(DjangoObjectType):
    class Meta:
        model = Analytic
        filter_fields = {
            'id': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = AnalyticConnection

class AnalyticInput(InputObjectType):
    id = ID()
    anonymous_id = String()
    user_id = String()
    user_traits = String()
    path = String()
    url = String()
    channel = String()
    event = String()
    event_items = String()
