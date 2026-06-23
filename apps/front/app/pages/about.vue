<template>
  <div>
    <PageBanner
      title="关于"
      subtitle="愿以一朵花的姿态行走世间。"
      extra="看得清繁华却不在心中留下痕迹，花开成景，花落成诗。"
      :background-image="aboutBg"
    />

    <div
      class="mb-[var(--grid-space)] bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
    >
      <div class="flex lt-xl:flex-col">
        <div
          id="js-content"
          class="flex-1 min-w-0 overflow-hidden markup p-[var(--grid-space)]"
          v-html="content"
        />
        <Catalog
          v-if="isLoaded"
          class="flex-shrink-0 lt-xl:p-[var(--grid-space)]"
        />
      </div>
    </div>
    <WalineComment />
    <Adsense />
  </div>
</template>

<script setup lang="ts">
import aboutBg from "~/assets/image/about.jpg";

const appStore = useAppStore();
const route = useRoute();
const { fetchCategory } = useApi();

const isLoaded = ref(false);
const content = ref("");

usePageSeo({ pageType: "page", pageName: "关于本站" });

const { data } = await useAsyncData("about", async () => {
  const findCategory = appStore.categories.find(
    (item) => item.filename && route.path.includes(item.filename),
  );
  if (findCategory) {
    const categoryData = await fetchCategory(findCategory.id).catch(() => null);
    return categoryData?.content || "";
  }
  return "";
});

content.value = data.value || "";

onMounted(() => {
  nextTick(() => {
    isLoaded.value = true;
  });
});
</script>
