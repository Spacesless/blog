<template>
  <div>
    <el-row
      class="mb-[var(--grid-space)] overflow-hidden bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
    >
      <el-col :sm="10" :lg="6">
        <div class="max-h-125 overflow-hidden">
          <img
            class="max-w-full h-auto"
            :src="getAbsolutePath(data?.imgurl || '')"
            :alt="data?.title"
          />
        </div>
      </el-col>
      <el-col :sm="14" :lg="18">
        <div class="relative px-4 text-sm leading-7">
          <h1
            class="pt-2.5 pb-1.5 text-[26px] font-thin text-[var(--color-primary)]"
          >
            {{ data?.title }}
          </h1>
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
          <div class="mb-1.5">
            <span class="text-[var(--color-secondary)]">推荐指数：</span>
            <el-rate
              :model-value="(data?.ratings || 0) / 2"
              disabled
              show-score
              :allow-half="true"
              text-color="#409eff"
              :score-template="`${data?.ratings || 0}`"
            />
          </div>
          <p class="mb-1.5 tracking-wider">
            <span class="text-[var(--color-secondary)]">简介：</span
            >{{ data?.description }}
          </p>
          <p class="mb-1.5 tracking-wider">
            <span class="text-[var(--color-secondary)]">进度：</span
            >{{ data?.current }}/{{ data?.total }}
          </p>
          <div class="mb-[var(--grid-space)]">
            <span
              v-for="(tag, i) in tags"
              :key="i"
              class="tl-tag"
              :class="tagClassName(tag)"
              >{{ tag }}</span
            >
          </div>
        </div>
      </el-col>
    </el-row>

    <div
      class="mb-[var(--grid-space)] bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
    >
      <div class="flex lt-xl:flex-col">
        <div id="js-content" class="flex-1 min-w-0 overflow-hidden markup p-[var(--grid-space)]">
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
