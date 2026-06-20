from django.contrib import admin
from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact', 'subject', 'status', 'source', 'created_at')
    list_filter = ('status', 'source', 'created_at')
    search_fields = ('name', 'contact', 'subject', 'content')
    list_editable = ('status',)
    readonly_fields = ('name', 'contact', 'subject', 'content', 'source', 'created_at')
    list_per_page = 20
    date_hierarchy = 'created_at'

    fieldsets = (
        ('反馈内容', {'fields': ('name', 'contact', 'subject', 'content')}),
        ('处理', {'fields': ('source', 'status', 'created_at')}),
    )

    def has_add_permission(self, request):
        # 反馈由前台表单写入,后台不手动新增
        return False
