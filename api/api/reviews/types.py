from graphene import Connection, Node, Int
from graphene_django import DjangoObjectType
from .models import (
    Review
)


class ReviewConnection(Connection):
    class Meta:
        abstract = True
    count = Int()

    def resolve_count(root, info):
        return len(root.edges)


class ReviewType(DjangoObjectType):
    class Meta:
        model = Review
        filter_fields = {
            'id': ['exact', 'icontains'],
            'reviewer': ['exact'],
            'reviewer_id': ['exact'],
            'item_id': ['exact'],
            'item_type': ['exact'],
            'is_deleted': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = ReviewConnection
