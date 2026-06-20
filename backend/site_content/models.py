from django.db import models


class SiteInfo(models.Model):
    """站点基础信息(单例式,后台维护一条即可)。"""
    name = models.CharField('站点名称', max_length=100, default='愿景板工作室')
    slogan = models.CharField('标语', max_length=200, blank=True)
    intro = models.TextField('简介', blank=True)
    email = models.EmailField('联系邮箱', blank=True)
    phone = models.CharField('联系电话', max_length=50, blank=True)
    address = models.CharField('地址', max_length=200, blank=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        verbose_name = '站点信息'
        verbose_name_plural = '站点信息'

    def __str__(self):
        return self.name


class ServiceCategory(models.Model):
    """业务分类(官网业务栏目的一级分组)。"""
    name = models.CharField('分类名称', max_length=50)
    order = models.IntegerField('排序', default=0)

    class Meta:
        verbose_name = '业务分类'
        verbose_name_plural = '业务分类'
        ordering = ['order', 'id']

    def __str__(self):
        return self.name


class Service(models.Model):
    """业务栏目项。"""
    category = models.ForeignKey(
        ServiceCategory, verbose_name='所属分类',
        on_delete=models.CASCADE, related_name='services')
    title = models.CharField('业务名称', max_length=100)
    summary = models.CharField('一句话简介', max_length=200, blank=True)
    description = models.TextField('详细描述', blank=True)
    icon = models.CharField('图标(emoji/字符)', max_length=20, blank=True)
    order = models.IntegerField('排序', default=0)
    is_active = models.BooleanField('启用', default=True)

    class Meta:
        verbose_name = '业务栏目'
        verbose_name_plural = '业务栏目'
        ordering = ['order', 'id']

    def __str__(self):
        return self.title


class Showcase(models.Model):
    """愿景板案例 / 数据展示。"""
    title = models.CharField('案例标题', max_length=120)
    description = models.TextField('案例描述', blank=True)
    image = models.CharField('封面图(URL 或相对路径)', max_length=300, blank=True)
    tags = models.CharField('标签(逗号分隔)', max_length=200, blank=True)
    featured = models.BooleanField('首页精选', default=False)
    order = models.IntegerField('排序', default=0)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)

    class Meta:
        verbose_name = '案例展示'
        verbose_name_plural = '案例展示'
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    @property
    def tag_list(self):
        return [t.strip() for t in self.tags.split(',') if t.strip()]
