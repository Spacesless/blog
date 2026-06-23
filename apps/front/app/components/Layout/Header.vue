<template>
  <div
    class="fixed top-0 right-0 z-1000 box-border px-4 transition-[width] duration-300"
    :class="[
      isMobile
        ? 'w-full z-998 h-[45px] flex items-center bg-[var(--bg-normal)] shadow-md'
        : isCollapse
          ? 'w-[calc(100%-64px)]'
          : 'w-[calc(100%-var(--aside-width))]',
    ]"
  >
    <div v-if="isMobile" class="flex items-center gap-1">
      <NuxtLink to="/">
        <img
          class="rounded-full"
          src="/avatar.jpg"
          width="36"
          height="36"
          alt="logo"
        >
      </NuxtLink>
      <i
        class="p-1.5 text-lg cursor-pointer"
        :class="isCollapse ? 'icon-xiangyouzhankai' : 'icon-xiangzuoshouqi'"
        @click="toggleSidebar"
      />
    </div>
    <div class="flex items-center justify-end h-[45px] ml-auto gap-2">
      <ClientOnly>
        <el-tooltip
          effect="dark"
          :content="isDark ? '白天模式' : '黑夜模式'"
          placement="bottom"
        >
          <i
            :class="isDark ? 'icon-qingtian' : 'icon-moon'"
            class="p-1 text-lg text-[var(--color-text)] cursor-pointer align-middle hover:text-[var(--color-heading)]"
            @click="toggleColorMode"
          />
        </el-tooltip>
      </ClientOnly>
      <el-tooltip effect="dark" content="站内搜索" placement="bottom">
        <Icon
          name="ph:magnifying-glass"
          class="p-1 text-lg text-[var(--color-text)] cursor-pointer align-middle hover:text-[var(--color-heading)]"
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
const appStore = useAppStore();
const toolsStore = useToolsStore();
const colorMode = useColorMode();

const { device } = storeToRefs(appStore);
const { sidebar } = storeToRefs(toolsStore);

const searchVisible = ref(false);

const isMobile = computed(() => device.value === 'mobile');
const isCollapse = computed(() => !sidebar.value.opened);
const isDark = computed(() => colorMode.value === "dark");

function toggleSidebar() {
  toolsStore.toggleSidebar();
}

function toggleColorMode() {
  colorMode.preference = isDark.value ? "light" : "dark";
}
</script>
