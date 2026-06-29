<template>
  <div ref="containerRef" class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper" :wrap-style="{ display: 'flex' }">
      <NuxtLink
        v-for="tag in tagsView.visitedViews"
        :key="tag.path"
        :to="tag.fullPath"
        :class="['tags-view-item', { active: isActive(tag.path) }]"
        @click.middle="!tag.affix && closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
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
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!selectedTag.affix" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import type { TagViewItem } from '~/stores/tagsView'

const tagsView = useTagsViewStore()
const route = useRoute()
const router = useRouter()

const containerRef = ref<HTMLElement>()
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagViewItem>({} as TagViewItem)

watch(
  () => route.path,
  () => {
    if (route.path.startsWith('/redirect')) return
    tagsView.addView(route as any)
  },
  { immediate: true },
)

watch(visible, (value) => {
  if (value) document.body.addEventListener('click', closeMenu)
  else document.body.removeEventListener('click', closeMenu)
})

function isActive(path: string) {
  return path === route.path
}

function closeSelectedTag(tag: TagViewItem) {
  tagsView.delView(tag)
  if (isActive(tag.path)) toLastView(tag)
}

function toLastView(view: TagViewItem) {
  const latest = tagsView.visitedViews[tagsView.visitedViews.length - 1]
  if (latest) router.push(latest.fullPath)
  else router.push('/')
}

async function refreshSelectedTag(view: TagViewItem) {
  await tagsView.delCachedView(view)
  await nextTick()
  router.replace('/redirect' + view.fullPath)
}

function closeOthersTags() {
  router.push(selectedTag.value.fullPath)
  tagsView.delOthersViews(selectedTag.value)
}

function closeAllTags(view: TagViewItem) {
  tagsView.delAllViews()
  if (tagsView.visitedViews.some(tag => tag.path === view.path)) return
  toLastView(view)
}

function openMenu(tag: TagViewItem, e: MouseEvent) {
  const menuMinWidth = 105
  const offsetLeft = containerRef.value!.getBoundingClientRect().left
  const offsetWidth = containerRef.value!.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  const clickLeft = e.clientX - offsetLeft + 15
  left.value = clickLeft > maxLeft ? maxLeft : clickLeft
  top.value = e.clientY - 30
  visible.value = true
  selectedTag.value = tag
}

function closeMenu() {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  position: relative;
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

  .contextmenu {
    position: absolute;
    z-index: 3000;
    padding: 5px 0;
    margin: 0;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    list-style-type: none;
    background: #fff;
    border-radius: 4px;
    box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);
    transform: translateX(-50%);

    li {
      padding: 7px 16px;
      margin: 0;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
