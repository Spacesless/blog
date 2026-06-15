<template>
  <div>
    <h2
      class="py-2.5 text-3xl font-normal text-[var(--color-heading)] text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
    >
      文章笔记
    </h2>
    <Hitokoto :kinds="['k']" />

    <el-form
      class="mb-[var(--grid-space)]"
      label-width="40px"
      label-position="left"
    >
      <el-form-item label="排序">
        <el-select
          v-model="filters.sortBy"
          placeholder="排序方式"
          @change="handleSearch"
        >
          <el-option label="更新时间" value="" />
          <el-option label="发布时间" value="addtime" />
          <el-option label="浏览次数" value="hits" />
        </el-select>
        <el-radio-group
          v-model="filters.orderBy"
          class="ml-4"
          @change="handleSearch"
        >
          <el-radio-button value="">降序</el-radio-button>
          <el-radio-button value="asc">升序</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dynamicTags.length" label="标签">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          @close="handleDeleteTag(tag)"
          >{{ tag }}</el-tag
        >
      </el-form-item>
    </el-form>

    <div>
      <el-row
        v-for="(item, index) in articleList"
        :key="item.id"
        class="relative z-6 mb-30 lt-lg:mb-12 last:mb-12"
      >
        <el-col
          class="relative z-5 inline-block float-none overflow-hidden rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
          :sm="24"
          :md="14"
        >
          <NuxtLink :to="`/article/detail/${item.id}`" :title="item.title">
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
              : 'left-0 text-left rounded-l-[var(--border-radius)]'
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
              :to="`/article/detail/${item.id}`"
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
              v-for="(tag, i) in item.tag?.split('|') || []"
              :key="i"
              class="tl-tag"
              :class="tagClassName(tag)"
              @click="handleAddTag(tag)"
              >{{ tag }}</span
            >
          </div>
          <div class="mt-2.5 text-sm text-[var(--color-secondary)]">
            <span class="mr-4">{{ item.word_count }}字</span>
            <span class="mr-4">{{ item.hits }}浏览</span>
          </div>
        </el-col>
      </el-row>
    </div>

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

const paramId = computed(() => route.params.id as string);
const routeId = computed(() => {
  const [id] = paramId.value?.split("-") || [];
  return id === "list" ? null : id ? Number(id) : null;
});
const routePage = computed(() => {
  const [, page] = paramId.value?.split("-") || [];
  return Number(page) || 1;
});

const filters = ref({
  sortBy: (route.query.sortBy as string) || "",
  orderBy: (route.query.orderBy as string) || "",
  tags: (route.query.tags as string) || "",
});
const dynamicTags = ref<string[]>(
  filters.value.tags ? filters.value.tags.split(",") : []
);
const currentPage = ref(routePage.value);
const total = ref(0);
const pageSize = ref(10);
const articleList = ref<any[]>([]);

usePageSeo({ pageType: "list" });

const { data } = await useAsyncData(
  `article-list-${paramId.value}-${JSON.stringify(route.query)}`,
  () =>
    fetchArticles({
      id: routeId.value,
      page: routePage.value,
      sortBy: filters.value.sortBy || undefined,
      orderBy: filters.value.orderBy || undefined,
      tags: filters.value.tags || undefined,
    }).catch(() => ({ data: [], count: 0, pageSize: 10 }))
);

if (data.value) {
  articleList.value = data.value.data || [];
  total.value = data.value.count;
  pageSize.value = data.value.pageSize || 10;
}

function handleSearch() {
  const id = paramId.value?.split("-")[0] || "list";
  const query: Record<string, string> = {};
  if (filters.value.sortBy) query.sortBy = filters.value.sortBy;
  if (filters.value.orderBy) query.orderBy = filters.value.orderBy;
  if (filters.value.tags) query.tags = filters.value.tags;
  router.push({ path: `/article/${id}-1`, query });
}

function changePage(page: number) {
  const id = paramId.value?.split("-")[0] || "list";
  router.push({ path: `/article/${id}-${page}`, query: route.query as any });
}

function handleDeleteTag(tag: string) {
  dynamicTags.value = dynamicTags.value.filter((t) => t !== tag);
  filters.value.tags = dynamicTags.value.join(",");
  handleSearch();
}

function handleAddTag(tag: string) {
  if (dynamicTags.value.includes(tag)) return;
  dynamicTags.value.push(tag);
  filters.value.tags = dynamicTags.value.join(",");
  handleSearch();
}
</script>
