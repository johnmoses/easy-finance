import graphene
from graphql_relay.node.node import from_global_id
from graphql import GraphQLError
from django.utils import timezone
from .models import (
    Review
)
from .types import (
    ReviewType
)

currentTime = timezone.now()

class ReviewCreate(graphene.relay.ClientIDMutation):
    review = graphene.Field(ReviewType)

    class Input:
        content = graphene.String()
        rating = graphene.Float()
        item_id = graphene.String()
        item_type = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        reviewer = info.context.user
        review = Review(
            content=input.get('content'),
            rating=input.get('rating'),
            item_id=input.get('item_id'),
            item_type=input.get('item_type'),
            reviewer=reviewer
        )
        review.save()

        return ReviewCreate(review=review)


class ReviewUpdate(graphene.relay.ClientIDMutation):
    review = graphene.Field(ReviewType)

    class Input:
        id = graphene.ID()
        is_flagged = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        review = Review.objects.get(pk=from_global_id(input.get('id'))[1])
        review.is_flagged = input.get('is_flagged')
        review.restored_at=currentTime
        review.save()
        return ReviewUpdate(review=review)
    
class ReviewDelete(graphene.relay.ClientIDMutation):
    review = graphene.Field(ReviewType)

    class Input:
        id = graphene.ID()
        is_deleted = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        review = Review.objects.get(pk=from_global_id(input.get('id'))[1])
        is_deleted = input.get('is_deleted')
        review.is_deleted = is_deleted
        if(is_deleted == False):
            review.restored_at=currentTime
        else:
            review.deleted_at=currentTime
        review.save()
        review.save()
        return ReviewDelete(review=review)


class ReviewRemove(graphene.relay.ClientIDMutation):
    review = graphene.Field(ReviewType)

    class Input:
        id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_admin == False):
            raise GraphQLError('Need to be at least an admin user')
        review = Review.objects.get(pk=from_global_id(input.get('id'))[1])

        review.delete()
        return ReviewRemove(review=review)
