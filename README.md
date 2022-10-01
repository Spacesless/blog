# tl-blog

> Timeless's博客
> 项目是个人博客，主要用于管理和展示文章、追番等动态

## 使用框架
``` bash
    vue-element-template：模板
    vue：js框架
    nuxtjs: ssr渲染
    thinkjs：nodejs框架
    element-ui：UI库
    axios：易用、简洁且高效的http库
```

## 目录简介
> + admin 内容管理平台
> + web 网站前端模板
> + src 后端源代码

## 目录结构

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

## 其他注意事项

...