from django.contrib import admin
from .models import SiteInfo, ServiceCategory, Service, Showcase


@admin.register(SiteInfo)
class SiteInfoAdmin(admin.ModelAdmin):
    list_display = ('name', 'slogan', 'email', 'phone', 'updated_at')
    search_fields = ('name', 'slogan')


class ServiceInline(admin.TabularInline):
    model = Service
    extra = 0
    fields = ('title', 'summary', 'icon', 'order', 'is_active')


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'service_count')
    ordering = ('order', 'id')
    inlines = [ServiceInline]

    @admin.display(description='业务数量')
    def service_count(self, obj):
        return obj.services.count()


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'summary', 'order', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'summary', 'description')
    list_editable = ('order', 'is_active')
    list_per_page = 20


@admin.register(Showcase)
class ShowcaseAdmin(admin.ModelAdmin):
    list_display = ('title', 'tags', 'featured', 'order', 'created_at')
    list_filter = ('featured',)
    search_fields = ('title', 'description', 'tags')
    list_editable = ('featured', 'order')
    list_per_page = 20
