<template>
  <div class="aside">
    <div v-if="device==='mobile' && sidebar.opened" class="aside-mask" @click="handleClickOutside" />
    <div :class="{'aside-logo': true, 'aside-logo--collapse': isCollapse}">
      <nuxt-link to="/">
        <img class="aside-logo__img" src="/static/avatar.jpg" alt="logo">
        <p class="aside-logo__name">{{ logoTitle }}</p>
      </nuxt-link>
    </div>
    <el-scrollbar class="aside-scrollbar" wrap-class="aside-scrollbar-wrapper">
      <el-menu
        ref="navigation"
        :default-active="activeMenu"
        :collapse="isCollapse"
        class="aside-menu"
        role="menu"
      >
        <div class="aside-menu-item">
          <nuxt-link to="/">
            <el-menu-item index="/">
              <i class="aside-menu__icon tl-icon">&#xe76f;</i>
              <span slot="title">首页</span>
            </el-menu-item>
          </nuxt-link>
        </div>
        <sidebar-item v-for="route in menus" :key="route.path" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

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
    ...mapGetters(['device', 'sidebar', 'menus', 'configs']),
    logoTitle() {
      return this.configs.sitename || "Timeless's 博客"
    },
    activeMenu() {
      return this.$route.path
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
