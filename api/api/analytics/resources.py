from import_export import resources
from .models import Analytic


class AnalyticResource(resources.ModelResource):
    class Meta:
        model = Analytic
        fields = ('id', 'anonymous_id', 'user_id', 'user_traits', 'path',
                  'url', 'channel', 'event', 'event_items', 'created_at',)