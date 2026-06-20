from django.db import models


class Inquiry(models.Model):
    """官网「反馈与联系」表单提交记录。"""
    STATUS_CHOICES = [
        ('unread', '未读'),
        ('read', '已读'),
        ('replied', '已回复'),
        ('closed', '已关闭'),
    ]
    name = models.CharField('称呼', max_length=50, blank=True)
    contact = models.CharField('联系方式', max_length=100, blank=True)
    subject = models.CharField('主题', max_length=120, blank=True)
    content = models.TextField('内容')
    source = models.CharField('来源', max_length=50, default='反馈与联系页')
    status = models.CharField('处理状态', max_length=20, choices=STATUS_CHOICES, default='unread')
    created_at = models.DateTimeField('提交时间', auto_now_add=True)

    class Meta:
        verbose_name = '反馈留言'
        verbose_name_plural = '反馈留言'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name or "匿名"} · {self.subject or self.content[:20]}'
