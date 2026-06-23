<template>
  <div v-show="!hidden" class="inline-block">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :layout="pageLayout"
      :pager-count="pagerNumber"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore();

interface Props {
  total: number;
  page?: number;
  limit?: number;
  pagerCount?: number;
  pageSizes?: number[];
  isAdmin?: boolean;
  adminLayout?: string;
  webLayout?: string;
  background?: boolean;
  autoScroll?: boolean;
  hidden?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  limit: 20,
  pagerCount: 0,
  pageSizes: () => [10, 20, 30, 50, 100],
  isAdmin: true,
  adminLayout: "total, sizes, ->, prev, pager, next, jumper",
  webLayout: "total, prev, pager, next, jumper",
  background: true,
  autoScroll: true,
  hidden: false,
});

const emit = defineEmits<{
  "update:page": [val: number];
  "update:limit": [val: number];
  pagination: [data: { page: number; limit: number }];
}>();

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit("update:page", val),
});

const pageSize = computed({
  get: () => props.limit,
  set: (val) => emit("update:limit", val),
});

const pageLayout = computed(() => {
  return appStore.device === "desktop"
    ? props.isAdmin
      ? props.adminLayout
      : props.webLayout
    : "prev, pager, next";
});

const pagerNumber = computed(() => {
  if (props.pagerCount) {
    return props.pagerCount;
  }
  return appStore.device === "desktop" ? 7 : 5;
});

function handleSizeChange(val: number) {
  emit("pagination", { page: currentPage.value, limit: val });
  if (props.autoScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function handleCurrentChange(val: number) {
  emit("pagination", { page: val, limit: pageSize.value });
  if (props.autoScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
</script>

<style scoped>
.el-pagination {
  font-weight: normal;
}
</style>
