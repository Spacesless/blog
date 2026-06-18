<template>
  <div
    class="fixed top-4 bottom-4 z-999 w-[var(--aside-width)] overflow-hidden bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-right)] transition-[width] duration-300"
    :class="{ 'w-16!': isCollapse }"
  >
    <div class="text-center" :class="isCollapse ? 'pt-6' : 'pt-12 pb-4'">
      <NuxtLink to="/">
        <img
          class="rounded-full transition-all duration-300"
          :class="isCollapse ? 'w-12 h-12' : 'w-26 h-26'"
          src="/avatar.jpg"
          width="100"
          height="100"
          alt="logo"
        >
        <p
          class="py-2 overflow-hidden text-3xl text-[var(--color-primary)] whitespace-nowrap font-bega"
          :class="{ hidden: isCollapse }"
        >
          Timeless
        </p>
      </NuxtLink>
      <p
        class="text-[15px] text-[var(--color-secondary)] whitespace-nowrap"
        :class="{ hidden: isCollapse }"
      >
        花开成景，花落成诗
      </p>
    </div>

    <el-scrollbar
      class="h-[calc(100vh-280px)]"
      wrap-class="aside-scrollbar-wrapper"
    >
      <el-menu
        :collapse="isCollapse"
        :default-active="activeKey"
        class="h-full !border-r-0"
        router
      >
        <el-menu-item index="/">
          <Icon name="ph:house" class="w-6 mr-1.5 text-lg align-middle" />
          <template #title>首页</template>
        </el-menu-item>
        <LayoutSidebarItem
          v-for="route in menus"
          :key="route.id"
          :item="route"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "~/types";

const appStore = useAppStore();
const toolsStore = useToolsStore();
const route = useRoute();

const isCollapse = computed(() => !toolsStore.sidebar.opened);

const menus = computed<Category[]>(() => {
  const filterMenus = (appStore.categories || []).filter((item) => item.is_nav);
  return convertToTree(filterMenus);
});

const activeKey = computed(() => {
  const { path, params } = route;
  if (path.includes("detail")) {
    return appStore.activeMenu;
  }
  const paramId = params.id as string;
  const [id] = paramId?.split("-") || [];
  return id ? path.replace(paramId, id) : path;
});
</script>

<style scoped>
.hexagon {
  clip-path: polygon(50% 3%, 91% 25%, 91% 75%, 50% 97%, 9% 75%, 9% 25%);
  transition: all 0.3s;
}

.font-bega {
  font-family: Bega, sans-serif;
}
</style>
