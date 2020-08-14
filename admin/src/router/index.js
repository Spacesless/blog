import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

// 处理vue-router ≥3.0版本回调形式以及改成promise api的形式了，返回的是一个promise，默认没catch，跳转相同的地址会报以下错误
// Uncaught (in promise) Error: Redirected when going from *** via a navigation guard
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/content',
    component: Layout,
    redirect: '/content/blog',
    meta: { title: '内容管理', icon: 'content' },
    children: [
      {
        path: 'blog',
        name: 'Blog',
        component: () => import('@/views/content/blog'),
        meta: { title: '文章模块' }
      },
      {
        path: 'image',
        name: 'Image',
        component: () => import('@/views/content/image'),
        meta: { title: '图片模块' }
      },
      {
        path: 'bangumi',
        name: 'Bangumi',
        component: () => import('@/views/content/bangumi'),
        meta: { title: '番剧模块' }
      },
      {
        path: 'webapp',
        name: 'Webapp',
        component: () => import('@/views/content/webapp/index'),
        meta: { title: 'web应用' }
      },
      {
        path: 'webapp/:id',
        name: 'AppContent',
        hidden: true,
        component: () => import('@/views/content/webapp/content'),
        meta: { title: 'web应用详情' }
      },
      {
        path: 'create',
        name: 'ContentCreate',
        props: true,
        hidden: true,
        component: () => import('@/views/content/create'),
        meta: { title: '文章内容', noCache: true }
      },
      {
        path: 'edit/:id',
        name: 'ContentEdit',
        props: true,
        hidden: true,
        component: () => import('@/views/content/edit'),
        meta: { title: '文章内容', noCache: true }
      },
      {
        path: 'recycle',
        name: 'Recycle',
        component: () => import('@/views/content/recycle'),
        meta: { title: '回收站', noCache: true }
      }
    ]
  },

  {
    path: '/column',
    component: Layout,
    meta: { title: '栏目管理', icon: 'column' },
    children: [
      {
        path: '',
        name: 'Column',
        hidden: true,
        component: () => import('@/views/column/index'),
        meta: { title: '栏目列表' }
      },
      {
        path: 'edit/:id',
        name: 'ColumnEdit',
        props: true,
        hidden: true,
        component: () => import('@/views/column/edit'),
        meta: { title: '栏目内容', noCache: true }
      },
      {
        path: 'create',
        name: 'ColumnAdd',
        props: true,
        hidden: true,
        component: () => import('@/views/column/create'),
        meta: { title: '栏目内容', noCache: true }
      }
    ]
  },

  {
    path: '/community',
    component: Layout,
    redirect: '/community/comment',
    meta: { title: '社区中心', icon: 'community' },
    children: [
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/community/comment/index'),
        meta: { title: '评论系统' }
      },
      {
        path: '/comment/:id',
        name: 'CommentContent',
        props: true,
        hidden: true,
        component: () => import('@/views/community/comment/content'),
        meta: { title: '评论详情', noCache: true }
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/community/message/index'),
        meta: { title: '在线留言' }
      },
      {
        path: '/message/:id',
        name: 'MessageContent',
        props: true,
        hidden: true,
        component: () => import('@/views/community/message/content'),
        meta: { title: '留言详情', noCache: true }
      },
      {
        path: 'link',
        name: 'Link',
        component: () => import('@/views/community/links/index'),
        meta: { title: '友情链接' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user',
    meta: { title: '管理员', icon: 'member' },
    children: [
      {
        path: '',
        name: 'Admin',
        component: () => import('@/views/user/admin/index'),
        meta: { title: '管理员' }
      },
      {
        path: 'profile/create',
        name: 'CreateAdmin',
        hidden: true,
        component: () => import('@/views/user/profile/create'),
        meta: { title: '添加管理员' }
      },
      {
        path: 'profile/edit/:id',
        name: 'EditAdmin',
        hidden: true,
        component: () => import('@/views/user/profile/edit'),
        meta: { title: '管理员信息' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/information',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: 'options-general',
        name: 'OptionsGeneral',
        component: () => import('@/views/system/options-general/index'),
        meta: { title: '常规配置', noCache: true }
      },
      {
        path: 'options-media',
        name: 'OptionsMedia',
        component: () => import('@/views/system/options-media/index'),
        meta: { title: '媒体配置', noCache: true }
      },
      {
        path: 'banners',
        name: 'Banners',
        component: () => import('@/views/system/banners/index'),
        meta: { title: 'Banner管理' }
      },
      {
        path: 'customize',
        name: 'Customize',
        component: () => import('@/views/system/customize/index'),
        meta: { title: '外观配置', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
