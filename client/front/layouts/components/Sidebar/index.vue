<template>
  <div class="aside">
    <div v-if="device==='mobile' && sidebar.opened" class="aside-mask" @click="handleClickOutside" />
    <div :class="{'aside-logo': true, 'aside-logo--collapse': isCollapse}">
      <nuxt-link to="/">
        <img class="aside-logo__img" :src="'/static/avatar.jpg' | getAbsolutePath" width="100" height="100" alt="logo">
        <p class="aside-logo__name">Timeless</p>
      </nuxt-link>
      <p class="aside-logo__hitokoto">花开成景，花落成诗</p>
    </div>
    <ul class="aside-info clearfix">
      <li>
        <a class="aside-info__icon tl-icon" href="https://gitee.com/timelessq" target="__blank" title="Gitee">&#xe686;</a>
      </li>
      <li>
        <a
          class="aside-info__icon tl-icon"
          href="http://sighttp.qq.com/authd?IDKEY=9d8b594f90881e85bc083a6ec1bd41f275e2761b130b97ca"
          target="__blank"
          title="QQ"
        >&#xe647;</a>
      </li>
      <li>
        <a
          class="aside-info__icon tl-icon"
          href="https://y.qq.com/n/ryqq/profile/like/song?uin=NenPoeEioeoA"
          target="__blank"
          title="QQ Music"
        >&#xe63b;</a>
      </li>
      <li>
        <a class="aside-info__icon tl-icon" href="https://space.bilibili.com/315883644" target="__blank" title="Bilibili">&#xe75e;</a>
      </li>
      <li>
        <a class="aside-info__icon tl-icon" href="/rss" target="__blank" title="rss">&#xe6d0;</a>
      </li>
    </ul>
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
          <i class="aside-menu__icon tl-icon">&#xe76f;</i>
          <span slot="title">首页</span>
        </el-menu-item>
        <sidebar-item v-for="route in menus" :key="route.path" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { convertToTree } from '#/utils'

export default {
  components: {
    SidebarItem
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapGetters(['device', 'sidebar', 'categories', 'activeMenu', 'configs']),
    menus() {
      const filterMenus = this.categories.filter(item => item.is_nav)
      return convertToTree(filterMenus)
    },
    activeKey() {
      const { path, params } = this.$route
      if (path.includes('detail')) {
        return this.activeMenu
      } else {
        const [id] = params.id?.split('-') || []
        return id ? path.replace(params.id, id) : path
      }
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('tools/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
