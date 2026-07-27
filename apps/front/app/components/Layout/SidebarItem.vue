<template>
  <el-menu-item
    v-if="!item.children?.length"
    :index="getUrl(item)"
    :title="item.name"
  >
    <i v-if="!isNest" class="aside-menu__icon" :class="item.icon" />
    <template #title>{{ item.name }}</template>
  </el-menu-item>

  <el-sub-menu v-else :index="getUrl(item)" popper-class="aside-submenu">
    <template #title>
      <i v-if="!isNest" class="aside-menu__icon" :class="item.icon" />
      <span>{{ item.name }}</span>
    </template>
    <el-menu-item :index="getListUrl(item)">
      <span>{{ getAliasName(item.type) }}</span>
    </el-menu-item>
    <LayoutSidebarItem
      v-for="child in item.children"
      :key="child.id"
      :is-nest="true"
      :item="child"
    />
  </el-sub-menu>
</template>

<script setup lang="ts">
import type { Category } from "~/types";

defineProps<{
  item: Category & { children?: Category[] };
  isNest?: boolean;
}>();

function getUrl(item: Category) {
  // article/bangumi 是带分类列表的页面，优先使用 filename(slug)，否则用 id
  if (item.type === "article" || item.type === "bangumi") {
    return `/${item.type}/${item.filename || item.id}`;
  }
  // page 类型的页面（about、link、archives 等）使用 filename
  if (item.type === "page") {
    return `/${item.filename || item.type}`;
  }
  return `/${item.type}`;
}

// 「全部」入口：使用 list 作为 id，进入不带分类筛选的全部列表
function getListUrl(item: Category) {
  return `/${item.type}/list`;
}

function getAliasName(type: string) {
  const names = new Map([
    ["article", "全部文章"],
    ["bangumi", "全部追剧"],
  ]);
  return names.get(type) || "全部";
}
</script>

<style scoped>
.aside-menu__icon {
  display: inline-block;
  width: 24px;
  margin-right: 6px;
  font-size: 18px;
  line-height: 1;
  text-align: center;
  vertical-align: middle;
}
</style>
