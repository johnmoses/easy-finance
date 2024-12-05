from django.urls import path

from . import views

app_name = "analytics"
urlpatterns = [
    path("json/", views.import_analytics_json, name='analytic-json'),
]
