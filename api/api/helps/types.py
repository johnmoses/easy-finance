from graphene import Connection, Node, Int
from graphene_django.types import DjangoObjectType
from .models import (
    Category, Help
)


class HelpConnection(Connection):
    class Meta:
        abstract = True
    count = Int()

    def resolve_count(root, info):
        return len(root.edges)

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        filter_fields = {
            'id': ['exact', 'icontains'],
            'name': ['exact', 'icontains', 'istartswith', 'iendswith'],
            'slug': ['exact', 'icontains', 'istartswith', 'iendswith'],
            'is_deleted': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = HelpConnection

class HelpType(DjangoObjectType):
    class Meta:
        model = Help
        filter_fields = {
            'id': ['exact', 'icontains'],
            'title': ['exact', 'icontains', 'istartswith', 'iendswith'],
            'content': ['exact', 'icontains', 'istartswith', 'iendswith'],
            'category': ['exact'],
            'category_id': ['exact'],
            'is_deleted': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = HelpConnection
