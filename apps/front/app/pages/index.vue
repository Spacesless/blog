<template>
  <div>
    <!-- 轮播图 -->
    <el-carousel
      class="banner-carousel mb-5 overflow-hidden rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
      trigger="click"
      :interval="5000"
      height="auto"
    >
      <el-carousel-item v-for="item in bannerList" :key="item.title">
        <img
          class="block w-full h-auto"
          width="1280"
          height="500"
          :src="getAbsolutePath(item.imgurl || '')"
          :srcset="getImageSrcSet(item.imgurl, 1280)"
          :alt="item.title"
        >
        <div
          class="absolute right-0 bottom-0 px-6 py-2 text-[15px] text-white bg-black/50 rounded-tl-[var(--border-radius)]"
        >
          {{ item.title }}
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- 最新文章 -->
    <div v-if="articleList?.length">
      <div class="relative">
        <h2 class="tl__title">最新文章</h2>
        <NuxtLink
          class="absolute top-8 right-0 leading-6 text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          to="/article/list"
          >more+</NuxtLink
        >
      </div>
      <el-row :gutter="20">
        <el-col v-for="item in articleList" :key="item.id" :sm="12" :lg="8">
          <div
            class="mb-[var(--grid-space)] overflow-hidden bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)] transition-all duration-300 hover:shadow-md"
          >
            <NuxtLink
              class="relative block overflow-hidden rounded-t-[var(--border-radius)] article-cover"
              :to="`/article/detail/${item.pathname || item.id}`"
              :title="item.title"
            >
              <img
                class="max-w-full h-auto"
                :src="item.imgurl"
                :srcset="getImageSrcSet(item.imgurl, 400)"
                :alt="item.title"
              >
            </NuxtLink>
            <div class="p-4">
              <p class="text-2xl">
                <NuxtLink
                  class="inline-block max-w-full overflow-hidden text-[var(--color-heading)] text-ellipsis whitespace-nowrap hover:text-[var(--color-primary)]"
                  :to="`/article/detail/${item.pathname || item.id}`"
                  :title="item.title"
                >
                  {{ item.title }}
                </NuxtLink>
              </p>
              <div class="article-meta h-7.5 py-1.5 text-sm">
                <span class="article-meta__date">
                  <i class="icon-riqi" />{{
                    parseTime(item.updatetime, "{y}-{m}-{d}")
                  }}
                </span>
                <span v-if="item.categoryName" class="article-meta__cate">
                  <i class="icon-bianqian" />
                  <NuxtLink
                    v-if="item.categoryUrl"
                    :to="item.categoryUrl"
                    :title="item.categoryName"
                  >
                    {{ item.categoryName }}
                  </NuxtLink>
                  <template v-else>{{ item.categoryName }}</template>
                </span>
                <span class="article-meta__view">
                  <i class="icon-chakan" />{{ item.hits }}
                </span>
              </div>
              <div class="h-28.5 mb-4 overflow-hidden line-clamp-4">
                <p class="text-sm leading-loose">{{ item.description }}</p>
              </div>
              <div class="article-tags h-7.5 py-1.5 text-sm">
                <NuxtLink
                  v-for="(tag, i) in item.parsedTags"
                  :key="i"
                  :to="{ path: '/article/list', query: { tags: tag } }"
                  >#{{ tag }}</NuxtLink
                >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 最近追番 -->
    <div v-if="bangumiList?.length">
      <div class="relative">
        <h2 class="tl__title">最近追番</h2>
        <NuxtLink
          class="absolute top-8 right-0 leading-6 text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          to="/bangumi/list"
          >more+</NuxtLink
        >
      </div>
      <el-row :gutter="20">
        <el-col v-for="item in bangumiList" :key="item.id" :xs="24" :sm="12">
          <el-row
            class="mb-[var(--grid-space)] overflow-hidden bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
          >
            <el-col class="relative" :span="10" :xl="8">
              <NuxtLink
                :to="`/bangumi/detail/${item.pathname || item.id}`"
                :title="item.title"
              >
                <img
                  class="max-w-full h-auto"
                  :src="item.imgurl"
                  :alt="item.title"
                >
                <span
                  class="absolute top-2 right-2 px-1.5 py-0.5 text-sm text-white bg-black/50 rounded"
                  >{{ item.ratings }}</span
                >
              </NuxtLink>
            </el-col>
            <el-col class="p-4 text-sm leading-7" :span="14" :xl="16">
              <NuxtLink
                class="block pb-1.5 text-xl font-normal text-[var(--color-primary)]"
                :to="`/bangumi/detail/${item.pathname || item.id}`"
              >
                {{ item.title }}
              </NuxtLink>
              <p>
                <span class="text-[var(--color-secondary)]">时间：</span
                >{{ item.showtime }}
              </p>
              <p>
                <span class="text-[var(--color-secondary)]">状态：</span
                >{{ bangumiStatus(item.status) }}
              </p>
              <p
                v-if="item.description"
                class="text-[var(--color-text)] line-clamp-2"
              >
                <span class="text-[var(--color-secondary)]">简介：</span
                >{{ item.description }}
              </p>
              <p>
                <span class="text-[var(--color-secondary)]">进度：</span
                >{{ item.current }}/{{ item.total }}
              </p>
              <div class="mt-2 leading-none">
                <NuxtLink
                  v-for="(tag, i) in item.parsedTags"
                  :key="i"
                  :to="{ path: '/bangumi/list', query: { tags: tag } }"
                  class="tl-tag"
                  :class="tagClassName(tag)"
                  >{{ tag }}</NuxtLink
                >
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore();
const { fetchIndex } = useApi();

const { data: pageData } = await useAsyncData("home", async () => {
  const res = await fetchIndex().catch(() => ({
    bannerList: [],
    articleList: [],
    bangumiList: [],
  }));

  const articleList = (res.articleList || []).map((item) => {
    const parsedTags = item.tag ? item.tag.split("|") : [];
    const findCategory = appStore.categories.find(
      (c) => c.id === item.category_id,
    );
    return {
      ...item,
      parsedTags,
      categoryUrl: findCategory
        ? `/${findCategory.type}/${findCategory.filename || findCategory.id}`
        : "",
      categoryName: findCategory?.name || "",
    };
  });

  const bangumiListData = (res.bangumiList || []).map((item) => ({
    ...item,
    parsedTags: item.tag ? item.tag.split("|") : [],
  }));

  return {
    bannerList: res.bannerList || [],
    articleList,
    bangumiList: bangumiListData,
  };
});

const bannerList = computed(() => pageData.value?.bannerList || []);
const articleList = computed(() => pageData.value?.articleList || []);
const bangumiList = computed(() => pageData.value?.bangumiList || []);

const configs = computed(() => appStore.configs);
useHead({
  title: configs.value?.sitename
    ? `${configs.value.sitename} - 花开成景，花落成诗`
    : "Timeless · 时光",
});
</script>

<style scoped>
.banner-carousel :deep(.el-carousel__container) {
  aspect-ratio: 1280 / 500;
  height: auto !important;
}

.article-cover::after {
  position: absolute;
  top: 13%;
  left: 0;
  z-index: 35;
  width: 100%;
  height: 120%;
  pointer-events: none;
  content: "";
  background: var(--article-cover);
}

.article-meta {
  color: var(--color-secondary);
}

.article-meta > span {
  margin-right: 10px;
}

.article-meta i {
  margin-right: 4px;
  font-size: 16px;
  vertical-align: text-bottom;
}

.article-meta a {
  color: var(--color-secondary);
}

.article-meta a:hover {
  color: var(--color-primary);
}

.article-tags > span {
  margin-right: 10px;
  color: var(--color-secondary);
}
</style>
