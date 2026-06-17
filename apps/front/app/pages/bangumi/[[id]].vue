<template>
  <div>
    <h2
      class="py-2.5 text-3xl font-normal text-[var(--color-heading)] text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
    >
      追番刷剧
    </h2>
    <Hitokoto :kinds="['a', 'b', 'h']" />

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
          <el-option label="追番时间" value="" />
          <el-option label="放映时间" value="showtime" />
          <el-option label="推荐指数" value="ratings" />
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
      <el-form-item label="状态">
        <el-radio-group v-model="filters.status" @change="handleSearch">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button value="0">未上映</el-radio-button>
          <el-radio-button value="1">连载中</el-radio-button>
          <el-radio-button value="2">已完结</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="进度">
        <el-radio-group v-model="filters.progress" @change="handleSearch">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button value="0">在看</el-radio-button>
          <el-radio-button value="1">看过</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dynamicTags.length" label="标签">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          @close="handleDeleteTag(tag)"
        >
          {{ tag }}
        </el-tag>
      </el-form-item>
    </el-form>

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
                @click="handleAddTag(tag)"
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

const filters = ref({
  sortBy: (route.query.sortBy as string) || "",
  orderBy: (route.query.orderBy as string) || "",
  status: (route.query.status as string) || "",
  progress: (route.query.progress as string) || "",
  tags: (route.query.tags as string) || "",
});
const dynamicTags = ref<string[]>(
  filters.value.tags ? filters.value.tags.split(",") : []
);
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
      sortBy: filters.value.sortBy || undefined,
      orderBy: filters.value.orderBy || undefined,
      status: filters.value.status || undefined,
      progress: filters.value.progress || undefined,
      tags: filters.value.tags || undefined,
    }).catch(() => ({ data: [], count: 0, pageSize: 10 }))
);

if (data.value) {
  bangumiList.value = data.value.data || [];
  total.value = data.value.count;
  pageSize.value = data.value.pageSize || 10;
}

function handleSearch() {
  const id = paramId.value?.split("-")[0] || "list";
  const query: Record<string, string> = {};
  if (filters.value.sortBy) query.sortBy = filters.value.sortBy;
  if (filters.value.orderBy) query.orderBy = filters.value.orderBy;
  if (filters.value.status) query.status = filters.value.status;
  if (filters.value.progress) query.progress = filters.value.progress;
  if (filters.value.tags) query.tags = filters.value.tags;
  router.push({ path: `/bangumi/${id}-1`, query });
}

function changePage(page: number) {
  const id = paramId.value?.split("-")[0] || "list";
  router.push({ path: `/bangumi/${id}-${page}`, query: route.query as any });
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
