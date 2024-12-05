from django.contrib import admin

from .models import (
    Category, Help
)

admin.site.register(Category)
admin.site.register(Help)
