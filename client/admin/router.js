import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layouts/index'

import redirect from '@/views/redirect/index'
import login from '@/views/login/index'
import home from '@/views/home/index'
import article from '@/views/content/index'
import bangumi from '@/views/content/bangumi'
import createContent from '@/views/content/create'
import editContent from '@/views/content/edit'
import recycle from '@/views/content/recycle'
import category from '@/views/category/index'
import editCategory from '@/views/category/edit'
import createCategory from '@/views/category/create'
import commentList from '@/views/community/comment/index'
import commentContent from '@/views/community/comment/content'
import link from '@/views/community/link/index'
import profile from '@/views/member/index'
import generalConfig from '@/views/system/general-config/index'
import readingConfig from '@/views/system/reading-config/index'
import bannerConfig from '@/views/system/banner-config/index'

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
export const routes = [
  {
    path: '/redirect/:path*',
    component: redirect,
    hidden: true
  },

  {
    path: '/login',
    component: login,
    hidden: true
  },

  {
    path: '/',
    name: 'Home',
    component: home,
    meta: { title: '首页', icon: 'dashboard', affix: true }
  },

  {
    path: '/content',
    component: Layout,
    redirect: '/content/article',
    meta: { title: '内容管理', icon: 'content' },
    children: [
      {
        path: '/content/article',
        name: 'Article',
        component: article,
        meta: { title: '文章模块' }
      },
      {
        path: '/content/bangumi',
        name: 'Bangumi',
        component: bangumi,
        meta: { title: '番剧模块' }
      },
      {
        path: '/content/create',
        name: 'ContentCreate',
        props: true,
        hidden: true,
        component: createContent,
        meta: { title: '新增文章', noCache: true }
      },
      {
        path: '/content/edit/:id',
        name: 'ContentEdit',
        props: true,
        hidden: true,
        component: editContent,
        meta: { title: '修改文章', noCache: true }
      },
      {
        path: '/content/recycle',
        name: 'Recycle',
        component: recycle,
        meta: { title: '回收站' }
      }
    ]
  },

  {
    path: '/category',
    component: Layout,
    redirect: '/category/list',
    meta: { title: '栏目管理', icon: 'category' },
    children: [
      {
        path: '/category',
        name: 'Category',
        component: category,
        meta: { title: '栏目列表' }
      },
      {
        path: '/category/edit/:id',
        name: 'CategoryEdit',
        props: true,
        hidden: true,
        component: editCategory,
        meta: { title: '栏目内容', noCache: true }
      },
      {
        path: '/category/create',
        name: 'CategoryCreate',
        props: true,
        hidden: true,
        component: createCategory,
        meta: { title: '栏目内容', noCache: true }
      }
    ]
  },

  {
    path: '/community',
    component: Layout,
    redirect: '/community/comment',
    meta: { title: '社区管理', icon: 'community' },
    children: [
      {
        path: '/community/comment',
        name: 'Comment',
        component: commentList,
        meta: { title: '评论系统' }
      },
      {
        path: '/community/comment/:id',
        name: 'CommentContent',
        props: true,
        hidden: true,
        component: commentContent,
        meta: { title: '评论详情', noCache: true }
      },
      {
        path: '/community/link',
        name: 'Link',
        component: link,
        meta: { title: '友情链接' }
      }
    ]
  },

  {
    path: '/profile',
    name: 'Profile',
    component: profile,
    meta: { title: '用户管理', icon: 'member', noCache: true }
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/options-general',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: '/system/options-general',
        name: 'OptionsGeneral',
        component: generalConfig,
        meta: { title: '常规配置', noCache: true }
      },
      {
        path: '/system/options-reading',
        name: 'OptionsReading',
        component: readingConfig,
        meta: { title: '阅读设置', noCache: true }
      },
      {
        path: '/system/options-banner',
        name: 'OptionsBanner',
        component: bannerConfig,
        meta: { title: 'Banner管理' }
      }
    ]
  }
]

export const constantRoutes = flattenDeep(routes)

/**
 * 数组降维
 * @param {Array} source
 * @param {Array} result
 */
function flattenDeep(source, result = []) {
  source.forEach(item => {
    if (item.children?.length) {
      flattenDeep(item.children, result)
    }
    const temp = { ...item }
    delete temp.children
    result.push(temp)
  })
  return result
}

export function createRouter() {
  return new Router({
    mode: 'hash',
    routes: constantRoutes
  })
}
