from django.db import migrations, models


def forward_status(apps, schema_editor):
    Inquiry = apps.get_model('inquiry', 'Inquiry')
    Inquiry.objects.filter(status='new').update(status='unread')
    Inquiry.objects.filter(status='contacted').update(status='replied')


def backward_status(apps, schema_editor):
    Inquiry = apps.get_model('inquiry', 'Inquiry')
    Inquiry.objects.filter(status='unread').update(status='new')
    Inquiry.objects.filter(status='replied').update(status='contacted')


class Migration(migrations.Migration):

    dependencies = [
        ('inquiry', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='inquiry',
            old_name='message',
            new_name='content',
        ),
        migrations.AlterModelOptions(
            name='inquiry',
            options={'ordering': ['-created_at'], 'verbose_name': '反馈留言', 'verbose_name_plural': '反馈留言'},
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='name',
            field=models.CharField(blank=True, max_length=50, verbose_name='称呼'),
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='contact',
            field=models.CharField(blank=True, max_length=100, verbose_name='联系方式'),
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='subject',
            field=models.CharField(blank=True, max_length=120, verbose_name='主题'),
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='content',
            field=models.TextField(verbose_name='内容'),
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='source',
            field=models.CharField(default='反馈与联系页', max_length=50, verbose_name='来源'),
        ),
        migrations.AlterField(
            model_name='inquiry',
            name='status',
            field=models.CharField(
                choices=[('unread', '未读'), ('read', '已读'), ('replied', '已回复'), ('closed', '已关闭')],
                default='unread', max_length=20, verbose_name='处理状态',
            ),
        ),
        migrations.RunPython(forward_status, backward_status),
    ]
