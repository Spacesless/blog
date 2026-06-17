# Slugify ID 支持方案 — 文章与番剧

## 一、需求

为「文章」和「番剧」两类内容支持 Slugify ID（友好 URL slug），同时保留旧 `id`（数字主键）作为兼容入口。

目标 URL 形态：

- 旧：`/article/detail/72`、`/bangumi/detail/149`
- 新：`/article/detail/hello-world`、`/bangumi/detail/gu-du-yao-gun`
- 旧链接仍可访问（向后兼容），但前台输出/分享使用 slug。

详情接口需可通过 slug 查询：`/article/detail?id=hello-world` 或 `/bangumi/detail?id=gu-du-yao-gun`。

---

## 二、现状梳理

数据库（[mysql.sql](file:///e:/nodejs/blog/deploy/mysql.sql)）：

- `tl_article`、`tl_bangumi` 表均有冗余字段 `pathname`（[mysql.sql L37](file:///e:/nodejs/blog/deploy/mysql.sql#L37-L37)、[mysql.sql L71](file:///e:/nodejs/blog/deploy/mysql.sql#L71-L71)），现未启用，可直接复用为 slug 字段。

后端（ThinkJS）：

- 详情接口按数字 `id` 查询：[article.js detailAction](file:///e:/nodejs/blog/apps/server/src/controller/front/article.js#L58-L86)、[bangumi.js detailAction](file:///e:/nodejs/blog/apps/server/src/controller/front/bangumi.js#L46-L74)
- logic 校验 `id` 为 `int`（需放开）：[front/article.js](file:///e:/nodejs/blog/apps/server/src/logic/front/article.js)、[front/bangumi.js](file:///e:/nodejs/blog/apps/server/src/logic/front/bangumi.js)
- accessAction（增加访问量）以 `id` 查询：[article.js accessAction](file:///e:/nodejs/blog/apps/server/src/controller/front/article.js#L88-L95)
- 管理端 CRUD：[admin/restful/article.js](file:///e:/nodejs/blog/apps/server/src/controller/admin/restful/article.js)、[admin/restful/bangumi.js](file:///e:/nodejs/blog/apps/server/src/controller/admin/restful/bangumi.js)
- RSS / sitemap 中拼 URL：[front/xml.js](file:///e:/nodejs/blog/apps/server/src/controller/front/xml.js#L61-L92)

前端（Nuxt）：

- 详情页：[article/detail/[id].vue](file:///e:/nodejs/blog/apps/front/app/pages/article/detail/%5Bid%5D.vue#L70-L75)、[bangumi/detail/[id].vue](file:///e:/nodejs/blog/apps/front/app/pages/bangumi/detail/%5Bid%5D.vue#L97-L99)，目前用 `Number(route.params.id)` 取数字 id；需改为字符串。
- 列表跳转链接：`/article/detail/${item.id}` 等；改为 slug 优先。
- API 调用：[useApi.ts fetchArticleDetail/fetchBangumiDetail](file:///e:/nodejs/blog/apps/front/app/composables/useApi.ts#L69-L106) 已支持 `number | string`，前端无类型问题。
- 类型：[types/index.ts Article / Bangumi](file:///e:/nodejs/blog/apps/front/app/types/index.ts#L28-L67) 需新增 `slug` 字段。

后台（admin）：

- 文章/番剧编辑表单：[ArticleContent.vue](file:///e:/nodejs/blog/apps/admin/app/components/Content/ArticleContent.vue)；需添加 slug 输入与"按标题自动生成"按钮。
- 列表"前台访问"链接：[content/index.vue L29](file:///e:/nodejs/blog/apps/admin/app/pages/content/index.vue#L29)、[content/bangumi.vue L29](file:///e:/nodejs/blog/apps/admin/app/pages/content/bangumi.vue#L29) 需改为优先使用 slug。

---

## 三、设计方案

### 1. 数据存储

- 复用现有 `pathname` 字段作为 slug 列（`varchar(255)`，已存在）。
- 在 `tl_article.pathname`、`tl_bangumi.pathname` 上添加唯一索引（允许 NULL，多个 NULL 不冲突）。
- 历史数据 `pathname` 为 NULL ⇒ slug 为空时回退到数字 id 路径（向后兼容）。

迁移 SQL（写入 [deploy/mysql.sql](file:///e:/nodejs/blog/deploy/mysql.sql) 顶部 README 注释，或新增 `deploy/migrations/add_pathname_index.sql`）：

```sql
ALTER TABLE `tl_article`  ADD UNIQUE INDEX `uniq_pathname` (`pathname`);
ALTER TABLE `tl_bangumi`  ADD UNIQUE INDEX `uniq_pathname` (`pathname`);
```

### 2. Slug 生成规则（服务端）

新建工具 `apps/server/src/service/slugify.js`：

- 接受字符串，做：trim → 小写 → 去重音 → 非 `[a-z0-9]+` 替换为 `-` → 去首尾 `-` → 截断至 80 字符。
- 中文：使用纯 ASCII 化（`title` 全中文时可能产出空），如为空则使用 `bangumi-<id>` / `article-<id>` 兜底，保证唯一。
- 唯一性：保存前先按 slug 查询同表是否已存在；存在且非自身 ⇒ 追加 `-2`、`-3`…
- 依赖：避免引入新 npm 包；本仓库的 thinkjs 体系无 `slugify`，可手写约 50 行实现，零依赖；如果允许新增依赖，则用 `slugify` 包（轻量）。

> ❓ 决策点 A：是否允许新增 `slugify` 依赖（默认推荐手写零依赖实现）。

### 3. 后端接口改造

**详情查询（前台）**：

- [front/article.js detailAction](file:///e:/nodejs/blog/apps/server/src/controller/front/article.js#L58-L86) 和 [front/bangumi.js detailAction](file:///e:/nodejs/blog/apps/server/src/controller/front/bangumi.js#L46-L74)：
  - 入参 `id` 不再仅作数字 id；规则：纯数字 ⇒ 按 `id` 查；否则按 `pathname` 查。
  - 返回数据中 `pathname` 一并返回。
- accessAction 同步支持 slug。
- logic 校验 `int` 改为 `required: true, string: true`，长度限制；移除强 `int` 约束。

**列表接口**：在返回字段中追加 `pathname`，便于前端拼链接：

- [front/article.js selectPost](file:///e:/nodejs/blog/apps/server/src/model/front/article.js#L18) → `field` 增加 `pathname`。
- [front/bangumi.js selectPost](file:///e:/nodejs/blog/apps/server/src/model/front/bangumi.js#L19) → 同上。
- [front/index.js selectArticle/selectBangumi](file:///e:/nodejs/blog/apps/server/src/model/front/index.js)：首页聚合也加 `pathname`。
- 搜索：[front/search.js](file:///e:/nodejs/blog/apps/server/src/model/front/search.js#L13) `field` 增加 `pathname`。
- 归档/XML：[front/xml.js model](file:///e:/nodejs/blog/apps/server/src/model/front/xml.js#L7) 增加 `pathname`；[xml.js controller](file:///e:/nodejs/blog/apps/server/src/controller/front/xml.js#L71-L88) 拼 URL 时优先 `pathname`。

**管理端写入**：

- [admin/article.js createPost/updatePost](file:///e:/nodejs/blog/apps/server/src/model/admin/article.js#L43-L60) 和 [admin/bangumi.js createPost/updatePost](file:///e:/nodejs/blog/apps/server/src/model/admin/bangumi.js#L43-L60)：
  - 入参带 `pathname` 时按用户值校验/去重；
  - 入参 `pathname` 为空且 title 变化时，自动按 title 生成；
  - 新增时如未提供，自动生成。
- 校验：slug 仅允许 `^[a-z0-9-]{1,80}$`；冲突时尝试自动加序号或返回错误（推荐：管理端体验上自动加序号，返回最终 slug）。

### 4. 缓存清理

详情数据有缓存键 `article` / `bangumi`（[front/index.js](file:///e:/nodejs/blog/apps/server/src/model/front/index.js#L19-L25)）。slug 变更后需清缓存：admin 更新接口已有变更，无需新增。

### 5. 前端（Nuxt 用户站）

- 类型：在 `Article` / `Bangumi` 加 `pathname?: string`。
- 列表页拼链接：所有 `to="/article/detail/${id}"` 改为：

  ```ts
  function detailUrl(type: 'article'|'bangumi', item: { id: number; pathname?: string }) {
    return `/${type}/detail/${item.pathname || item.id}`;
  }
  ```

  统一放到 [utils/index.ts](file:///e:/nodejs/blog/apps/front/app/utils/index.ts)。

- 详情页路由 `[id].vue` 保持文件名不变，但取参方式：`const idOrSlug = route.params.id as string`；将其字符串传给 `fetchArticleDetail` / `fetchBangumiDetail`。
- `useAsyncData` 的 key 改用 `idOrSlug` 字符串。
- `recordArticleAccess` 入参类型扩展（已支持 `number|string`）。
- SEO/取消息侧仍用 `data.value.id` 等正常字段。

### 6. 后台（admin）

- 编辑表单（[ArticleContent.vue](file:///e:/nodejs/blog/apps/admin/app/components/Content/ArticleContent.vue)）：
  - 新增 `pathname` 输入框：占位 "留空将根据标题自动生成"；右侧"按标题生成"按钮（前端可调一个轻量 slugify util，与服务端规则一致）。
  - 校验：可选；输入时正则 `^[a-z0-9-]{1,80}$`。
- 列表中的"前台预览"链接：当 `row.pathname` 存在时用之，否则用 `row.id`。
- 接口字段：列表查询 `field` 增加 `pathname`（[admin/article.js](file:///e:/nodejs/blog/apps/server/src/model/admin/article.js#L25)、[admin/bangumi.js](file:///e:/nodejs/blog/apps/server/src/model/admin/bangumi.js#L27)）。

### 7. 向后兼容

- 旧的 `/article/detail/72` 数字 URL 仍然有效（详情接口按数字优先 id 查询）。
- 如果文章存在 slug 且用户从数字 URL 访问，可选择"301 跳转到 slug URL"（默认不做，避免侵入；列入可选增强）。

> ❓ 决策点 B：是否在前端详情页对"数字 id 访问但存在 slug"做 `navigateTo` 替换地址栏？（推荐：暂不做，保持简单。）

---

## 四、任务拆解

1. **数据库迁移脚本**：新增 `deploy/migrations/2026xxxx-pathname-index.sql`；更新 README 部署说明。
2. **服务端 slugify 工具**：`apps/server/src/service/slugify.js`。
3. **后端模型/控制器**：
   - 详情查询支持 slug：`controller/front/article.js`、`controller/front/bangumi.js`。
   - logic 校验放宽：`logic/front/article.js`、`logic/front/bangumi.js`。
   - 列表字段加 `pathname`：`model/front/{article,bangumi,index,search,xml}.js`。
   - 管理端写入自动生成/校验：`model/admin/{article,bangumi}.js`、`controller/admin/restful/{article,bangumi}.js`。
   - XML/RSS/sitemap 拼链接优先 slug：`controller/front/xml.js`。
4. **前端用户站**：
   - 类型扩展 `Article/Bangumi.pathname`。
   - 工具函数 `detailUrl(type, item)`。
   - 列表/首页/详情/搜索结果/归档/相似推荐链接替换。
   - 详情页 `[id].vue` 参数改字符串。
5. **后台管理端**：
   - 编辑表单加 `pathname` 输入 + 自动生成按钮（前端 slugify 与后端规则一致，复制一份到 `apps/admin/app/utils`）。
   - 列表"前台预览"链接优先 slug：`pages/content/index.vue`、`pages/content/bangumi.vue`。
6. **回归验证**：
   - 旧 id 访问 ✅、新 slug 访问 ✅、slug 唯一冲突自动加序号 ✅、增加访问量 ✅、RSS/sitemap URL ✅、搜索结果链接 ✅。

---

## 五、风险与注意点

- **历史链接 SEO**：保留数字 id 入口，避免外链失效。
- **slug 唯一约束**：MySQL `MyISAM`/`InnoDB` 唯一索引允许多个 NULL，存量为空数据不冲突。
- **中文标题**：纯 ASCII 化可能为空；兜底为 `article-<id>` / `bangumi-<id>`，仍可读但不影响功能。
- **缓存**：`front/index` 模块对 `article`/`bangumi` 有 1 天缓存；admin 改动 slug 后需用户主动刷新缓存（系统已有清缓存入口）。

---

## 六、需用户决策的问题

1. **决策 A**：是否允许引入 `slugify` 第三方包？（默认手写零依赖）
2. **决策 B**：当用户使用旧数字 URL 访问而该内容已有 slug 时，是否前端自动改写为 slug URL？（默认不做）
3. **决策 C**：纯中文标题生成空 slug 时，兜底策略选择：
   - (a) `article-<id>` 数字兜底（默认推荐）
   - (b) 强制管理员手动输入 slug
   - (c) 使用拼音库（需新增依赖，例如 `pinyin-pro`）

