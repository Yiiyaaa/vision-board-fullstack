from rest_framework import serializers
from .models import SiteInfo, ServiceCategory, Service, Showcase


class SiteInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteInfo
        fields = ['name', 'slogan', 'intro', 'email', 'phone', 'address']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'summary', 'description', 'icon', 'order']


class ServiceCategorySerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()

    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'order', 'services']

    def get_services(self, obj):
        qs = obj.services.filter(is_active=True)
        return ServiceSerializer(qs, many=True).data


class ShowcaseSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Showcase
        fields = ['id', 'title', 'description', 'image', 'tags', 'featured', 'order']

    def get_tags(self, obj):
        return obj.tag_list
