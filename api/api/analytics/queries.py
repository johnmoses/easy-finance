import graphene
from django.db.models import Q
from graphene_django.filter import DjangoFilterConnectionField
from .models import (
    Analytic
)
from .types import (
    AnalyticType
)


class Query(graphene.ObjectType):
    analytics = DjangoFilterConnectionField(AnalyticType)

    analytic = graphene.relay.Node.Field(AnalyticType)

    def resolve_analytics(root, info, **kwargs):
        return Analytic.objects.all()

    def resolve_analytic(root, info, **kwargs):
        return Analytic.objects.get(id=kwargs.get('id'))
