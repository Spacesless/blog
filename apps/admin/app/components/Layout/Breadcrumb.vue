<template>
  <el-breadcrumb separator="/" class="app-breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ item.meta?.title }}
        </span>
        <NuxtLink v-else :to="handleLink(item)">{{ item.meta?.title }}</NuxtLink>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/config/menu'
import { menuRoutes } from '~/config/menu'

const route = useRoute()
const levelList = ref<MenuItem[]>([])

function flatten(arr: MenuItem[], acc: MenuItem[] = []): MenuItem[] {
  arr.forEach((it) => {
    acc.push(it)
    if (it.children) flatten(it.children, acc)
  })
  return acc
}

function getBreadcrumb() {
  const all = flatten(menuRoutes)
  const matched: MenuItem[] = []
  const path = route.path
  const segments = path.split('/').filter(Boolean)
  let accum = ''
  segments.forEach((seg) => {
    accum += '/' + seg
    const found = all.find(r => r.path === accum)
    if (found) matched.push(found)
  })
  levelList.value = matched
}

watch(() => route.path, getBreadcrumb, { immediate: true })

function handleLink(item: MenuItem) {
  return item.redirect || item.path
}
</script>

<style scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
}
.no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>
