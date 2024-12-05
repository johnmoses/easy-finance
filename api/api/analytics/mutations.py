import graphene
from graphql_relay.node.node import from_global_id
from django.utils import timezone
from .models import (
    Analytic
)
from .types import (
    AnalyticType, AnalyticInput
)


class AnalyticCreate(graphene.relay.ClientIDMutation):
    analytic = graphene.Field(AnalyticType)

    class Input:
        anonymous_id = graphene.String()
        user_id = graphene.String()
        user_traits = graphene.String()
        path = graphene.String()
        url = graphene.String()
        channel = graphene.String()
        event = graphene.String()
        event_items = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        currentTime = timezone.now()
        analytic = Analytic(
            anonymous_id=input.get('anonymous_id'),
            user_id=input.get('user_id'),
            user_traits=input.get('user_traits'),
            path=input.get('path'),
            url=input.get('url'),
            channel=input.get('channel'),
            event=input.get('event'),
            event_items=input.get('event_items'),
            created_at=currentTime,
        )
        analytic.save()
        return AnalyticCreate(analytic=analytic)


class AnalyticUpsert(graphene.relay.ClientIDMutation):
    analytic = graphene.Field(AnalyticType)

    class Input:
        id = graphene.ID()
        anonymous_id = graphene.String()
        user_id = graphene.String()
        user_traits = graphene.String()
        path = graphene.String()
        url = graphene.String()
        channel = graphene.String()
        event = graphene.String()
        event_items = graphene.String()
        created_at = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        analytic = Analytic(
            id=input.get('id'),
            anonymous_id=input.get('anonymous_id'),
            user_id=input.get('user_id'),
            user_traits=input.get('user_traits'),
            path=input.get('path'),
            url=input.get('url'),
            channel=input.get('channel'),
            event=input.get('event'),
            event_items=input.get('event_items'),
            created_at=input.get('created_at'),
        )
        analytic.save()
        return AnalyticUpsert(analytic=analytic)


class AnalyticUpsertBulk(graphene.relay.ClientIDMutation):
    analytics = graphene.List(AnalyticType)

    class Input:
        data = graphene.List(AnalyticInput)

    def mutate_and_get_payload(self, info, data):
        analytics = []
        for item in data:
            analytic = Analytic.objects.create(
                id=item['id'],
                anonymous_id=item['anonymous_id'],
                user_id=item['user_id'],
                path=item['path'],
                url=item['url'],
                channel=item['channel'],
                event=item['event'],
                event_items=['event_items'],
                # created_at=['created_at']
            )
            analytics.append(analytic)
            return AnalyticUpsertBulk(analytics=analytics)


class AnalyticUpdate(graphene.relay.ClientIDMutation):
    analytic = graphene.Field(AnalyticType)

    class Input:
        id = graphene.ID()
        anonymous_id = graphene.String()
        user_id = graphene.String()
        user_traits = graphene.String()
        path = graphene.String()
        url = graphene.String()
        channel = graphene.String()
        event = graphene.String()
        event_items = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        analytic = Analytic.objects.get(
            pk=from_global_id(input.get('id'))[1])
        analytic.anonymous_id = input.get('anonymous_id')
        analytic.user_id = input.get('user_id')
        analytic.user_traits = input.get('user_traits')
        analytic.path = input.get('path')
        analytic.url = input.get('url')
        analytic.channel = input.get('channel')
        analytic.event = input.get('event')
        analytic.event_items = input.get('event_items')
        analytic.save()

        return AnalyticUpdate(analytic=analytic)
