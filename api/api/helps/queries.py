import graphene
from django.db.models import Q
from graphene_django.filter import DjangoFilterConnectionField
from .models import (
    Category, Help
)
from .types import (
    CategoryType, HelpType
)


class Query(graphene.ObjectType):
    categories = DjangoFilterConnectionField(
        CategoryType,  search=graphene.String())
    helps = DjangoFilterConnectionField(
        HelpType, search=graphene.String(), max_limit=None)

    category = graphene.Field(
        CategoryType, slug=graphene.String())

    help = graphene.relay.Node.Field(HelpType)

    def resolve_categories(root, info, search=None, **kwargs):
        if search:
            filter = (
                Q(slug__icontains=search)
            )
            return Category.objects.filter(filter)
        return Category.objects.all()

    def resolve_helps(root, info, search=None, **kwargs):
        if search:
            filter = (
                Q(title__icontains=search)
            )
            return Help.objects.filter(filter)
        return Help.objects.all()

    def resolve_category(root, info, slug, **kwargs):
        return Category.objects.filter(slug=slug).first()

    def resolve_help(root, info, **kwargs):
        return Help.objects.get(id=kwargs.get('id'))
