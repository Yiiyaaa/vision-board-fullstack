import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import generics
from rest_framework.throttling import ScopedRateThrottle

from .models import Inquiry
from .serializers import InquirySerializer

logger = logging.getLogger(__name__)


class InquiryCreateView(generics.CreateAPIView):
    """POST /api/inquiries/ — 接收「反馈与联系」表单,写入数据库并发送邮件提醒。"""
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    # 防刷:同一来源 IP 每小时最多 10 次
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'inquiry'

    def perform_create(self, serializer):
        instance = serializer.save()
        self._notify(instance)

    def _notify(self, inquiry):
        """给站长邮箱发一封新反馈提醒。邮件失败绝不影响入库与用户提交结果。"""
        recipient = getattr(settings, 'FEEDBACK_NOTIFY_TO', '')
        if not recipient:
            return
        local_time = timezone.localtime(inquiry.created_at)
        subject = f'[愿景板] 新反馈 · {inquiry.subject or "无主题"}'
        body = (
            '你收到一条新的反馈：\n\n'
            f'称呼：{inquiry.name or "(未填)"}\n'
            f'联系方式：{inquiry.contact or "(未填)"}\n'
            f'主题：{inquiry.subject or "(未填)"}\n'
            f'提交时间：{local_time:%Y-%m-%d %H:%M:%S}\n\n'
            f'内容：\n{inquiry.content}\n\n'
            f'— 到后台查看并处理：/admin/inquiry/inquiry/{inquiry.id}/change/\n'
        )
        try:
            send_mail(
                subject,
                body,
                getattr(settings, 'DEFAULT_FROM_EMAIL', None),
                [recipient],
                fail_silently=False,
            )
        except Exception:
            logger.exception('反馈邮件提醒发送失败 (inquiry id=%s)', inquiry.id)
