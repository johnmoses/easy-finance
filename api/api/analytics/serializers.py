from rest_framework import serializers
from .models import Analytic


class AnalyticSerializer(serializers.ModelSerializer):

    class Meta:
        model = Analytic
        # fields = '__all__'
        fields = ('id', 'anonymous_id', 'user_id', 'user_traits', 'path',
                  'url', 'channel', 'event', 'event_items', 'created_at',)
