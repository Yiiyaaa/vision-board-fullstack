"""写入「愿景板工作室」官网的真实种子数据,并创建后台超管账号。

幂等:重复运行会先清空内容表再写入(不影响已有的咨询留言)。
用法: python manage.py seed
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from site_content.models import SiteInfo, ServiceCategory, Service, Showcase


SITE = {
    'name': '愿景板工作室',
    'slogan': '先看见,再靠近 —— 把心愿做成看得见的样子',
    'intro': (
        '愿景板工作室是一个把目标、灵感与心愿可视化的创意平台。'
        '上传照片、写下心愿文案、一键拼贴成精致的愿景板,导出高清壁纸,'
        '让你想要的生活每天都被看见。'
    ),
    'email': 'hello@makeitvisible.studio',
    'phone': '400-000-0000',
    'address': '中国 · 线上工作室',
}

CATEGORIES = [
    ('创作工具', 0, [
        ('🧩', '自动拼贴', '一键把照片拼成精致愿景板',
         '内置 BSP 智能排版,支持压边 / 平铺 / 留白三种边缘风格,并可固定布局后只换图不换结构。'),
        ('🎨', '智能配色', '从照片自动提取主题色',
         '上传图片后自动生成主题色卡,内置玻璃质感取色器,支持 HEX / RGB / HSL 并记住你的偏好。'),
        ('✍️', '文字与文案', '50+ 字体与心愿文案库',
         '中英多语种字体、描边 / 阴影 / 发光 / 背景样式,内置精选心愿文案,点击即用。'),
        ('✨', '装饰与对齐', '细线、圆点与拖动对齐',
         '细线和圆点点缀,拖动时出现对齐参考线,轻盈不打扰地帮你把元素摆正。'),
    ]),
    ('使用场景', 1, [
        ('📱', '手机壁纸', '导出竖版高清壁纸',
         '一键导出 2 倍高清 PNG,适配手机锁屏,让愿景每天第一眼被看见。'),
        ('🎯', '目标管理', '把年度目标可视化',
         '把读书、健身、旅行、储蓄等目标做成一张图,贴在显眼处持续提醒自己。'),
        ('💞', '灵感收藏', '收集喜欢的一切',
         '把喜欢的色彩、画面、句子收进同一块板子,沉淀属于你的审美与方向。'),
    ]),
    ('增值服务', 2, [
        ('🖌️', '定制设计', '一对一愿景板定制',
         '由设计师根据你的主题与素材,定制专属版式与配色,交付可编辑工程与成品图。'),
        ('🤝', '品牌联名', '主题模板与活动共创',
         '为品牌定制愿景板主题模板,适用于新年心愿、会员活动等场景的用户共创。'),
    ]),
]

SHOWCASES = [
    ('2026 旅行心愿板', '把今年想去的城市、想看的风景拼成一张图,出发前每天都看一眼。',
     '旅行,心愿,目标', True, 0),
    ('读书计划可视化', '一年想读的 24 本书封面拼贴成墙,读完一本就点亮一格。',
     '读书,计划,成长', True, 1),
    ('健身打卡墙', '理想身材、训练计划和饮食灵感放在一起,自律有了画面感。',
     '健身,自律,打卡', True, 2),
    ('创业第一年愿景', '产品草图、团队合照、目标数字——把创业的方向钉在眼前。',
     '创业,目标,团队', False, 3),
    ('新家装修愿景', '把喜欢的家居风格、配色和家具收进一块板子,装修不再纠结。',
     '家居,装修,灵感', False, 4),
    ('婚礼灵感板', '婚纱、花艺、场地与色调统一收集,和另一半一起确定风格。',
     '婚礼,灵感,共创', False, 5),
]


class Command(BaseCommand):
    help = '写入官网真实种子数据并创建后台超管账号(admin / admin12345)'

    def handle(self, *args, **options):
        # 站点信息(保持单条)
        SiteInfo.objects.all().delete()
        SiteInfo.objects.create(**SITE)
        self.stdout.write(self.style.SUCCESS('· 站点信息已写入'))

        # 业务分类与栏目(先清空内容表,咨询表不动)
        Service.objects.all().delete()
        ServiceCategory.objects.all().delete()
        n_svc = 0
        for cat_name, cat_order, services in CATEGORIES:
            cat = ServiceCategory.objects.create(name=cat_name, order=cat_order)
            for i, (icon, title, summary, desc) in enumerate(services):
                Service.objects.create(
                    category=cat, title=title, summary=summary,
                    description=desc, icon=icon, order=i, is_active=True)
                n_svc += 1
        self.stdout.write(self.style.SUCCESS(
            f'· 业务分类 {len(CATEGORIES)} 个 / 业务栏目 {n_svc} 条已写入'))

        # 案例展示
        Showcase.objects.all().delete()
        for title, desc, tags, featured, order in SHOWCASES:
            Showcase.objects.create(
                title=title, description=desc, tags=tags,
                featured=featured, order=order)
        self.stdout.write(self.style.SUCCESS(f'· 案例展示 {len(SHOWCASES)} 条已写入'))

        # 后台超管
        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin12345')
            self.stdout.write(self.style.SUCCESS('· 超管已创建: admin / admin12345'))
        else:
            self.stdout.write('· 超管已存在,跳过')

        self.stdout.write(self.style.SUCCESS('种子数据写入完成 ✓'))
