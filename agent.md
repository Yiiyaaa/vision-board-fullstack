# 愿景板工作室 · 全栈项目说明(agent.md)

一个围绕「愿景板」业务的全栈网站:Vue 官网前台 + Django 后端 + SQLite 数据库 + Simple UI 中文管理后台。导航与首页的「开始创作」按钮直接跳转到全屏静态愿景板编辑器。

---

## 技术栈

| 层 | 技术 |
|---|---|
| 前端官网 | Vue 3 + Vite 5 + Vue Router(Hash 模式)+ axios |
| 后端 | Django 5.1 + Django REST Framework |
| 数据库 | SQLite(`backend/db.sqlite3`) |
| 后台管理 | django-simpleui(中文)+ django-admin |
| 跨域 | django-cors-headers(开发)/ vite dev proxy |
| 体验入口 | 导航 / 首页「开始创作」直接跳转全屏静态编辑器(`frontend/public/editor/index.html`) |

## 目录结构

```
vision-fullstack/
├─ agent.md                 # 本文档
├─ .gitignore
├─ backend/                 # Django 后端
│  ├─ .venv/                # Python 虚拟环境(已 gitignore)
│  ├─ manage.py
│  ├─ db.sqlite3            # SQLite 数据库(已 gitignore)
│  ├─ config/               # 项目配置(settings/urls/wsgi)
│  ├─ site_content/         # 应用:站点信息 / 业务分类 / 业务栏目 / 案例
│  │  ├─ models.py  admin.py  serializers.py  views.py  urls.py
│  │  └─ management/commands/seed.py   # 种子数据 + 超管
│  └─ inquiry/              # 应用:咨询 / 留资表单
│     └─ models.py  admin.py  serializers.py  views.py  urls.py
└─ frontend/                # Vue 官网
   ├─ package.json  vite.config.js  index.html
   ├─ public/editor/        # 嵌入的愿景板编辑器(静态)
   └─ src/
      ├─ main.js  App.vue  style.css
      ├─ router/index.js
      ├─ api/index.js        # axios 封装,调用 /api/*
      └─ views/ Home / Services / Showcases / Contact .vue
```

## 数据模型(SQLite 表)

| 模型 | 说明 | 关键字段 |
|---|---|---|
| `SiteInfo` | 站点信息(单条) | name, slogan, intro, email, phone, address |
| `ServiceCategory` | 业务分类(一级) | name, order |
| `Service` | 业务栏目 | category(FK), title, summary, description, icon, order, is_active |
| `Showcase` | 案例展示 | title, description, image, tags, featured, order |
| `Inquiry` | 反馈留言(前台表单写入) | name, contact, subject, content, source, status(默认 unread), created_at |

## API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/site-info/` | 站点信息 |
| GET | `/api/services/` | 业务分类(含其下业务栏目) |
| GET | `/api/showcases/` | 案例列表(`?featured=true` 只取精选) |
| POST | `/api/inquiries/` | 提交「反馈与联系」表单 → 写入数据库 + 邮件提醒(含蜜罐 + 限流防刷) |

后台:`/admin/`(Simple UI 中文,一级菜单「网站内容 / 咨询管理 / 系统管理」,二级为各数据表)。

## 反馈表单与邮件通知

- 前台「反馈与联系」页(`/contact`)提交 → `POST /api/inquiries/` 写库,`status` 默认 `unread`。
- 仅「内容(content)」必填;称呼 / 联系方式 / 主题均可留空。
- 防刷:隐藏蜜罐字段 `website`(被填则判为机器人退回)+ DRF 限流(同 IP `10/hour`)。
- 入库后给站长邮箱发提醒。**邮件相关环境变量**(不配则用 console 后端,邮件打印到 runserver 控制台,提交仍成功):

  | 变量 | 说明 |
  |---|---|
  | `EMAIL_BACKEND` | 默认 `...console.EmailBackend`;真实发信用 `django.core.mail.backends.smtp.EmailBackend` |
  | `EMAIL_HOST` / `EMAIL_PORT` | SMTP 主机 / 端口(如 Gmail `smtp.gmail.com` / `587`) |
  | `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` | SMTP 账号 / 授权码(Gmail 需用应用专用密码) |
  | `EMAIL_USE_TLS` / `EMAIL_USE_SSL` | 加密方式(587 用 TLS=true;465 用 SSL=true) |
  | `DEFAULT_FROM_EMAIL` | 发件人,默认取 `EMAIL_HOST_USER` |
  | `FEEDBACK_NOTIFY_TO` | 收提醒的邮箱,默认 `ylinylin1010@gmail.com` |

## 如何运行

### 后端(Django,端口 8000)

```bash
cd backend
.venv\Scripts\activate            # Windows;macOS/Linux: source .venv/bin/activate
# 首次:python manage.py migrate && python manage.py seed
python manage.py runserver 127.0.0.1:8000
```

- 种子数据:`python manage.py seed`(写入站点信息、3 分类 / 9 业务、6 案例,并创建超管)
- 后台超管:**admin / admin12345**

### 前端(Vue,端口 5173)

```bash
cd frontend
npm install
npm run dev          # 开发:http://localhost:5173 ,/api 自动代理到 :8000
# 或 npm run build   # 产出 dist/
```

打开 http://localhost:5173 即可访问官网;导航 / 首页「开始创作」跳转 `/editor/index.html` 全屏编辑器。

## 运行验证记录(已通过)

- ✅ 后端启动 `runserver` + 前端 `vite dev` / `vite build`(84 模块,无错误)
- ✅ 接口:`site-info` / `services`(3 分类 9 业务)/ `showcases`(6 条)均正常
- ✅ 联调:前端经 vite proxy `POST /api/inquiries/` 成功
- ✅ 真实入库:`Inquiry.objects.count() == 2`(后端直测 + 前端 proxy 各一条)
- ✅ 后台 `/admin/` 可达(302 → 登录),Simple UI 中文菜单

## 说明

- 开发期 `CORS_ALLOW_ALL_ORIGINS=True`、`DEBUG=True`,上线前需收紧(指定域名、关 DEBUG、换 SECRET_KEY)。
- 咨询表单由前台写入,后台对其设为只读 + 不可新增,仅可改处理状态。
