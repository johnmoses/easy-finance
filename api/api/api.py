import graphene
import graphql_jwt

import api.accounts.schema
import api.analytics.schema
import api.banners.schema
import api.helps.schema
import api.finance.schema
import api.stocks.schema
import api.chats.schema
import api.reviews.schema


class Query(
    api.accounts.schema.Queries,
    api.analytics.schema.Queries,
    api.banners.schema.Queries,
    api.helps.schema.Queries,
    api.finance.schema.Queries,
    api.stocks.schema.Queries,
    api.chats.schema.Queries,
    api.reviews.schema.Queries,
    graphene.ObjectType
):
    pass


class Mutation(
    api.accounts.schema.Mutations,
    api.analytics.schema.Mutations,
    api.banners.schema.Mutations,
    api.helps.schema.Mutations,
    api.finance.schema.Mutations,
    api.stocks.schema.Mutations,
    api.reviews.schema.Mutations,
    graphene.ObjectType
):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
