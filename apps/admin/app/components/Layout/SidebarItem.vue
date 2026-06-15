<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item, item.children) && (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) && !item.alwaysShow">
      <NuxtLink v-if="onlyOneChild?.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <SvgIcon v-if="onlyOneChild.meta.icon || item.meta?.icon" :icon-class="(onlyOneChild.meta.icon || item.meta?.icon) as string" />
          <template #title>{{ onlyOneChild.meta.title }}</template>
        </el-menu-item>
      </NuxtLink>
    </template>

    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <SvgIcon v-if="item.meta?.icon" :icon-class="item.meta.icon" />
        <span>{{ item.meta?.title }}</span>
      </template>
      <LayoutSidebarItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/config/menu'
import { isExternal } from '~/utils/validate'

const props = withDefaults(defineProps<{
  item: MenuItem
  isNest?: boolean
  basePath?: string
}>(), { isNest: false, basePath: '' })

const onlyOneChild = ref<MenuItem | null>(null)

function hasOneShowingChild(parent: MenuItem, children: MenuItem[] = []) {
  const showingChildren = children.filter((it) => {
    if (it.hidden) return false
    onlyOneChild.value = it
    return true
  })
  if (showingChildren.length === 1) return true
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true } as any
    return true
  }
  return false
}

function resolvePath(routePath: string): string {
  if (isExternal(routePath)) return routePath
  if (isExternal(props.basePath)) return props.basePath
  if (!props.basePath) return routePath
  if (routePath.startsWith('/')) return routePath
  return `${props.basePath.replace(/\/+$/, '')}/${routePath.replace(/^\/+/, '')}`
}
</script>
