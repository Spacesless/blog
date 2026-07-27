<template>
  <div>
    <PageBanner :title="pageTitle" :background-image="articleBg">
      <template #subtitle>
        <Hitokoto :kinds="['k']" />
      </template>
    </PageBanner>

    <!-- 文章列表循环 -->
    <div
      v-for="(item, index) in articleList"
      :key="item.id"
      class="mb-20 lt-lg:mb-12 flex flex-col lg:flex-row gap-0 relative"
      :class="index % 2 === 1 ? 'lg:flex-row-reverse' : ''"
    >
        <!-- 图片模块 栅格比例 lg:w-14/24 -->
        <div class="relative z-5 w-full lg:w-[58%] overflow-hidden rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]">
          <NuxtLink
            :to="`/article/detail/${item.pathname || item.id}`"
            :title="item.title"
          >
            <img
              class="block w-full h-auto object-cover"
              :src="item.imgurl"
              :srcset="getImageSrcSet(item.imgurl, 600)"
              :alt="item.title"
            >
          </NuxtLink>
        </div>

        <!-- 文字卡片：核心重叠自适应模块 lg:w-[41.67%] -->
        <div
          class="
            relative lt-lg:static
            lg:absolute lg:top-[6%] lg:bottom-[6%]
            lg:p-[5%] p-6
            bg-[var(--bg-normal)] shadow-[var(--shadow-3-right)]
            rounded-[var(--border-radius)]
            w-full lg:w-[calc(42%+12px)]
          "
          :class="[
            index % 2 === 0
              ? 'lg:right-0 lg:rounded-r-[var(--border-radius)]'
              : 'lg:left-0 lg:rounded-l-[var(--border-radius)]'
          ]"
        >
          <!-- w-fit-content 实现宽度自适应内容，解决留白 -->
          <div class="w-fit max-w-full">
            <p class="text-sm text-[var(--color-secondary)]">
              {{ formatDate(item.updatetime) }}
            </p>
            <div class="h-13 mt-2 overflow-hidden text-2xl leading-[26px] line-clamp-2">
              <NuxtLink
                class="text-[var(--color-heading)] hover:text-[var(--color-primary)] transition-colors"
                :to="`/article/detail/${item.pathname || item.id}`"
              >
                {{ item.title }}
              </NuxtLink>
            </div>
            <p class="h-16.5 mt-2 overflow-hidden text-[15px] leading-[22px] text-[var(--color-text)] line-clamp-3">
              {{ item.description }}
            </p>
            <div class="min-h-6.25 mt-1.25 flex flex-wrap gap-2">
              <NuxtLink
                v-for="(tag, i) in item.tag || []"
                :key="i"
                :to="{ path: '/article/list', query: { tags: tag } }"
                class="tl-tag"
                :class="tagClassName(tag)"
              >
                {{ tag }}
              </NuxtLink>
            </div>
            <div class="article-stuff mt-2.5 text-sm text-[var(--color-secondary)] flex gap-4">
              <span><i class="icon-wenzi mr-1" />{{ item.word_count }}</span>
              <span><i class="icon-chakan mr-1" />{{ item.hits }}</span>
            </div>
          </div>
        </div>
    </div>

    <div v-if="total > 0" class="py-[var(--grid-space)] text-center">
      <Pagination
        :is-admin="false"
        :total="total"
        :page="currentPage"
        :limit="pageSize"
        :auto-scroll="false"
        @pagination="onPaginate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import articleBg from "~/assets/image/article.jpg";

const route = useRoute();
const router = useRouter();
const { fetchArticles } = useApi();

const monthEnum = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];

function formatDate(time: string) {
  const d = new Date(time);
  return `${monthEnum[d.getMonth()]}月 ${d.getDate()}, ${d.getFullYear()}`;
}

// 解析路由：支持新格式 /article/slug/page，兼容旧格式 /article/id-page
const routeSlugArray = computed(
  () => (route.params.slug as string[] | undefined) || [],
);
const routeParams = computed(() => parseListRoute(routeSlugArray.value));
const routeId = computed(() => routeParams.value.id);
const routePage = computed(() => routeParams.value.page);

const currentTag = computed(() => route.query.tags as string | undefined);
const pageTitle = computed(() =>
  currentTag.value ? `文章笔记 - ${currentTag.value}` : "文章笔记",
);

usePageSeo({ pageType: "list", data: { title: pageTitle.value } });

const { data } = await useAsyncData(
  () => `article-list-${routeSlugArray.value.join("/")}-${JSON.stringify(route.query)}`,
  () =>
    fetchArticles({
      id: routeId.value,
      page: routePage.value,
      tags: route.query.tags as string | undefined,
    }).catch(() => ({ data: [], count: 0, pageSize: 10 })),
  {
    watch: [() => route.query.tags, routePage],
  },
);

const articleList = computed(() => data.value?.data || []);
const total = computed(() => data.value?.count || 0);
const pageSize = computed(() => data.value?.pageSize || 10);
const currentPage = computed(() => routePage.value);

function changePage(page: number) {
  router.push({
    path: buildListPath("article", routeId.value, page),
    query: route.query as any,
  });
}

function onPaginate({ page }: { page: number; limit: number }) {
  changePage(page);
}
</script>

<style scoped>
.article-stuff span {
  margin-right: 16px;
}

.article-stuff i {
  margin-right: 4px;
  font-size: 17px;
  vertical-align: text-bottom;
}
</style>
