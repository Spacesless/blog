<template>
  <div>
    <PageBanner title="文章笔记" :background-image="articleBg">
      <template #subtitle>
        <Hitokoto :kinds="['k']" />
      </template>
    </PageBanner>

    <div>
      <el-row
        v-for="(item, index) in articleList"
        :key="item.id"
        class="relative z-6 mb-30 lt-lg:mb-12 last:mb-12"
        :class="index % 2 === 1 ? 'md:flex-row-reverse' : ''"
      >
        <el-col
          class="relative z-5 overflow-hidden rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
          :sm="24"
          :md="14"
        >
          <NuxtLink
            :to="`/article/detail/${item.pathname || item.id}`"
            :title="item.title"
          >
            <img
              class="block w-full h-auto"
              :src="item.imgurl"
              :srcset="getImageSrcSet(item.imgurl, 600)"
              :alt="item.title"
            >
          </NuxtLink>
        </el-col>
        <el-col
          class="absolute top-[6%] bottom-[6%] p-[5%] bg-[var(--bg-normal)] shadow-[var(--shadow-3-right)] lt-lg:(static h-auto rounded-[var(--border-radius)])"
          :class="
            index % 2 === 0
              ? 'right-0 rounded-r-[var(--border-radius)]'
              : 'left-0 rounded-l-[var(--border-radius)]'
          "
          :sm="24"
          :md="10"
        >
          <p class="text-sm text-[var(--color-secondary)]">
            {{ formatDate(item.updatetime) }}
          </p>
          <div
            class="h-13 mt-2 overflow-hidden text-2xl leading-[26px] line-clamp-2"
          >
            <NuxtLink
              class="text-[var(--color-heading)] hover:text-[var(--color-primary)]"
              :to="`/article/detail/${item.pathname || item.id}`"
            >
              {{ item.title }}
            </NuxtLink>
          </div>
          <p
            class="h-16.5 mt-2 overflow-hidden text-[15px] leading-[22px] text-[var(--color-text)] line-clamp-3"
          >
            {{ item.description }}
          </p>
          <div class="min-h-6.25 mt-1.25">
            <span
              v-for="(tag, i) in item.tag || []"
              :key="i"
              class="tl-tag"
              :class="tagClassName(tag)"
              >{{ tag }}</span
            >
          </div>
          <div
            class="article-stuff mt-2.5 text-sm text-[var(--color-secondary)]"
          >
            <span><i class="icon-wenzi" />{{ item.word_count }}</span>
            <span><i class="icon-chakan" />{{ item.hits }}</span>
          </div>
        </el-col>
      </el-row>
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

const currentPage = ref(routePage.value);
const total = ref(0);
const pageSize = ref(10);
const articleList = ref<any[]>([]);

usePageSeo({ pageType: "list" });

const { data } = await useAsyncData(
  `article-list-${routeSlugArray.value.join("/")}-${JSON.stringify(route.query)}`,
  () =>
    fetchArticles({
      id: routeId.value,
      page: routePage.value,
    }).catch(() => ({ data: [], count: 0, pageSize: 10 })),
);

if (data.value) {
  articleList.value = data.value.data || [];
  total.value = data.value.count;
  pageSize.value = data.value.pageSize || 10;
}

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
