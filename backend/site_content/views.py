from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import SiteInfo, ServiceCategory, Showcase
from .serializers import SiteInfoSerializer, ServiceCategorySerializer, ShowcaseSerializer


class SiteInfoView(APIView):
    """GET /api/site-info/ — 站点信息(单条)。"""
    def get(self, request):
        obj = SiteInfo.objects.first()
        return Response(SiteInfoSerializer(obj).data if obj else {})


class ServiceCategoryListView(generics.ListAPIView):
    """GET /api/services/ — 业务分类(含其下业务栏目)。"""
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    pagination_class = None


class ShowcaseListView(generics.ListAPIView):
    """GET /api/showcases/[?featured=true] — 案例展示。"""
    serializer_class = ShowcaseSerializer
    pagination_class = None

    def get_queryset(self):
        qs = Showcase.objects.all()
        if self.request.query_params.get('featured') == 'true':
            qs = qs.filter(featured=True)
        return qs
