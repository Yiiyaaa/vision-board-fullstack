# 愿景板工作室 · 全栈项目

围绕「愿景板」业务的全栈网站:**Vue 官网前台 + Django 后端 + SQLite + Simple UI 中文后台**,导航/首页「开始创作」直达全屏静态愿景板编辑器。

> 详细架构、数据模型、API、运行验证记录见 [agent.md](./agent.md)。

## 技术栈

- **前端**:Vue 3 + Vite 5 + Vue Router + axios
- **后端**:Django 5.1 + Django REST Framework
- **数据库**:SQLite
- **后台**:django-simpleui(中文,一级/二级菜单)
- **编辑器**:内嵌静态愿景板(Fabric.js,纯前端、本地草稿自动保存)

## 功能

- 官网:首页 / 功能(业务栏目)/ 案例展示 / 反馈与联系,PC·移动端自适应
- 接口:Vue 表单 → Django API,真实写入 SQLite(反馈表单含蜜罐 + 限流防刷 + 邮件提醒)
- 后台:Simple UI 中文管理,业务/案例/反馈的查询、筛选、详情
- 编辑器:照片拼贴(压边/平铺/留白)、文字与配色、导出高清 PNG

## 快速开始

```bash
# 1) 后端(端口 8000)
cd backend
python -m venv .venv && .venv\Scripts\activate     # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt                      # 或见 agent.md 的依赖列表
python manage.py migrate
python manage.py seed                                # 写入示例数据 + 创建超管 admin / admin12345
python manage.py runserver 127.0.0.1:8000

# 2) 前端(端口 5173,/api 自动代理到 8000)
cd frontend
npm install
npm run dev
```

- 官网:http://localhost:5173
- 后台:http://localhost:8000/admin/ (`admin` / `admin12345`)

## 在线体验(仅愿景板编辑器,纯静态)

https://yiiyaaa.github.io/make-it-visible/

> 注:完整全栈官网需要本地或服务器运行 Django;在线链接仅为其中的静态编辑器部分。
