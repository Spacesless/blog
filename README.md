# timeless-blog

> Timeless's博客
> 项目是个人博客，主要用于管理和展示文章、追番等动态，记录生活点滴、各种想法以及工作学习成果，方便归纳总结。

## 技术栈
``` 
  前台框架：Nuxt.js（Vue2.0）
  UI库：Element-ui
  后台框架：ThinkJS（Node.js）
  数据库：Mysql
  缓存：File-cache
  文件管理：本地+对象存储
  会话信息：Session+Cookie
```

## 系统设计
1. 前后端用同一种开发语言
2. 一个项目管理（后台、内容管理系统、前台），共用依赖与模块
3. 同构渲染
4. Nuxt 渲染引擎作为 Node.js 中间件，不用独立起服务
5. Node 服务不对外直接访问，使用 Nginx 挡一层

## 功能特性
- 管理系统登录
- 系统配置（个性化）
- 栏目管理（文章类别、展示页如关于）
- 文章管理（富文本编辑、文件上传、文件管理器）
- 文章详情（目录、代码高亮、大图预览）
- 文章归档、搜索（按标签展示）
- 影视番剧（追剧动态）
- 各种小工具（单页应用如我的音乐、足迹、必应每日壁纸等）
- 社区反馈（评论、友情链接）
- 前台主题（响应式、暗色模式）
- XML渲染（sitemap、rss 等XML展示）

## 目录结构
```
client 前台
├── admin 内容管理平台
|   ├── api 整合管理所有的api接口
|   ├── layouts 外部容器
|   ├── middleware
│   |   └── permission.js 登录鉴权
|   ├── plugins
│   |   ├── api.js 使上下文能使用api请求
│   |   ├── axios.js axios全局拦截器
│   |   ├── element-ui element-ui按需引入
│   |   └── svg-icon 注册svg icon组件
|   ├── store vuex
|   ├── styles 公共样式
|   ├── utils 工具集
|   ├── views 页面组件
|   └── router.js @nuxtjs/router路由配置
├── common 内容管理平台和博客前台功能模块
├── front 博客前台
|   ├── layouts 外部容器
│   |   ├── app.vue 工具页面使用的外部容器，没有菜单
│   |   └── default 默认容器，有菜单
|   ├── pages nuxt页面
|   ├── plugins
│   |   ├── axios.js axios全局拦截器
│   |   ├── element-ui element-ui按需引入
│   |   └── filters 注册全局过滤器
|   ├── store vuex
│   |   └── index.js nuxtServerInit获取菜单及系统配置
|   ├── vendor 第三方库
│   |   ├── aplayer 音乐播放器
│   |   ├── live2d Live2D Cubism SDK v2看板娘
│   └── └── spine-ts spine骨骼动画
├── config 配置
|   ├── adapter.model.js 数据库配置
│   ├── nuxt.admin.js 内容管理平台nuxt配置
│   └── nuxt.front.js 博客前台nuxt配置
├── logs 日志文件
├── runtime
|   ├── cache 缓存
|   ├── session 会话信息
├── src 后台
|   ├── config 配置
│   |   ├── adapter 数据库、缓存、日志等配置
│   |   ├── middleware 中间件配置
│   |   |   └── nuxt.js nuxt中间件
│   |   ├── extend.js thinkjs扩展配置
│   |   └── router.js thinkjs路由
│   ├── controller 控制器
│   |   ├── admin 内容管理平台api
│   |   └── front 博客前台api
│   ├── logic 校验层
│   ├── model 模型，数据库操作
│   ├── service 服务，可复用，抽离controller逻辑
├── views
│   ├── rss.xml rss模板
│   └── sitemap.xml 网站地图模板
├── www 静态资源，nuxt打包目标目录
│   └── upload 上传目录
├── development.js thinkjs开发环境入口
├── nuxt.config.js
├── package.json
├── production.js thinkjs生产环境入口
```
## 项目构建

``` bash
# 安装依赖
npm install/cnpm install

# 调试热更新服务 
# 服务使用代理，配置位于vue.config.js文件中
npm run dev

# 打包项目
npm run build

```
## 部署

+ 项目使用nginx进行部署
