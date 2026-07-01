<template>
  <div>
    <PageBanner :title="pageTitle" :background-image="bangumiB">
      <template #subtitle>
        <Hitokoto :kinds="['a', 'b', 'h']" />
      </template>
    </PageBanner>

    <el-row :gutter="20">
      <el-col v-for="item in bangumiList" :key="item.id" :xs="24" :sm="12">
        <el-row
          class="mb-[var(--grid-space)] overflow-hidden bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
        >
          <el-col class="relative" :span="10" :xl="8">
            <NuxtLink :to="`/bangumi/detail/${item.pathname || item.id}`">
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
              class="block pb-1.5 text-xl text-[var(--color-primary)]"
              :to="`/bangumi/detail/${item.pathname || item.id}`"
            >
              {{ item.title }}
            </NuxtLink>
            <p>
              <span class="text-[var(--color-secondary)]">时间：</span
              >{{ parseTime(item.updatetime, "{y}-{m}-{d}") }}
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
            <div class="min-h-6.25 mt-1.25">
              <NuxtLink
                v-for="(tag, i) in item.tag || []"
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
import bangumiB from "~/assets/image/bangumi.jpg";

const route = useRoute();
const router = useRouter();
const { fetchBangumiList } = useApi();

// 解析路由：支持新格式 /bangumi/slug/page，兼容旧格式 /bangumi/id-page
const routeSlugArray = computed(
  () => (route.params.slug as string[] | undefined) || [],
);
const routeParams = computed(() => parseListRoute(routeSlugArray.value));
const routeId = computed(() => routeParams.value.id);
const routePage = computed(() => routeParams.value.page);

const currentTag = computed(() => route.query.tags as string | undefined);
const pageTitle = computed(() =>
  currentTag.value ? `追番刷剧 - ${currentTag.value}` : "追番刷剧",
);

usePageSeo({ pageType: "list", data: { title: pageTitle.value } });

const { data } = await useAsyncData(
  () => `bangumi-list-${routeSlugArray.value.join("/")}-${JSON.stringify(route.query)}`,
  () =>
    fetchBangumiList({
      id: routeId.value,
      page: routePage.value,
      tags: route.query.tags as string | undefined,
    }).catch(() => ({ data: [], count: 0, pageSize: 10 })),
  {
    watch: [() => route.query.tags, routePage],
  },
);

const bangumiList = computed(() => data.value?.data || []);
const total = computed(() => data.value?.count || 0);
const pageSize = computed(() => data.value?.pageSize || 10);
const currentPage = computed(() => routePage.value);

function changePage(page: number) {
  router.push({
    path: buildListPath("bangumi", routeId.value, page),
    query: route.query as any,
  });
}

function onPaginate({ page }: { page: number; limit: number }) {
  changePage(page);
}
</script>
