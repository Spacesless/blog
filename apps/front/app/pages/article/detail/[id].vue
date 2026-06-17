<template>
  <div>
    <el-row
      class="mb-[var(--grid-space)] overflow-hidden bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)] flex items-center lt-lg:block"
    >
      <el-col class="relative blog-cover" :sm="24" :md="12">
        <img
          class="block w-full h-auto"
          :src="data?.imgurl"
          :alt="data?.title"
        >
      </el-col>
      <el-col class="p-[var(--grid-space)]" :sm="24" :md="12">
        <h1
          class="pb-4 text-[32px] font-normal leading-[1.5] text-[var(--color-heading)]"
        >
          {{ data?.title }}
        </h1>
        <div
          class="mb-[var(--grid-space)] text-[15px] text-[var(--color-secondary)]"
        >
          <span class="mr-2.5">{{
            parseTime(data?.updatetime || "", "{y}年{m}月{d}日")
          }}</span>
          <span class="mr-2.5">阅读：{{ data?.hits }}</span>
          <span v-if="data?.word_count" class="mr-2.5"
            >字数：{{ data?.word_count }}</span
          >
          <span v-if="readDuration" class="mr-2.5"
            >阅读时长：{{ readDuration }}</span
          >
        </div>
        <p class="relative pt-3 indent-10">{{ data?.description }}</p>
      </el-col>
    </el-row>

    <div
      class="mb-[var(--grid-space)] bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
    >
      <div class="flex p-[var(--grid-space)] lt-xl:flex-col-reverse">
        <Catalog v-if="isLoaded" class="flex-shrink-0" />
        <div
          id="js-content"
          class="flex-1 min-w-0 overflow-hidden markup"
          v-html="data?.content"
        />
      </div>
      <Share
        :title="data?.title"
        :cover="data?.imgurl"
        :description="data?.description"
      />
    </div>

    <ImageViewer v-if="isLoaded" />
    <SimilarList
      :detail-id="data?.id"
      category-type="article"
      :category-id="data?.category_id || 0"
      :tags="data?.tag"
    />
    <WalineComment reaction-title="你觉得这篇文章怎么样？" />
    <Adsense />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { fetchArticleDetail, recordArticleAccess } = useApi();

const idOrSlug = route.params.id as string;
const isLoaded = ref(false);

const { data } = await useAsyncData(`article-detail-${idOrSlug}`, () =>
  fetchArticleDetail(idOrSlug).catch(() => null),
);

usePageSeo({
  pageType: "detail",
  data: data.value
    ? {
        title: data.value.title,
        keywords: data.value.keywords,
        description: data.value.description,
        category_id: data.value.category_id,
      }
    : undefined,
});

const readDuration = computed(() => {
  if (!data.value) return "";
  const averageVelocity = 8.3;
  let total = (data.value.word_count || 0) / averageVelocity;
  const imageCount = data.value.content?.match(/<img/g)?.length || 0;
  total += imageCount * 12;
  return total ? Math.ceil(total / 60) + " 分钟" : "";
});

onMounted(() => {
  nextTick(() => {
    isLoaded.value = true;
    const nuxtApp = useNuxtApp();
    nuxtApp.$prism?.highlightAll();
  });

  const timer = setTimeout(() => {
    recordArticleAccess(idOrSlug);
  }, 5000);

  onUnmounted(() => clearTimeout(timer));
});
</script>

<style scoped>
.blog-cover::after {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  pointer-events: none;
  content: "";
  background: var(--gradient-cover);
}
@media (max-width: 992px) {
  .blog-cover::after {
    display: none;
  }
}
</style>
