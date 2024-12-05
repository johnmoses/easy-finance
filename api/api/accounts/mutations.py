import graphene
from graphql_relay.node.node import from_global_id
from graphql import GraphQLError
from django.utils import timezone
from .models import User
from .types import UserType

currentTime = timezone.now()

class UserCreate(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(
            self, info, username, password):
        user = User(
            username=username,
            password=password
        )
        user.set_password(password)
        user.save()
        return UserCreate(user=user)


class UserUpdate(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        first_name = graphene.String()
        last_name = graphene.String()
        gender = graphene.String()
        bio = graphene.String()
        address = graphene.String()

    def mutate(self, info, first_name, last_name, gender, bio, address):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Sign in to update')
        user.first_name = first_name
        user.last_name = last_name
        user.gender = gender
        user.bio = bio
        user.address = address
        user.is_modified = True
        user.modified_at = currentTime
        user.save()
        return UserUpdate(user=user)


class UserEmailUpdate(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String(required=True)

    def mutate(self, info, email):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Sign in to update')
        user.email = email
        user.is_modified = True
        user.modified_at = currentTime
        user.save()
        return UserEmailUpdate(user=user)


class UserAvatarUpdate(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        avatar = graphene.String()

    def mutate(self, info, avatar):
        user = info.context.user
        if user.avatar:
            user.avatar.delete()
        user.avatar = avatar
        user.is_modified = True
        user.modified_at = currentTime
        user.save()
        return UserAvatarUpdate(user=user)


class UserBirthDayUpdate(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        birth_date = graphene.String(required=True)

    def mutate(self, info, birth_date):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Sign in to update')
        user.birth_date = birth_date
        user.is_modified = True
        user.modified_at = currentTime
        user.save()
        return UserBirthDayUpdate(user=user)


class UserGenderUpdate(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        gender = graphene.String(required=True)

    def mutate(self, info, gender):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Sign in to update')
        user.gender = gender
        user.is_modified = True
        user.modified_at = currentTime
        user.save()
        return UserGenderUpdate(user=user)


class PasswordReset(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        password = graphene.String(required=True)

    def mutate(self, info, password):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Sign in to update')
        user.password = password
        user.save()
        return PasswordReset(user=user)


class AdminToggle(graphene.relay.ClientIDMutation):
    user = graphene.Field(UserType)

    class Input:
        id = graphene.ID()
        is_admin = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_superuser == False):
            raise GraphQLError('Need to be a superuser')

        user = User.objects.get(pk=from_global_id(input.get('id'))[1])
        status = input.get('is_admin')
        user.is_admin = status
        user.save()
        return AdminToggle(user=user)


class SupperToggle(graphene.relay.ClientIDMutation):
    user = graphene.Field(UserType)

    class Input:
        id = graphene.ID()
        is_superadmin = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_superuser == False):
            raise GraphQLError('Need to be a super admin')

        user = User.objects.get(pk=from_global_id(input.get('id'))[1])
        status = input.get('is_superadmin')
        user.is_superadmin = status
        user.save()
        return SupperToggle(user=user)


class ActiveToggle(graphene.relay.ClientIDMutation):
    user = graphene.Field(UserType)

    class Input:
        id = graphene.ID()
        is_active = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        owner = info.context.user
        user = User.objects.get(pk=from_global_id(input.get('id'))[1])
        if (owner != user):
            raise GraphQLError('Need to be account owner')

        status = input.get('is_active')
        user.is_active = status
        user.save()
        return ActiveToggle(user=user)


class UserDelete(graphene.relay.ClientIDMutation):
    user = graphene.Field(UserType)

    class Input:
        id = graphene.ID()
        is_deleted = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        user = User.objects.get(pk=from_global_id(input.get('id'))[1])
        is_deleted = input.get('is_deleted')
        currentTime = timezone.now()
        user.is_deleted = is_deleted
        user.is_verified = False
        if(is_deleted == False):
            user.restored_at=currentTime
            user.is_verified = True
        else:
            user.deleted_at=currentTime
        user.save()
        return UserDelete(user=user)


class UserDeleteFinal(graphene.relay.ClientIDMutation):
    user = graphene.Field(UserType)

    class Input:
        id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_admin == False):
            raise GraphQLError('Need to be at least an admin')
        user = User.objects.get(pk=from_global_id(input.get('id'))[1])

        user.delete()
        return UserDeleteFinal(user=user)
