import rest_framework
from django.http import HttpRequest, HttpResponse
from rest_framework.decorators import (
    api_view, authentication_classes, permission_classes
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.settings import api_settings
from graphene_django.views import GraphQLView


def Welcome(request: HttpRequest) -> HttpResponse:
    return HttpResponse("Welcome to Easy Finance.")

class DRFAuthenticatedGraphQLView(GraphQLView):
    def parse_body(self, request):
        if isinstance(request, rest_framework.request.Request):
            return request.data
        return super(DRFAuthenticatedGraphQLView, self).parse_body(request)
