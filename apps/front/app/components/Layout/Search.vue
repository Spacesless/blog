<template>
  <el-drawer
    title="站内搜索"
    class="search-drawer"
    :append-to-body="true"
    direction="ttb"
    :model-value="searchVisible"
    size="100%"
    @close="onClose"
  >
    <div>
      <div class="max-w-1200px mx-auto flex gap-4">
        <el-select v-model="listQuery.classify" size="large" class="!w-60">
          <el-option
            v-for="item in classifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="relative flex-1">
          <el-input
            ref="searchKeywordRef"
            v-model="listQuery.keyword"
            size="large"
            placeholder="请输入关键字"
            @keyup.enter="handleSearch"
          />
          <Icon
            name="ph:magnifying-glass"
            class="absolute top-1/2 right-2 -translate-y-1/2 text-lg cursor-pointer hover:text-[var(--color-primary)]"
            @click="handleSearch"
          />
        </div>
      </div>
      <div class="max-w-1200px mx-auto mt-[var(--grid-space)] px-4">
        <p class="inline-block text-base">
          <strong>热门搜索：</strong>
        </p>
        <a
          class="inline-block px-4 py-1.5 mx-2 text-xs text-[var(--color-primary)] cursor-pointer bg-[var(--menu-active)] rounded-2xl"
          @click="handleSearchHot('web')"
          >web</a
        >
        <a
          class="inline-block px-4 py-1.5 mx-2 text-xs text-[var(--color-primary)] cursor-pointer bg-[var(--menu-active)] rounded-2xl"
          @click="handleSearchHot('Api')"
          >Api</a
        >
        <a
          class="inline-block px-4 py-1.5 mx-2 text-xs text-[var(--color-primary)] cursor-pointer bg-[var(--menu-active)] rounded-2xl"
          @click="handleSearchHot('徒步')"
          >徒步</a
        >
      </div>

      <div v-loading="fetchLoading" class="max-w-1200px mx-auto my-4 px-4">
        <h3 class="py-4 text-[22px] font-normal text-center">
          <template v-if="total">
            检索到包含 {{ resultInfo.keyword }} 的{{ resultInfo.classify }}
            {{ total }} 篇
          </template>
          <template v-else>啥也没找着</template>
        </h3>
        <div>
          <ul v-for="(item, index) in searchList" :key="index">
            <li
              class="relative min-h-12 pl-22 pr-4 py-3 mb-0.5 bg-[var(--bg)] rounded-[var(--border-radius)]"
            >
              <span
                class="absolute top-1/2 left-0 w-22 -mt-6 text-4xl italic text-center"
                >{{ index + 1 + (listQuery.page - 1) * 10 }}</span
              >
              <NuxtLink
                class="text-lg text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                :to="item.url"
                @click="onClose"
              >
                <span v-html="highlightKeyword(item.title)" />
              </NuxtLink>
              <span v-if="item.categoryUrl" class="text-sm">
                <span class="mx-2 text-[var(--color-secondary)]">-</span>
                <NuxtLink
                  class="text-[var(--color-secondary)]"
                  :to="item.categoryUrl"
                  @click="onClose"
                >
                  {{ item.categoryName }}
                </NuxtLink>
              </span>
              <p
                class="pt-1.5 text-sm leading-relaxed text-[var(--color-text)]"
                v-html="highlightKeyword(item.content)"
              />
            </li>
          </ul>
          <div v-if="!searchList.length" class="search-list__placeholder" />
        </div>
        <div v-if="total > 0" class="py-[var(--grid-space)] text-center">
          <Pagination
            :is-admin="false"
            :total="total"
            :page="listQuery.page"
            :limit="10"
            :auto-scroll="false"
            @pagination="onPaginate"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import type { Category } from "~/types";

const props = defineProps<{
  categories: Category[];
  searchVisible: boolean;
}>();

const emit = defineEmits<{
  onCloseSearch: [];
}>();

const { searchContent } = useApi();

const classifyOptions = [
  { value: "", label: "全部" },
  { value: "article", label: "文章" },
  { value: "bangumi", label: "番剧" },
];

const searchKeywordRef = ref();
const listQuery = ref({
  page: 1,
  classify: "",
  keyword: "",
});
const searchList = ref<any[]>([]);
const resultInfo = ref<{ keyword: string; classify: string }>({
  keyword: "",
  classify: "",
});
const total = ref(0);
const fetchLoading = ref(false);

watch(
  () => props.searchVisible,
  (isShow) => {
    if (isShow) {
      setTimeout(() => searchKeywordRef.value?.focus(), 0);
    }
  },
  { immediate: true },
);

async function fetchList() {
  fetchLoading.value = true;
  try {
    const res = await searchContent({
      keyword: listQuery.value.keyword,
      classify: listQuery.value.classify,
      page: listQuery.value.page,
    });

    total.value = res.count || 0;
    searchList.value = (res.data || []).map((item: any) => {
      const url = `/${item.type}/detail/${item.pathname || item.id}`;
      const findCategory = props.categories.find(
        (c) => c.id === item.category_id,
      );
      return {
        ...item,
        url,
        categoryUrl: findCategory
          ? `/${findCategory.type}/${findCategory.filename || findCategory.id}`
          : "",
        categoryName: findCategory?.name || "",
      };
    });

    const findClassify = classifyOptions.find(
      (item) => item.value === listQuery.value.classify,
    );
    resultInfo.value = {
      keyword: listQuery.value.keyword,
      classify: findClassify ? findClassify.label : "内容",
    };
  } catch {
    total.value = 0;
    searchList.value = [];
  } finally {
    fetchLoading.value = false;
  }
}

function handleSearch() {
  listQuery.value.page = 1;
  fetchList();
}

function handleSearchHot(keyword: string) {
  listQuery.value.keyword = keyword;
  listQuery.value.classify = "";
  handleSearch();
}

function onClose() {
  emit("onCloseSearch");
}

function highlightKeyword(str: string) {
  const keyword = resultInfo.value.keyword;
  if (!keyword) return str || "";
  const reg = new RegExp(keyword, "gi");
  return (str || "").replace(
    reg,
    (arg: string) => `<span class="text-red-500">${arg}</span>`,
  );
}
</script>

<style>
.search-drawer {
  background-color: var(--bg-normal);
}
.search-drawer .el-drawer__header {
  color: var(--color-heading);
}

.search-list__placeholder {
  margin-top: 32px;
  height: 320px;
  background: url("~/assets/image/empty.png") no-repeat center;
  background-size: contain;
}

/* 暗色模式下 Element Plus 组件适配 */
html.dark .search-drawer .el-input__wrapper,
html.dark .search-drawer .el-textarea__inner {
  background-color: var(--bg);
  box-shadow: 0 0 0 1px var(--border-color) inset;
}

html.dark .search-drawer .el-select__wrapper {
  background-color: var(--bg);
  box-shadow: 0 0 0 1px var(--border-color) inset;
}
</style>
