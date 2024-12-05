import graphene
from graphql_relay.node.node import from_global_id
from graphql import GraphQLError
from django.utils import timezone
from .models import Banner
from .types import BannerType

currentTime = timezone.now()

class BannerCreate(graphene.relay.ClientIDMutation):
    banner = graphene.Field(BannerType)

    class Input:
        title = graphene.String()
        content = graphene.String()
        pic = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        banner = Banner(
            title=input.get('title'),
            content=input.get('content'),
            pic=input.get('pic'),
        )
        banner.save()
        return BannerCreate(banner=banner)


class BannerUpdate(graphene.relay.ClientIDMutation):
    banner = graphene.Field(BannerType)

    class Input:
        id = graphene.ID()
        title = graphene.String()
        content = graphene.String()
        pic = graphene.String()
        is_active = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        banner = Banner.objects.get(pk=from_global_id(input.get('id'))[1])
        banner.title = input.get('title')
        banner.content = input.get('content')
        banner.pic = input.get('pic')
        banner.is_active = input.get('is_active')
        banner.modified_at = currentTime
        banner.save()
        return BannerUpdate(banner=banner)


class BannerDelete(graphene.relay.ClientIDMutation):
    banner = graphene.Field(BannerType)

    class Input:
        id = graphene.ID()
        is_deleted = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        banner = Banner.objects.get(pk=from_global_id(input.get('id'))[1])
        is_deleted = input.get('is_deleted')
        banner.is_deleted = is_deleted
        if(is_deleted == False):
            banner.restored_at=currentTime
        else:
            banner.deleted_at=currentTime
        banner.save()
        return BannerDelete(banner=banner)

class BannerRemove(graphene.relay.ClientIDMutation):
    banner = graphene.Field(BannerType)

    class Input:
        id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_admin == False):
            raise GraphQLError('Need to be at least an admin user')
        banner = Banner.objects.get(pk=from_global_id(input.get('id'))[1])

        banner.delete()
        return BannerRemove(banner=banner)
