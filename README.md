# 随笔笔记 Markdown Notebook

给随笔写作者使用的 Markdown 笔记工具，支持实时预览、标签搜索、主题切换和本地自动保存。

## Docker Compose 快速启动

```bash
cp .env.example .env
docker compose up -d --build
```

访问地址：

- 前端：http://localhost:8275
- 后端健康检查：http://localhost:3275/api/health
- MySQL：localhost:5775

## 主要功能

- 左右分栏 Markdown 编辑和实时预览
- 工具栏快捷插入加粗、斜体、链接、图片和代码块
- 笔记列表、标签分类和全文搜索
- 海韵、林间、暮色、星夜多主题，并支持明暗模式
- 600ms 防抖自动保存到浏览器 localStorage
- 导出纯文本或带样式的 HTML 文件

## 本地开发

前端：

```bash
cd frontend
npm install
npm run dev
```

后端：

```bash
cd backend
npm install
npm run dev
```

本地前端默认访问 `http://localhost:8410`，生产部署通过 Docker 映射到 `8275`。

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 前端 | Vue 3、Vite、marked、Vitest |
| 后端 | Node.js HTTP 服务 |
| 数据库 | MySQL 8.0 |
| 部署 | Docker、Docker Compose、Nginx |

## 项目结构

```text
.
├── frontend/              # Vue 前端
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── backend/               # API 健康检查服务
│   ├── Dockerfile
│   └── server.js
├── database/              # 数据库初始化脚本
├── docker-compose.yml
├── .env
├── .env.example
└── README.md
```

## 环境变量

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| COMPOSE_PROJECT_NAME | Compose 项目名 | gb-175 |
| FRONTEND_PORT | 前端映射端口 | 8275 |
| BACKEND_PORT | 后端映射端口 | 3275 |
| DB_PORT | MySQL 映射端口 | 5775 |
| DB_NAME | MySQL 数据库名 | gb175 |
| DB_USER | MySQL 用户 | gb175 |
| DB_PASSWORD | MySQL 密码 | gb175_password |
| DB_ROOT_PASSWORD | MySQL root 密码 | gb175_root_password |
| JWT_SECRET | 预留服务密钥 | change_me_gb175_markdown_notebook_secret |

## Docker 部署说明

- `frontend` 使用多阶段构建，生产环境由 Nginx 托管静态文件。
- 前端预留 `/api` 路径，Nginx 反向代理到 `backend:3275`。
- `backend` 提供 `/api/health`，用于 Compose 健康检查和数据库连通性检查。
- `db` 使用命名卷 `db_data` 持久化，避免依赖宿主机路径。
- 前端业务数据仍保存在浏览器 localStorage，清除浏览器数据会导致笔记丢失，建议定期导出备份。

常用命令：

```bash
docker compose config --quiet
docker compose build
docker compose down
```

## License

MIT
