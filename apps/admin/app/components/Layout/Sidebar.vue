<template>
  <div>
    <div class="logo-wrap">
      <NuxtLink class="logo-link" to="/">
        <img src="~/assets/logo.jpg" class="logo-img" alt="logo" />
        <h1 v-if="!collapse" class="logo-title">Timeless Admin</h1>
      </NuxtLink>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <LayoutSidebarItem
          v-for="route in menuRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { menuRoutes } from '~/config/menu'

const appStore = useAppStore()
const route = useRoute()

const collapse = computed(() => !appStore.sidebar.opened)
const activeMenu = computed(() => (route.meta?.activeMenu as string) || route.path)

const variables = {
  menuBg: '#304156',
  menuText: '#BFCBD9',
  menuActiveText: '#409EFF',
}
</script>

<style lang="scss" scoped>
.logo-wrap {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #2b2f3a;
  overflow: hidden;

  .logo-link {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #fff;
  }

  .logo-img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-right: 10px;
    vertical-align: middle;
  }

  .logo-title {
    display: inline-block;
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }
}
</style>
