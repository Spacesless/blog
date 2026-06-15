<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper" :wrap-style="{ display: 'flex' }">
      <NuxtLink
        v-for="tag in tagsView.visitedViews"
        :key="tag.path"
        :to="tag.fullPath"
        :class="['tags-view-item', { active: isActive(tag.path) }]"
      >
        {{ tag.title }}
        <el-icon
          v-if="!tag.affix"
          class="tag-close-icon"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </NuxtLink>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import type { TagViewItem } from '~/stores/tagsView'

const tagsView = useTagsViewStore()
const route = useRoute()
const router = useRouter()

watch(
  () => route.path,
  () => {
    tagsView.addView(route as any)
  },
  { immediate: true },
)

function isActive(path: string) {
  return path === route.path
}

function closeSelectedTag(tag: TagViewItem) {
  tagsView.delView(tag)
  if (isActive(tag.path)) {
    const latest = tagsView.visitedViews[tagsView.visitedViews.length - 1]
    if (latest) router.push(latest.fullPath)
    else router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  background-color: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-flex;
      align-items: center;
      height: 26px;
      padding: 0 8px;
      margin: 4px 0 0 5px;
      font-size: 12px;
      color: #495060;
      cursor: pointer;
      background: #fff;
      border: 1px solid #d8dce5;

      &.active {
        color: #fff;
        background-color: #42b983;
        border-color: #42b983;

        &::before {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 2px;
          content: '';
          background: #fff;
          border-radius: 50%;
        }
      }
    }
    .tag-close-icon {
      margin-left: 4px;
      font-size: 12px;
    }
  }
}
</style>
