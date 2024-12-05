import tablib
import json
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Analytic
from .resources import AnalyticResource
from .serializers import AnalyticSerializer


@api_view(['GET', 'POST'])
def import_analytics_json(request):
    if request.method == 'GET':
        queryset = Analytic.objects.all().order_by('-created_at')[:10]
        serializer = AnalyticSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        analytic_resource = AnalyticResource()
        new_data = json.dumps(request.data)
        dataset = tablib.Dataset()
        dataset.load(new_data, format=None)
        result = analytic_resource.import_data(dataset, dry_run=True)
        
    if not result.has_errors():
        analytic_resource.import_data(dataset, dry_run=False)
        # print('import successful')
        # print('dataset', dataset.dict)

        return Response('Great!', status=status.HTTP_200_OK)
    return Response('No data!', status=status.HTTP_400_BAD_REQUEST)
