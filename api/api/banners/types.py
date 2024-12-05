from graphene import Connection, Node, Int
from graphene_django.types import DjangoObjectType
from .models import (
    Banner
)


class BannersConnection(Connection):
    class Meta:
        abstract = True
    count = Int()

    def resolve_count(root, info):
        return len(root.edges)


class BannerType(DjangoObjectType):
    class Meta:
        model = Banner
        filter_fields = {
            'id': ['exact', 'icontains'],
            'is_active': ['exact', 'icontains'],
            'is_deleted': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = BannersConnection
