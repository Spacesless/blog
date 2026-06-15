<template>
  <div class="fixed top-0 right-0 z-1000 box-border w-[calc(100%-var(--aside-width))] h-0 px-4 transition-[width] duration-300 lt-lg:(z-998 h-[45px] leading-[45px] bg-[var(--bg-normal)] shadow-md)">
    <div class="relative float-left leading-[45px] lt-lg:block hidden">
      <NuxtLink to="/">
        <img
          class="mr-1 align-middle rounded-full"
          src="/avatar.jpg"
          width="36"
          height="36"
          alt="logo"
        >
      </NuxtLink>
      <Icon
        :name="isCollapse ? 'ph:caret-right' : 'ph:caret-left'"
        class="p-1.5 text-lg cursor-pointer"
        @click="toggleSidebar"
      />
    </div>
    <div class="float-right h-[45px] leading-[45px] text-right">
      <el-tooltip
        effect="dark"
        :content="isDark ? '白天模式' : '黑夜模式'"
        placement="bottom"
      >
        <Icon
          :name="isDark ? 'ph:sun' : 'ph:moon-stars'"
          class="p-1 ml-2 text-lg text-[var(--color-text)] cursor-pointer align-middle hover:text-[var(--color-heading)]"
          @click="toggleColorMode"
        />
      </el-tooltip>
      <el-tooltip effect="dark" content="站内搜索" placement="bottom">
        <Icon
          name="ph:magnifying-glass"
          class="p-1 ml-2 text-lg text-[var(--color-text)] cursor-pointer align-middle hover:text-[var(--color-heading)]"
          @click="searchVisible = true"
        />
      </el-tooltip>
    </div>

    <LayoutSearch
      :categories="appStore.categories"
      :search-visible="searchVisible"
      @on-close-search="searchVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
const toolsStore = useToolsStore()
const colorMode = useColorMode()

const searchVisible = ref(false)

const isCollapse = computed(() => !toolsStore.sidebar.opened)
const isDark = computed(() => colorMode.preference === 'dark')

function toggleSidebar() {
  toolsStore.toggleSidebar()
}

function toggleColorMode() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>
