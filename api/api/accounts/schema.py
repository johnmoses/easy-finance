import graphene
from .queries import Query
from .mutations import (
    UserCreate, UserUpdate, UserEmailUpdate, UserBirthDayUpdate,
    UserAvatarUpdate, UserGenderUpdate, PasswordReset,
    AdminToggle, SupperToggle, ActiveToggle,
    UserDelete, UserDeleteFinal
)


class Queries(Query, graphene.ObjectType):
    pass


class Mutations(graphene.ObjectType):
    user_create = UserCreate.Field()
    user_update = UserUpdate.Field()
    email_update = UserEmailUpdate.Field()
    password_reset = PasswordReset.Field()
    avatar_update = UserAvatarUpdate.Field()
    birthday_update = UserBirthDayUpdate.Field()
    gender_update = UserGenderUpdate.Field()
    admin_toggle = AdminToggle.Field()
    super_toggle = SupperToggle.Field()
    active_toggle = ActiveToggle.Field()
    user_delete = UserDelete.Field()
    user_deletefinal = UserDeleteFinal.Field()
