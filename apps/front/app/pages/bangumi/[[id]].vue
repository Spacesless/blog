<template>
  <div>
    <div
      class="relative mb-[var(--grid-space)] flex flex-col items-center justify-center overflow-hidden rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)] bg-cover bg-center text-center"
      :style="{ backgroundImage: `url(${bannerImg})` }"
      style="min-height: 220px"
    >
      <div class="absolute inset-0 bg-black/40" />
      <h2
        class="relative z-1 py-2.5 text-3xl font-normal text-white text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
      >
        追番刷剧
      </h2>
      <div class="relative z-1 px-4 text-white [&_span]:text-white/90">
        <Hitokoto :kinds="['a', 'b', 'h']" />
      </div>
    </div>

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
              />
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
            <p>
              <span class="text-[var(--color-secondary)]">进度：</span
              >{{ item.current }}/{{ item.total }}
            </p>
            <div class="mt-2">
              <span
                v-for="(tag, i) in item.tag?.split('|') || []"
                :key="i"
                class="tl-tag"
                :class="tagClassName(tag)"
                >{{ tag }}</span
              >
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <div v-if="total > 0" class="py-[var(--grid-space)] text-center">
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        :page-size="pageSize"
        layout="prev, pager, next"
        background
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { fetchBangumiList } = useApi();

const paramId = computed(() => route.params.id as string);
const routeId = computed(() => {
  const [id] = paramId.value?.split("-") || [];
  return id === "list" ? null : id ? Number(id) : null;
});
const routePage = computed(() => {
  const [, page] = paramId.value?.split("-") || [];
  return Number(page) || 1;
});

const bannerImg = "/background.png";

const currentPage = ref(routePage.value);
const total = ref(0);
const pageSize = ref(10);
const bangumiList = ref<any[]>([]);

usePageSeo({ pageType: "list" });

const { data } = await useAsyncData(
  `bangumi-list-${paramId.value}-${JSON.stringify(route.query)}`,
  () =>
    fetchBangumiList({
      id: routeId.value,
      page: routePage.value,
    }).catch(() => ({ data: [], count: 0, pageSize: 10 })),
);

if (data.value) {
  bangumiList.value = data.value.data || [];
  total.value = data.value.count;
  pageSize.value = data.value.pageSize || 10;
}

function changePage(page: number) {
  const id = paramId.value?.split("-")[0] || "list";
  router.push({ path: `/bangumi/${id}-${page}`, query: route.query as any });
}
</script>
