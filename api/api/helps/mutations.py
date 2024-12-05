import graphene
from graphql_relay.node.node import from_global_id
from graphql import GraphQLError
from django.utils import timezone
from .models import (
    Category, Help
)
from .types import (
    CategoryType, HelpType
)

currentTime = timezone.now()

class CategoryCreate(graphene.relay.ClientIDMutation):
    category = graphene.Field(CategoryType)

    class Input:
        name = graphene.String()
        description = graphene.String()
        pic = graphene.String()


    def mutate_and_get_payload(self, info, **input):
        category = Category(
            name=input.get('name'),
            description=input.get('description'),
            pic=input.get('pic'),
        )
        category.save()
        return CategoryCreate(category=category)


class CategoryUpdate(graphene.relay.ClientIDMutation):
    category = graphene.Field(CategoryType)

    class Input:
        id = graphene.ID()
        name = graphene.String()
        description = graphene.String()
        pic = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        category = Category.objects.get(pk=from_global_id(input.get('id'))[1])

        category.name = input.get('name')
        category.description = input.get('description')
        category.pic = input.get('pic')
        category.is_modified = True
        category.modified_at = currentTime
        category.save()
        return CategoryUpdate(category=category)


class CategoryDelete(graphene.relay.ClientIDMutation):
    category = graphene.Field(CategoryType)

    class Input:
        id = graphene.ID()
        is_deleted = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        category = Category.objects.get(pk=from_global_id(input.get('id'))[1])
        is_deleted = input.get('is_deleted')
        category.is_deleted = is_deleted
        if(is_deleted == False):
            category.restored_at=currentTime
        else:
            category.deleted_at=currentTime
        category.save()
        return CategoryDelete(category=category)

    
class CategoryRemove(graphene.relay.ClientIDMutation):
    category = graphene.Field(CategoryType)

    class Input:
        id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_admin == False):
            raise GraphQLError('Need to be at least an admin user')
        category = Category.objects.get(pk=from_global_id(input.get('id'))[1])

        category.delete()
        return CategoryRemove(category=category)


class HelpCreate(graphene.relay.ClientIDMutation):
    help = graphene.Field(HelpType)

    class Input:
        title = graphene.String()
        content = graphene.String()
        pic = graphene.String()
        category_id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        category = Category.objects.get(
            pk=from_global_id(input.get('category_id'))[1])
        help = Help(
            title=input.get('title'),
            content=input.get('content'),
            pic=input.get('pic'),
            category=category
        )
        help.save()
        return HelpCreate(help=help)


class HelpUpdate(graphene.relay.ClientIDMutation):
    help = graphene.Field(HelpType)

    class Input:
        id = graphene.ID()
        title = graphene.String()
        content = graphene.String()
        pic = graphene.String()
        category_id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        category = Category.objects.get(
            pk=from_global_id(input.get('category_id'))[1])
        help = Help.objects.get(pk=from_global_id(input.get('id'))[1])
        help.title = input.get('title')
        help.content = input.get('content')
        help.pic = input.get('pic')
        help.category = category
        help.is_modified = True
        help.modified_at = currentTime
        help.save()
        return HelpUpdate(help=help)


class HelpDelete(graphene.relay.ClientIDMutation):
    help = graphene.Field(HelpType)

    class Input:
        id = graphene.ID()
        is_deleted = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        help = Help.objects.get(pk=from_global_id(input.get('id'))[1])
        is_deleted = input.get('is_deleted')
        help.is_deleted = is_deleted
        if(is_deleted == False):
            help.restored_at=currentTime
        else:
            help.deleted_at=currentTime
        help.save()
        return HelpDelete(help=help)


class HelpRemove(graphene.relay.ClientIDMutation):
    help = graphene.Field(HelpType)

    class Input:
        id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_admin == False):
            raise GraphQLError('Need to be at least an admin user')
        help = Help.objects.get(pk=from_global_id(input.get('id'))[1])

        help.delete()
        return HelpRemove(help=help)
