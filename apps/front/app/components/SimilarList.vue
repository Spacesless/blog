<template>
  <div v-if="similarList.length" class="p-[var(--grid-space)] mb-[var(--grid-space)] bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]">
    <h2 class="pb-[var(--grid-space)] text-xl font-normal text-[var(--color-heading)]">推荐阅读</h2>

    <el-row :gutter="2">
      <el-col v-for="(item, index) in similarList" :key="item.id" :md="12">
        <div class="relative pl-16 p-4 mb-0.5 bg-[var(--bg)] rounded-md">
          <span class="absolute top-1/2 left-0 w-16 -mt-6 text-4xl italic text-center">{{ index + 1 }}</span>
          <p class="pb-1.5 truncate">
            <NuxtLink class="text-[var(--color-heading)] hover:text-[var(--color-primary)]" :to="`/${categoryType}/detail/${item.pathname || item.id}`" :title="item.title">
              {{ item.title }}
            </NuxtLink>
          </p>
          <p class="h-11 overflow-hidden text-sm leading-[22px] text-[var(--color-text)] line-clamp-2">{{ item.description }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  detailId?: number
  categoryType: 'article' | 'bangumi'
  categoryId: number
  tags?: string
}>()

const similarList = ref<any[]>([])

const { fetchArticleSimilar, fetchBangumiSimilar } = useApi()

watch(
  () => props.categoryId,
  async (val) => {
    if (!val) return
    try {
      const fetcher = props.categoryType === 'article' ? fetchArticleSimilar : fetchBangumiSimilar
      const result = await fetcher({
        id: props.detailId,
        categoryId: val,
        tags: props.tags,
      })
      similarList.value = result || []
    } catch {
      similarList.value = []
    }
  },
  { immediate: true },
)
</script>
