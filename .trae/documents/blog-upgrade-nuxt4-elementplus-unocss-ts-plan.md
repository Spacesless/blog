# Blog 项目升级重构方案

> 升级目标：`Nuxt2 + element-ui + ThinkJS(JS)` → `Nuxt4 + element-plus + UnoCSS + ThinkJS + TypeScript`

---

## 1. Summary（摘要）

将原本位于仓库根目录的 Nuxt2 单体工程（`client/admin`、`client/front`、`client/common`、`src/`、`config/`、`nuxt.config.js`）彻底迁移到 `apps/` 工作区，并：

- **apps/front**：在已有 Nuxt4 框架基础上补齐残余页面/组件、清理废弃逻辑、收尾产线接入；
- **apps/admin**（新建）：Nuxt2 + element-ui 的后台从零迁移到 Nuxt4 + Element Plus + UnoCSS + TypeScript + Pinia；
- **apps/server**：ThinkJS 后端从 JavaScript 全量迁移到 TypeScript，保留 ThinkJS 3.x 架构（controller / logic / model / service / config / extend）；
- 删除根目录下已被替代的 `client/`、`src/`、`view/`、`config/`、`nuxt.config.js`、`jest.config.js`、`jsconfig.json` 等遗留物，统一以 pnpm workspace 组织。
- 工具页（`pages/tool/**`）**不在本次迁移范围**（按用户确认）。

---

## 2. Current State Analysis（现状分析）

### 2.1 工作区结构

实际存在两套并存代码：

| 路径 | 状态 | 说明 |
| --- | --- | --- |
| [client/admin](file:///e:/nodejs/blog/client/admin) | 旧（Nuxt2 + element-ui + JS） | 后台原始代码 |
| [client/front](file:///e:/nodejs/blog/client/front) | 旧（Nuxt2 + element-ui + JS） | 前台原始代码 |
| [client/common](file:///e:/nodejs/blog/client/common) | 旧（公共 Comment / Pagination / utils） | 旧前后台共享 |
| [src/](file:///e:/nodejs/blog/src) | 旧（ThinkJS JS） | 旧后端 |
| [config/](file:///e:/nodejs/blog/config) | 旧 nuxt 配置 | `nuxt.admin.js`、`nuxt.front.js` |
| [nuxt.config.js](file:///e:/nodejs/blog/nuxt.config.js) | 旧 | 入口分发 |
| [apps/front](file:///e:/nodejs/blog/apps/front) | **新（Nuxt4 + element-plus + UnoCSS + TS）** | 已搭好骨架，pages 部分完成 |
| [apps/admin](file:///e:/nodejs/blog/apps/admin) | **空 / 仅旧物拷贝（Nuxt2）** | 需新建 Nuxt4 工程 |
| [apps/server](file:///e:/nodejs/blog/apps/server) | **新位置但仍是 JS** | ThinkJS 3 源码已经在 `apps/server/src` |
| [package.json](file:///e:/nodejs/blog/package.json) | 旧 Nuxt2 依赖 | 待替换 |

### 2.2 apps/front 现状（基线已具备）

- [package.json](file:///e:/nodejs/blog/apps/front/package.json)：`nuxt ^4.4.8`、`@element-plus/nuxt`、`@unocss/nuxt`、`@pinia/nuxt`、`@nuxt/icon`、`@nuxtjs/color-mode`，`typescript ^6.0.3`。
- [nuxt.config.ts](file:///e:/nodejs/blog/apps/front/nuxt.config.ts)：已启用 `future.compatibilityVersion: 4`、UnoCSS、Element Plus、Pinia 模块；`runtimeConfig.public.apiBase` 默认指向 `127.0.0.1:8360/front`。
- [uno.config.ts](file:///e:/nodejs/blog/apps/front/uno.config.ts)：完整设计令牌、安全列表、shortcuts。
- [app/app.vue](file:///e:/nodejs/blog/apps/front/app/app.vue)、[app/layouts/default.vue](file:///e:/nodejs/blog/apps/front/app/layouts/default.vue)：已完成布局壳、初始化数据请求、device watch。
- [app/composables/useApi.ts](file:///e:/nodejs/blog/apps/front/app/composables/useApi.ts)：封装了 `general / index / article / bangumi / archives / link / category / search`。
- 页面已实现：[pages/index.vue](file:///e:/nodejs/blog/apps/front/app/pages/index.vue)、[pages/about.vue](file:///e:/nodejs/blog/apps/front/app/pages/about.vue)、[pages/link.vue](file:///e:/nodejs/blog/apps/front/app/pages/link.vue)、[pages/archives/\[\[id\]\].vue](file:///e:/nodejs/blog/apps/front/app/pages/archives/[[id]].vue)、[pages/article/\[\[id\]\].vue](file:///e:/nodejs/blog/apps/front/app/pages/article/[[id]].vue)、[pages/article/detail/\[id\].vue](file:///e:/nodejs/blog/apps/front/app/pages/article/detail/[id].vue)、[pages/bangumi/\[\[id\]\].vue](file:///e:/nodejs/blog/apps/front/app/pages/bangumi/[[id]].vue)、[pages/bangumi/detail/\[id\].vue](file:///e:/nodejs/blog/apps/front/app/pages/bangumi/detail/[id].vue)。
- **缺口**：
  - 旧 `client/front/pages/tool/**`（music / bilibili / ai / live2d / spine / track / bad-apple / wallpaper / `_id.vue`）尚未迁移 — 本次按用户决定 **跳过**，但需在路由层做兜底 404。
  - 旧公共组件 `client/common/components/Comment`、`Pagination` 尚未在新工程引入；评论、分页能力还未在新版前台中体现。
  - 旧样式 `client/front/styles/components/prism.scss`、`bangumi.scss` 等代码高亮、专项样式未移植。
  - 旧 `plugins/baidu-analytics.js`、`plugins/filters.js` 等未迁移。
  - 没有 `error.vue`、`robots.txt` 之外的 SEO 资源（`sitemap.xml`、`rss.xml` 当前由 ThinkJS 端 `controller/front/xml.js` 提供，保持不变）。

### 2.3 apps/admin 现状

- 路径 [apps/admin](file:///e:/nodejs/blog/apps/admin) 存在 Nuxt2 风格内容（`api/`、`store/`、`layouts/`、`plugins/element-ui.js`、`router.js`、`views/`、`static/vendor/tinymce/`），等价于旧 [client/admin](file:///e:/nodejs/blog/client/admin)。
- 无 `package.json` / `nuxt.config.*` / `tsconfig.json`，属于"原样搬迁但未升级"。
- 关键功能模块（基于 [views/](file:///e:/nodejs/blog/apps/admin/views)）：登录、首页 Dashboard（待办、最新评论）、文章/追番 CMS、分类管理、回收站、评论管理、友链管理、Banner 配置、阅读配置、通用配置、成员管理。
- 富文本编辑器使用 TinyMCE 5（[components/Tinymce](file:///e:/nodejs/blog/apps/admin/components/Tinymce)）。

### 2.4 apps/server 现状（ThinkJS）

- 入口 [development.js](file:///e:/nodejs/blog/apps/server/development.js)、[production.js](file:///e:/nodejs/blog/apps/server/production.js)，基于 `new Application({ ROOT_PATH, APP_PATH:'src' })`。
- 业务目录：`src/{bootstrap,config,controller,extend,logic,model,service}`。
- 配置：`config/adapter.js`（cache/logger/model/session/view）、`config/middleware.js`（含 `nuxt.js` 中间件，旧时代用于把 Nuxt2 渲染挂载到 ThinkJS）。
- 业务依赖：`think-model-mysql`、`think-session-file`、`think-view-nunjucks`、`think-cache-file`、`sharp`、`nodemailer`、`svg-captcha`、`xss`、`prismjs`、`md5`、`phpass`、`qrcode`。
- 无任何 TS 设施（`tsconfig.json`、ts-node、ThinkJS TS 装饰、类型）。

### 2.5 根目录

- 仍保留 [package.json](file:///e:/nodejs/blog/package.json)（Nuxt2 单体依赖、混合 admin/front 脚本、旧 ESLint/Stylelint 配置）。
- 缺顶层 pnpm workspace 配置（apps/front 内有 [pnpm-workspace.yaml](file:///e:/nodejs/blog/apps/front/pnpm-workspace.yaml)，位置错误，应在根）。

---

## 3. Proposed Changes（具体改动）

### 3.1 顶层工程化（仓库根）

#### 3.1.1 新建 / 更新文件

- **新建** [pnpm-workspace.yaml](file:///e:/nodejs/blog/pnpm-workspace.yaml)：声明 `packages: [apps/*]`。
- **重写** [package.json](file:///e:/nodejs/blog/package.json)：清空旧依赖，仅保留：
  - `name`、`version`、`private: true`、`engines.node: ">=18.18"`
  - `scripts`：
    - `dev:front` → `pnpm -F www dev`
    - `dev:admin` → `pnpm -F admin dev`
    - `dev:server` → `pnpm -F server dev`
    - `build` → `pnpm -r --parallel build`
    - `lint` → `pnpm -r --parallel lint`
- **新建** [.editorconfig](file:///e:/nodejs/blog/.editorconfig)（如内容陈旧则覆盖原文件）。
- **新建** [tsconfig.base.json](file:///e:/nodejs/blog/tsconfig.base.json)：共享 `strict`、`target: ES2022`、`moduleResolution: bundler`、`paths` 基线。
- **移动** [apps/front/pnpm-workspace.yaml](file:///e:/nodejs/blog/apps/front/pnpm-workspace.yaml) → 仓库根（删除原位置）。

#### 3.1.2 删除（旧代码清理）

- [client/](file:///e:/nodejs/blog/client) 整目录（已在 apps/admin、apps/front、apps/server 中各自取代）
- [src/](file:///e:/nodejs/blog/src) 整目录（被 [apps/server/src](file:///e:/nodejs/blog/apps/server/src) 替代）
- [config/](file:///e:/nodejs/blog/config)
- [view/](file:///e:/nodejs/blog/view)
- [nuxt.config.js](file:///e:/nodejs/blog/nuxt.config.js)
- [jest.config.js](file:///e:/nodejs/blog/jest.config.js)、[jsconfig.json](file:///e:/nodejs/blog/jsconfig.json)
- [.eslintignore](file:///e:/nodejs/blog/.eslintignore)、[.eslintrc.js](file:///e:/nodejs/blog/.eslintrc.js)、[.stylelintignore](file:///e:/nodejs/blog/.stylelintignore)、[.stylelintrc.js](file:///e:/nodejs/blog/.stylelintrc.js)、[.nu​​xtignore](file:///e:/nodejs/blog/.nu​​xtignore)
- 保留 [deploy/](file:///e:/nodejs/blog/deploy)、[.gitignore](file:///e:/nodejs/blog/.gitignore)、[.npmrc](file:///e:/nodejs/blog/.npmrc)、[README.md](file:///e:/nodejs/blog/README.md)

> 删除前先 `git status` 确认无未提交修改；后端静态资源 `apps/server/www/upload/**` 完全保留，不动。

### 3.2 apps/front 收尾

> 已 Nuxt4 + Element Plus + UnoCSS + Pinia + TS，无需大改框架。

#### 3.2.1 评论 & 分页组件迁移

- **新建** [apps/front/app/components/Comment/index.vue](file:///e:/nodejs/blog/apps/front/app/components/Comment/index.vue)、`CommentItem.vue`、`CommentReply.vue`、`Emojis.vue` —— 从 [client/common/components/Comment/](file:///e:/nodejs/blog/client/common/components/Comment) 移植，替换 `axios → useApi()`、`element-ui → element-plus`、`Vue.options.filters → 本地 utils`、Options API → `<script setup lang="ts">`。
- **新建** [apps/front/app/components/Pagination.vue](file:///e:/nodejs/blog/apps/front/app/components/Pagination.vue) —— 基于 `el-pagination` 重新实现 v3 API。
- 在 [pages/article/detail/\[id\].vue](file:///e:/nodejs/blog/apps/front/app/pages/article/detail/[id].vue) 与 [pages/bangumi/detail/\[id\].vue](file:///e:/nodejs/blog/apps/front/app/pages/bangumi/detail/[id].vue) 中接入 `<Comment :type="..." :id="..." />`。
- 在 [useApi.ts](file:///e:/nodejs/blog/apps/front/app/composables/useApi.ts) 增加 `fetchComments / postComment / replyComment / fetchEmoji` 等方法，对应 ThinkJS `/front/comment/*` 路由。

#### 3.2.2 代码高亮 & 内容样式

- **新建** [apps/front/app/assets/css/prism.css](file:///e:/nodejs/blog/apps/front/app/assets/css/prism.css)（从 [client/front/styles/components/prism.scss](file:///e:/nodejs/blog/client/front/styles/components/prism.scss) 转 CSS / 简化）。
- 在 [nuxt.config.ts](file:///e:/nodejs/blog/apps/front/nuxt.config.ts) `css` 数组追加 `'~/assets/css/prism.css'`。
- **新建** [apps/front/app/plugins/prism.client.ts](file:///e:/nodejs/blog/apps/front/app/plugins/prism.client.ts)：客户端动态导入 `prismjs/prism-*`，并暴露 `nuxtApp.$prism.highlightAll()`，在 article detail 的 `onMounted` 中调用。

#### 3.2.3 错误页与 SEO

- **新建** [apps/front/app/error.vue](file:///e:/nodejs/blog/apps/front/app/error.vue)：使用统一布局展示 404 / 500。
- **新建** [apps/front/app/composables/usePageSeo.ts](file:///e:/nodejs/blog/apps/front/app/composables/usePageSeo.ts)（如尚未存在）：基于 `useSeoMeta`，按 `pageType` 输出 `title / description / og*`。

#### 3.2.4 工具页占位

- 旧 [client/front/pages/tool/](file:///e:/nodejs/blog/client/front/pages/tool) 路由命中（如 `/tool/music`）时返回 410/404：**新建** [apps/front/app/pages/tool/\[...slug\].vue](file:///e:/nodejs/blog/apps/front/app/pages/tool/[...slug].vue)，用 `createError({ statusCode: 404, statusMessage: '该工具页暂不可用' })` 抛出。

#### 3.2.5 依赖补齐

- `apps/front/package.json` 追加：`prismjs`、`@types/prismjs`、`dayjs`、`xss`（评论清洗）。

### 3.3 apps/admin 全量重构（Nuxt2 → Nuxt4 + Element Plus + UnoCSS + TS）

> 现有 [apps/admin](file:///e:/nodejs/blog/apps/admin) 内容全部视为"参考资料"而非可保留代码；保留资源类文件（`assets/`、`static/vendor/tinymce/`、`assets/icons/svg`）。

#### 3.3.1 新建工程骨架

- **新建** [apps/admin/package.json](file:///e:/nodejs/blog/apps/admin/package.json)：
  - 依赖：`nuxt ^4`、`vue ^3.5`、`@element-plus/nuxt`、`element-plus`、`@unocss/nuxt`、`unocss`、`@pinia/nuxt`、`pinia`、`@vueuse/nuxt`、`@vueuse/core`、`@nuxt/icon`、`axios`、`js-cookie`、`@types/js-cookie`、`nprogress`、`@types/nprogress`、`echarts`、`vue-echarts`、`@wangeditor/editor` 或继续用 `@tinymce/tinymce-vue`、`file-saver`、`@types/file-saver`。
  - devDeps：`typescript ^5`、`@nuxt/eslint`、`eslint`、`sass`、`vue-tsc`。
  - scripts：`dev / build / generate / preview / lint / typecheck (vue-tsc --noEmit)`。
- **新建** [apps/admin/nuxt.config.ts](file:///e:/nodejs/blog/apps/admin/nuxt.config.ts)：
  - `future.compatibilityVersion: 4`、`ssr: false`（后台是 SPA / generate）、`devtools.enabled: true`
  - `modules: ['@element-plus/nuxt','@unocss/nuxt','@pinia/nuxt','@vueuse/nuxt','@nuxt/icon']`
  - `css: ['@unocss/reset/tailwind.css','~/assets/styles/index.scss']`
  - `runtimeConfig.public.apiBase = process.env.NUXT_PUBLIC_API_BASE || '/admin'`
  - `app.head.title = 'Timeless · Admin'`
  - `vite.css.preprocessorOptions.scss.additionalData = '@use "~/assets/styles/variables.scss" as *;'`
- **新建** [apps/admin/tsconfig.json](file:///e:/nodejs/blog/apps/admin/tsconfig.json) `extends: ./.nuxt/tsconfig.json`。
- **新建** [apps/admin/uno.config.ts](file:///e:/nodejs/blog/apps/admin/uno.config.ts)：`presetUno + presetAttributify + presetIcons`，无需 typography/webfonts。
- **新建** [apps/admin/eslint.config.mjs](file:///e:/nodejs/blog/apps/admin/eslint.config.mjs)（沿用 front 风格）。
- **新建** [apps/admin/.env.example](file:///e:/nodejs/blog/apps/admin/.env.example)：`NUXT_PUBLIC_API_BASE=http://127.0.0.1:8360/admin`。

#### 3.3.2 目录布局（Nuxt4 `app/` 根）

```
apps/admin/
  app/
    app.vue                 # <NuxtLayout><NuxtPage/></NuxtLayout>
    error.vue
    layouts/
      default.vue           # 替代旧 layouts/default.vue
      blank.vue             # 登录页用
    pages/
      login.vue
      index.vue                          # Dashboard
      content/
        index.vue                        # 文章列表
        create.vue
        edit-[id].vue
        bangumi.vue
        recycle.vue
      category/
        index.vue
        create.vue
        edit-[id].vue
      community/
        comment/index.vue
        comment/content-[id].vue
        link/index.vue
      system/
        general.vue
        reading.vue
        banner.vue
      member/index.vue
    components/
      Layout/
        Sidebar.vue
        SidebarItem.vue
        Navbar.vue
        TagsView.vue
        AppMain.vue
        Hamburger.vue
        Breadcrumb.vue
      Editor/
        Tinymce.vue          # 重写为 <script setup lang="ts">
      Upload/
        index.vue
        PictureAlbum.vue
        PictureLinks.vue
      SvgIcon.vue            # 改用 @nuxt/icon 之外的本地 svg sprite
      JsonEditor.vue
    composables/
      useApi.ts              # 替代 api/modules/*
      useAuth.ts             # token + 路由守卫
      usePermission.ts
      useResize.ts
    middleware/
      auth.global.ts         # 替代旧 middleware/permission.js
    stores/
      user.ts
      app.ts                 # sidebar、device
      tagsView.ts
      list.ts
      config.ts
    utils/
      request.ts             # axios 封装（含 token、err 拦截、跳转 login）
      auth.ts
      validate.ts
      get-page-title.ts
    assets/
      styles/{index,variables,mixin,sidebar,transition,element-plus}.scss
      icons/svg/*.svg        # 从旧 assets/icons/svg 复制
      home/*.png
      fonts/Bega-Light.ttf
      error/*.svg
      login-background.jpg
      logo.jpg
      example.jpg
  public/
    vendor/tinymce/...        # 从旧 static/vendor/tinymce 整体复制
    favicon.ico
```

#### 3.3.3 关键模块迁移规则

| 旧实现 | 新实现 |
| --- | --- |
| `plugins/axios.js` + `plugins/api.js` | [utils/request.ts](file:///e:/nodejs/blog/apps/admin/app/utils/request.ts) + [composables/useApi.ts](file:///e:/nodejs/blog/apps/admin/app/composables/useApi.ts)（按模块切分：`useAuthApi / useContentApi / useConfigApi / useListApi / useHomeApi`） |
| `plugins/element-ui.js` 全量引入 | `@element-plus/nuxt` 自动按需 + 在 `nuxt.config.ts` 中开启图标自动注册 |
| `plugins/svg-icon.js` + `svg-sprite-loader` | 改用 `vite-plugin-svg-icons` 或 `@unocss/preset-icons + collections.custom`，统一通过 `<Icon name="local:bangumi" />` 调用 |
| Vuex `store/{user,config,tagsView,list,config}.js` | Pinia `stores/*.ts`，state/getters/actions 强类型 |
| Options API + mixins | `<script setup lang="ts">` + composables；`mixins/ResizeHandler.js` → `useResize` |
| `middleware/permission.js`（依赖 `js-cookie` + `nuxt-link.beforeRouteEnter`） | `middleware/auth.global.ts`：未登录跳 `/login`，已登录访问 `/login` 跳 `/` |
| `router.js`（自定义动态路由模块） | 利用 Nuxt 文件路由 + `definePageMeta({ layout, requiresAuth, title })` |
| `components/Tinymce` | 保留 TinyMCE 5（`public/vendor/tinymce`），用 `defineNuxtPlugin` 在 client 动态 `import('tinymce')`，组件改 `<script setup lang="ts" + defineProps + defineEmits>` |
| `views/login/index.vue` | `pages/login.vue`，使用 `el-form` Composition API + `useAuth().login()` |

#### 3.3.4 类型化

- **新建** [apps/admin/app/types/index.ts](file:///e:/nodejs/blog/apps/admin/app/types/index.ts)：`Article / Bangumi / Category / Comment / FriendLink / Banner / Config / User / PaginatedResponse<T> / ApiResponse<T>`，与 [apps/front/app/types/index.ts](file:///e:/nodejs/blog/apps/front/app/types/index.ts) 保持字段一致（可考虑后续抽取共享包，但本次先在两侧各自维护）。

### 3.4 apps/server 迁移到 TypeScript（保留 ThinkJS 3）

> ThinkJS 3 支持 TypeScript（官方 `ts` 模板）。迁移策略：**保留运行时为 ThinkJS 3 + 自动加载约定**，把所有 JS 模块改为 TS，并增加 `tsc --watch` + ts-node 启动。

#### 3.4.1 新增构建/类型基础设施

- **新建** [apps/server/package.json](file:///e:/nodejs/blog/apps/server/package.json)（如不存在）/ 更新：
  - 依赖：`thinkjs ^3.2`、`think-model`、`think-model-mysql`、`think-cache`、`think-cache-file`、`think-session`、`think-session-file`、`think-view`、`think-view-nunjucks`、`think-logger3`、`sharp ^0.33`、`nodemailer`、`svg-captcha`、`xss`、`prismjs`、`md5`、`phpass`、`qrcode`、`fs-extra`。
  - devDeps：`typescript ^5`、`@types/node`、`@types/nodemailer`、`@types/md5`、`@types/fs-extra`、`think-typescript`（或 `ts-node`、`tsconfig-paths`）、`think-watcher`、`eslint`、`@typescript-eslint/*`。
  - scripts：
    - `dev` → `ts-node --project tsconfig.json development.ts`（或 `node --loader ts-node/esm`，按 CJS/ESM 选 CJS）
    - `build` → `tsc -p tsconfig.json`（输出 `dist/`）
    - `start` → `node production.js`（生产用编译后的 `dist/`）
    - `lint` → `eslint src --ext .ts`
    - `typecheck` → `tsc --noEmit`
- **新建** [apps/server/tsconfig.json](file:///e:/nodejs/blog/apps/server/tsconfig.json)：
  - `target: ES2022`、`module: CommonJS`、`moduleResolution: Node`、`strict: true`、`esModuleInterop: true`、`outDir: dist`、`rootDir: src`、`baseUrl: ./`、`paths.{think,@/*}`。
- **新建** [apps/server/src/types/think.d.ts](file:///e:/nodejs/blog/apps/server/src/types/think.d.ts)：扩展 `declare global { const think: any; namespace ThinkJS { ... } }`、补 controller/logic/model 上下文类型（最小可用集合）。
- 重写入口：
  - [development.js](file:///e:/nodejs/blog/apps/server/development.js) → [development.ts](file:///e:/nodejs/blog/apps/server/development.ts)
  - [production.js](file:///e:/nodejs/blog/apps/server/production.js) → [production.ts](file:///e:/nodejs/blog/apps/server/production.ts)（编译后保留同名 `.js` 也可）

#### 3.4.2 源码全量 `.js → .ts`

按目录批处理，**逐文件**改造：
- `src/bootstrap/master.ts`、`worker.ts`
- `src/config/{config,adapter,middleware,extend,router,config.production}.ts`
- `src/config/adapter/{cache,logger,model,session,view}.ts`
- `src/config/middleware/nuxt.ts` → **删除**（已不再需要把 Nuxt 接入 ThinkJS；admin/front 改用独立部署 + Nginx）。同时从 `src/config/middleware.ts` 中移除 `nuxt` 中间件挂载，并将 controller `view` 相关 deprecated 模板逻辑删减。
- `src/extend/controller.ts`：保留 `getConfigs / getAbsolutePath / success / fail` 等扩展，添加显式返回类型。
- `src/controller/**/*.ts`、`src/logic/**/*.ts`、`src/model/**/*.ts`、`src/service/**/*.ts`：
  - 把 `module.exports = class extends Base { ... }` 改为 `export default class extends Base { ... }`（ThinkJS 加载器同时支持 CJS/ESM 默认导出）。
  - 用 `import Base from './base'` 替代 `require`。
  - 给方法参数（query/body）显式 `any` 或最小化类型（不强求严格类型，先编译通过）。
- 删除旧 [.eslintrc.js](file:///e:/nodejs/blog/apps/server/src/.eslintrc.js)，新建 [apps/server/.eslintrc.cjs](file:///e:/nodejs/blog/apps/server/.eslintrc.cjs)（基于 `@typescript-eslint`）。

#### 3.4.3 运行约束

- ThinkJS 自动加载默认查找 `src/`，需保证 `dev` 模式下 ts 即时编译；用 [think-typescript](https://github.com/thinkjs/think-typescript) 或 ts-node + tsconfig-paths。若 `think-typescript` 版本与 ThinkJS 3.2 不兼容，则改为：`dev` 用 `tsc -w` 输出到 `dist/`，再 `node dist/development.js`，APP_PATH 指向 `dist/src`。
- `production.ts` 编译后：`new Application({ ROOT_PATH: __dirname, APP_PATH: path.join(__dirname,'src') })`。

### 3.5 前后端联调

- 后端不再托管 Nuxt 模板（移除 `view/home/*.html`、`config/middleware/nuxt.js`、`controller/cms/index.js` 若仅作 SSR 入口）。
- 前台/后台独立进程：
  - `apps/front`：`pnpm dev`（3000）
  - `apps/admin`：`pnpm dev`（如 3001，[apps/admin/nuxt.config.ts](file:///e:/nodejs/blog/apps/admin/nuxt.config.ts) `devServer.port = 3001`）
  - `apps/server`：`pnpm dev`（8360）
- Nginx（`deploy/nginx.conf`）后续按 `/admin/* -> 3001、/front/* -> 3000、/api -> 8360` 调整（**不在本次代码改动**，仅在 README 加备注，避免线上中断）。

---

## 4. Assumptions & Decisions（假设与决策）

1. **包管理**：使用 pnpm + workspace（已存在 [apps/front/pnpm-lock.yaml](file:///e:/nodejs/blog/apps/front/pnpm-lock.yaml)、根 [.npmrc](file:///e:/nodejs/blog/.npmrc)）。
2. **Nuxt 版本**：`nuxt ^4.4.x`（与 `apps/front` 当前一致），启用 `future.compatibilityVersion: 4` 与 `app/` 根。
3. **状态管理**：Pinia（admin、front 都使用），不引入 Vuex 兼容层。
4. **HTTP 客户端**：admin 沿用 axios（保留 token 拦截/上传），front 沿用 `$fetch`。
5. **图标**：admin 用本地 SVG sprite（旧 `assets/icons/svg`）+ `vite-plugin-svg-icons`；front 维持 `@nuxt/icon`。
6. **TinyMCE**：保留 5.x，仍以静态资源方式由 admin/public 提供。
7. **后端运行时**：保持 ThinkJS 3.x，**不**切换到 Nest/Egg/Koa；TS 仅作类型与编译层改造。
8. **SSR 中间件**：移除 ThinkJS 中托管 Nuxt 的 `nuxt.js` 中间件（不再需要）。
9. **工具页**（`pages/tool/**`）：按用户确认 **不迁移**，新前台对该路由统一抛 404。
10. **共享类型**：本次不抽 packages/shared，admin / front 各自维护一份 [types/index.ts](file:///e:/nodejs/blog/apps/front/app/types/index.ts)（字段保持一致）。
11. **测试**：删除 jest 配置；本次不引入新单测，依赖 `vue-tsc / tsc --noEmit` 做静态校验。
12. **数据库与上传目录**：完全保留，不动数据。
13. **环境变量**：每个 app 自带 `.env.example`，根目录不提供统一 env。

---

## 5. Verification（验证步骤）

执行顺序按 `front → server → admin`：

1. **依赖安装**
   ```
   pnpm install
   ```
   预期：根 + apps 全部解析成功，无 peer 冲突。
2. **apps/server 编译与启动**
   ```
   pnpm -F server typecheck
   pnpm -F server build
   pnpm -F server dev
   ```
   预期：`tsc --noEmit` 通过；`dev` 启动后访问 `http://127.0.0.1:8360/front/general` 返回原结构 `{ errno:0, data:{...} }`。
3. **apps/front 启动**
   ```
   pnpm -F www dev
   ```
   预期：`http://localhost:3000/` 首页、`/article/list-1`、`/article/detail/<id>`、`/bangumi/list-1`、`/archives/list-1`、`/link`、`/about` 全部正常 SSR；评论组件挂载且能拉取列表；prism 代码高亮生效；`/tool/xxx` 抛 404。
4. **apps/admin 启动**
   ```
   pnpm -F admin dev
   pnpm -F admin typecheck
   ```
   预期：`http://localhost:3001/login` 可登录，登录后路由守卫放行；Dashboard、文章 CMS（新增/编辑/列表/回收站）、分类、追番、评论、链接、Banner、各类配置页面可访问且 CRUD 调用成功；TinyMCE 加载本地静态资源；图标渲染正常。
5. **构建产物**
   ```
   pnpm -F server build
   pnpm -F www build
   pnpm -F admin generate
   ```
   预期：三者均无错误；`apps/admin/.output/public/` 与 `apps/front/.output/` 生成；`apps/server/dist/` 生成。
6. **回归脚本（人工）**：登录、发文章带封面图、上传图片、追番打卡、评论回复、Banner 排序、阅读配置变更、前台访问性能（Lighthouse > 80）。
7. **回滚预案**：删除前用 `git stash` 备份；保留 [deploy/](file:///e:/nodejs/blog/deploy) 不动；若 admin 迁移阻塞，可优先合入 server+front，后续单独合并 admin。

---

## 6. 实施顺序建议（供执行阶段使用）

1. 顶层工程化 + 删除旧文件
2. apps/server TS 迁移（含入口、配置、controller/logic/model/service、移除 nuxt 中间件）
3. apps/front 收尾（评论、分页、prism、error、tool 占位）
4. apps/admin 全量重建（骨架 → utils/composables → stores → layouts → pages 模块化迁移：login → dashboard → content → category → community → system → member）
5. 全量 `pnpm -r typecheck && pnpm -r build` 验证

