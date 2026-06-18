# ===========================
# 多阶段构建：前后端分离架构（node 镜像）
# - server: ThinkJS API (8360)
# - front : Nuxt SSR (3000)
# - admin : SPA 静态产物，构建后放入 server/www/cms，由 Nginx 经共享卷服务
# ===========================

# -------------------- 阶段 1：依赖安装和构建 --------------------
FROM node:18-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /build

# 复制 workspace 配置和根 package.json
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/front/package.json ./apps/front/
COPY apps/admin/package.json ./apps/admin/

# 安装所有依赖（包含 devDependencies，因为需要构建）
RUN pnpm install --frozen-lockfile

# 复制源码
COPY apps/server ./apps/server
COPY apps/front ./apps/front
COPY apps/admin ./apps/admin

# 构建前端（SSR）、后端、admin（SSG）
RUN pnpm build:front
RUN pnpm build:admin

# -------------------- 阶段 2：生产镜像（仅运行时） --------------------
FROM node:18-alpine

# 安装 PM2
RUN npm install pm2 -g

WORKDIR /app

# 从 builder 复制生产依赖（重新安装仅 prod 依赖）
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/front/package.json ./apps/front/

RUN corepack enable && corepack prepare pnpm@latest --activate \
    && pnpm install --prod --frozen-lockfile \
    && pnpm store prune

# 复制后端运行所需文件
COPY apps/server/src ./apps/server/src
COPY apps/server/view ./apps/server/view
COPY apps/server/config ./apps/server/config
COPY apps/server/production.js ./apps/server/production.js
# upload 与 static 资源（生产环境由 Nginx 直接服务，此处一并打入便于挂载/兜底）
COPY apps/server/www ./apps/server/www

# admin SPA 产物统一放入 server/www/cms（构建时 app.baseURL = /cms/）
COPY --from=builder /build/apps/admin/.output/public ./apps/server/www/cms

# 复制前端 SSR 构建产物
COPY --from=builder /build/apps/front/.output ./apps/front/.output

# 复制 PM2 进程配置
COPY deploy/pm2.json ./pm2.json

ENV NODE_ENV=production
ENV DOCKER=true

# 8360: ThinkJS API  3000: Nuxt SSR 前端
EXPOSE 8360 3000

CMD ["pm2-runtime", "start", "pm2.json"]
