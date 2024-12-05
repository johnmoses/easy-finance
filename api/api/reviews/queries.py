import graphene
from django.db.models import Q
from graphene_django.filter import DjangoFilterConnectionField
from .models import (
    Review
)
from .types import (
    ReviewType
)


class Query(graphene.ObjectType):
    reviews = DjangoFilterConnectionField(ReviewType)

    review = graphene.relay.Node.Field(ReviewType)

    def resolve_reviews(root, info, **kwargs):
        return Review.objects.all()

    def resolve_review(root, info, **kwargs):
        return Review.objects.get(id=kwargs.get('id'))
