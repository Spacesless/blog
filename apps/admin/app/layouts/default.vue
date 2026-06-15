<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="appStore.device === 'mobile' && appStore.sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <LayoutSidebar class="sidebar-container" />
    <div class="main-container">
      <div class="header">
        <LayoutNavbar />
        <LayoutTagsView />
      </div>
      <LayoutAppMain>
        <slot />
      </LayoutAppMain>
    </div>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
useResize()

const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  withoutAnimation: appStore.sidebar.withoutAnimation,
  mobile: appStore.device === 'mobile',
}))

function handleClickOutside() {
  appStore.closeSideBar({ withoutAnimation: false })
}
</script>

<style lang="scss" scoped>
@use '~/assets/styles/mixin.scss' as *;

.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
  height: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: #000000;
  opacity: .3;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width .28s;
}

.hideSidebar .header {
  width: calc(100% - 54px);
}

.mobile .header {
  width: 100%;
}
</style>
