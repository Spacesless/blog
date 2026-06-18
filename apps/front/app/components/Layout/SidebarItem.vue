<template>
  <el-menu-item
    v-if="!item.children?.length"
    :index="getUrl(item)"
    :title="item.name"
  >
    <Icon
      v-if="!isNest"
      :name="getIcon(item)"
      class="w-6 mr-1.5 text-lg align-middle"
    />
    <template #title>{{ item.name }}</template>
  </el-menu-item>

  <el-sub-menu v-else :index="getUrl(item)" popper-class="aside-submenu">
    <template #title>
      <Icon
        v-if="!isNest"
        :name="getIcon(item)"
        class="w-6 mr-1.5 text-lg align-middle"
      />
      <span>{{ item.name }}</span>
    </template>
    <el-menu-item :index="getUrl(item)">
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
  // article/bangumi 是带分类列表的页面，需要 id；其余（archives/about/link）是单页
  if (item.type === "article" || item.type === "bangumi") {
    return `/${item.type}/${item.id}`;
  }
  return `/${item.type}`;
}

function getIcon(item: Category) {
  const iconMap: Record<string, string> = {
    article: "ph:article",
    bangumi: "ph:television",
    archives: "ph:archive",
    about: "ph:info",
    link: "ph:link",
  };
  return iconMap[item.type] || "ph:folder";
}

function getAliasName(type: string) {
  const names = new Map([
    ["article", "全部文章"],
    ["bangumi", "全部追剧"],
  ]);
  return names.get(type) || "全部";
}
</script>
