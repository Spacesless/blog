<template>
  <div class="header">
    <div class="header-logo hidden-md-and-up">
      <nuxt-link to="/">
        <img class="header-logo__avatar" :src="'/static/avatar.jpg' | getAbsolutePath" alt="logo">
      </nuxt-link>
      <span
        class="header-logo__hamburger"
        :class="{
          'header-logo__hamburger--collapse icon-xiangyouzhankai': isCollapse,
          'icon-xiangzuoshouqi': !isCollapse
        }"
        @click="toggleSidebar"
      />
    </div>
    <div class="header-menus">
      <el-tooltip effect="dark" :content="isDark ? '白天模式' : '黑夜模式'" placement="bottom">
        <i
          class="header-menus__btn"
          :class="{
            'icon-qingtian': isDark,
            'icon-moon': !isDark
          }"
          @click="toggleColorMode"
        />
      </el-tooltip>
      <el-tooltip effect="dark" content="站内搜索" placement="bottom">
        <i class="header-menus__btn el-icon-search" @click="handleShowSearch" />
      </el-tooltip>
    </div>

    <!-- 站内搜索 -->
    <Search :categories="categories" :search-visible="searchVisible" @onCloseSearch="handleCloseSearch" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Search from './Search'

export default {
  name: 'LayoutHeader',
  components: {
    Search
  },
  data () {
    return {
      searchVisible: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'device', 'categories']),
    isCollapse () {
      return !this.sidebar.opened
    },
    isDark () {
      return this.$colorMode.preference === 'dark'
    }
  },
  methods: {
    handleShowSearch () {
      this.searchVisible = true
    },
    toggleSidebar () {
      this.$store.dispatch('tools/toggleSideBar')
    },
    // 白天、黑夜模式切换
    toggleColorMode () {
      this.$colorMode.preference = this.isDark ? 'light' : 'dark'
    },
    handleCloseSearch () {
      this.searchVisible = false
    }
  }
}
</script>
