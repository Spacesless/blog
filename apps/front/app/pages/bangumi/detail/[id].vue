<template>
  <div>
    <div
      class="bangumi-banner relative mb-[var(--grid-space)] overflow-hidden rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
    >
      <!-- 毛玻璃背景层 -->
      <div
        class="absolute inset-0 bg-cover bg-center scale-110 blur-2xl"
        :style="{ backgroundImage: `url(${getAbsolutePath(data?.imgurl || '')})` }"
      />
      <div class="absolute inset-0 bg-black/45" />

      <!-- 内容层 -->
      <div
        class="relative z-10 h-full flex items-center gap-[var(--grid-space)] p-[var(--grid-space)] lt-sm:flex-col lt-sm:items-stretch"
      >
        <div
          class="flex-shrink-0 w-60 overflow-hidden rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)] lt-sm:w-full lt-sm:max-w-50 lt-sm:mx-auto"
        >
          <img
            class="block w-full h-auto"
            :src="getAbsolutePath(data?.imgurl || '')"
            :alt="data?.title"
          >
        </div>
        <div class="flex-1 min-w-0 text-sm leading-7 text-white">
          <h1 class="pt-4 pb-4 text-[36px] text-white">
            {{ data?.title }}
          </h1>
          <div class="mb-1.5 flex items-center">
            <span class="text-white/85">推荐指数：</span>
            <el-rate
              :model-value="(data?.ratings || 0) / 2"
              disabled
              show-score
              :allow-half="true"
              text-color="#fff"
              :score-template="`${data?.ratings || 0}`"
            />
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="(tag, i) in tags"
              :key="i"
              class="tl-tag"
              :class="tagClassName(tag)"
              >{{ tag }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="mb-[var(--grid-space)] bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
    >
      <div class="flex lt-xl:flex-col">
        <div id="js-content" class="flex-1 min-w-0 overflow-hidden markup p-[var(--grid-space)]">
          <h2>简介</h2>
          <p class="mb-1.5 tracking-wider">
            <span class="text-[var(--color-secondary)]">放映时间：</span
            >{{ data?.showtime }}
          </p>
          <p class="mb-1.5 tracking-wider">
            <span class="text-[var(--color-secondary)]">追番时间：</span
            >{{ parseTime(data?.updatetime || "", "{y}-{m}-{d}") }}
          </p>
          <p class="mb-1.5 tracking-wider">
            <span class="text-[var(--color-secondary)]">状态：</span
            >{{ bangumiStatus(data?.status || 0) }}
          </p>
          <p class="mb-1.5 tracking-wider">
            <span class="text-[var(--color-secondary)]">简介：</span
            >{{ data?.description }}
          </p>
          <p class="mb-1.5 tracking-wider">
            <span class="text-[var(--color-secondary)]">进度：</span
            >{{ data?.current }}/{{ data?.total }}
          </p>
          <h2>短评</h2>
          <div v-if="hasContent" v-html="data?.content" />
          <p v-else>光顾着看了，啥也没留下，去其他地方看看吧~</p>
        </div>
        <Catalog v-if="isLoaded" class="flex-shrink-0 lt-xl:p-[var(--grid-space)]" />
      </div>
      <Share
        :title="data?.title"
        :cover="data?.imgurl"
        :description="data?.description"
      />
    </div>

    <ImageViewer v-if="isLoaded" />
    <SimilarList
      category-type="bangumi"
      :category-id="data?.category_id || 0"
      :tags="data?.tag"
    />
    <WalineComment reaction-title="你觉得这部番剧怎么样？" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { fetchBangumiDetail } = useApi();

const idOrSlug = route.params.id as string;
const isLoaded = ref(false);

const { data } = await useAsyncData(`bangumi-detail-${idOrSlug}`, () =>
  fetchBangumiDetail(idOrSlug).catch(() => null)
);

usePageSeo({
  pageType: "detail",
  data: data.value
    ? {
        title: data.value.title,
        description: data.value.description,
        category_id: data.value.category_id,
      }
    : undefined,
});

const tags = computed(() => data.value?.tag?.split("|") || []);
const hasContent = computed(
  () => (data.value?.content?.trim().length || 0) > 0
);

onMounted(() => {
  nextTick(() => {
    isLoaded.value = true;
  });
});
</script>

<style scoped>
.bangumi-banner {
  aspect-ratio: 1280 / 500;
}

@media (max-width: 640px) {
  .bangumi-banner {
    aspect-ratio: auto;
  }
}
</style>
