import graphene
from django.db.models import Q
from graphene_django.filter import DjangoFilterConnectionField
from .models import Banner
from .types import BannerType


class Query(graphene.ObjectType):
    banners = DjangoFilterConnectionField(BannerType)
    banner = graphene.relay.Node.Field(BannerType)

    def resolve_banners(root, info, **kwargs):
        return Banner.objects.all().order_by('-created_at')

    def resolve_banner(root, info, **kwargs):
        return Banner.objects.get(id=kwargs.get('id'))
