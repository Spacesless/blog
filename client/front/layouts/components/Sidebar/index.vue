<template>
  <div class="aside" :class="{'aside--collapse': isCollapse}">
    <div class="aside-logo">
      <nuxt-link to="/">
        <img class="aside-logo__img" :src="'/static/avatar.jpg' | getAbsolutePath" width="100" height="100" alt="logo">
        <p class="aside-logo__name">
          Timeless
        </p>
      </nuxt-link>
      <p class="aside-logo__hitokoto">
        花开成景，花落成诗
      </p>
    </div>

    <el-scrollbar class="aside-scrollbar" wrap-class="aside-scrollbar-wrapper">
      <el-menu
        ref="navigation"
        :background-color="null"
        :collapse="isCollapse"
        :default-active="activeKey"
        class="aside-menu"
        role="menu"
        router
      >
        <el-menu-item index="/">
          <i class="aside-menu__icon icon-shouye" />
          <span slot="title">首页</span>
        </el-menu-item>
        <sidebar-item v-for="route in menus" :key="route.path" :item="route" />
      </el-menu>
    </el-scrollbar>

    <ul class="aside-info clearfix">
      <li>
        <a class="aside-info__icon icon-gitee" href="https://gitee.com/timelessq" target="__blank" title="Gitee" />
      </li>
      <li>
        <a
          class="aside-info__icon icon-qq"
          href="http://sighttp.qq.com/authd?IDKEY=9d8b594f90881e85bc083a6ec1bd41f275e2761b130b97ca"
          target="__blank"
          title="QQ"
        />
      </li>
      <li>
        <a
          class="aside-info__icon icon-music"
          href="https://y.qq.com/n/ryqq/profile/like/song?uin=NenPoeEioeoA"
          target="__blank"
          title="QQ Music"
        />
      </li>
      <li>
        <a class="aside-info__icon icon-bilibili" href="https://space.bilibili.com/315883644" target="__blank" title="Bilibili" />
      </li>
      <li>
        <a class="aside-info__icon icon-rss" href="/rss" target="__blank" title="rss" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { convertToTree } from '#/utils'

export default {
  name: 'SidebarMenu',
  components: {
    SidebarItem
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapGetters(['device', 'sidebar', 'categories', 'activeMenu', 'configs']),
    menus () {
      const filterMenus = this.categories.filter(item => item.is_nav)
      return convertToTree(filterMenus)
    },
    activeKey () {
      const { path, params } = this.$route
      if (path.includes('detail')) {
        return this.activeMenu
      } else {
        const [id] = params.id?.split('-') || []
        return id ? path.replace(params.id, id) : path
      }
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
