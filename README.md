# Make It Visible · 愿景板工作室

一个无需注册、图片不上传的在线愿景板与高清壁纸制作工具。

## 首发架构

- `frontend/`：Vue 3 产品官网，内容完全静态，可独立部署
- `frontend/public/editor/`：Fabric.js 愿景板编辑器
- `backend/`：保留的 Django 可选后端，首发网站不依赖它

照片由浏览器本地读取，草稿保存在 IndexedDB，PNG / JPG / WebP 导出也在本机完成。

## 本地运行

```bash
cd frontend
npm ci
npm run dev
```

访问 `http://localhost:5173`。生产构建：

```bash
npm run build
npm run preview
```

## 部署

### Cloudflare Pages

连接本 GitHub 仓库并设置：

- Root directory：`frontend`
- Build command：`npm ci && npm run build`
- Build output directory：`dist`
- Production branch：`main`

项目不需要环境变量、数据库或服务器。

### 其他静态托管

任何能托管 `frontend/dist/` 的平台都可以运行，包括 GitHub Pages、Netlify、对象存储静态网站和自有 Nginx。

## 发布前检查

```bash
cd frontend
npm run build
node --check public/editor/script.js
node --check public/editor/vision-mark.js
```

还应在 Chrome、Edge、Safari 和手机浏览器完成一次：上传照片 → 自动拼贴 → 编辑文字 → 刷新恢复 → 三种格式导出。

## 隐私

首发版没有账号、云端同步或作品托管。详见官网的“隐私说明”页面。

## 可选 Django 后端

`backend/` 仅供未来需要内容后台或服务器反馈表单时使用。它仍是开发配置，不应直接部署到生产环境；详细结构见 [agent.md](./agent.md)。
