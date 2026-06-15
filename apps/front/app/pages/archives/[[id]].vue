<template>
  <div>
    <h2 class="py-2.5 text-3xl font-normal text-[var(--color-heading)] text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">归档</h2>
    <div class="py-2.5 pb-[var(--grid-space)] text-[15px] text-[var(--color-secondary)]">
      <span class="text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
        目前共计 {{ archiveList.length }} 篇文章，不错哟~ 继续努力
      </span>
    </div>

    <div class="pb-[var(--grid-space)] pl-[var(--grid-space)]">
      <template v-for="y in formatList" :key="y.year">
        <h2 class="archive-item relative px-8 py-4 text-3xl leading-7 font-normal text-[var(--color-heading)]">{{ y.year }}年</h2>
        <template v-for="m in y.children" :key="m.month">
          <h3 class="archive-item archive-item--section relative px-8 py-3 text-2xl leading-6 font-normal text-[var(--color-heading)]">{{ +m.month }}月</h3>
          <article v-for="item in m.children" :key="item.id" class="archive-item archive-item--normal relative px-8 py-2.5 font-normal text-[var(--color-heading)]">
            <span class="mr-1 text-[var(--color-text)]">{{ item.date }}</span>
            <NuxtLink v-if="item.categoryUrl" class="mr-1 text-[15px] text-[var(--color-secondary)] hover:text-[var(--color-primary)]" :to="item.categoryUrl">
              {{ item.categoryName }}
            </NuxtLink>
            <NuxtLink class="text-[var(--color-text)] hover:text-[var(--color-primary)]" :to="`/article/detail/${item.id}`">
              {{ item.title }}
            </NuxtLink>
          </article>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
const { fetchArchives } = useApi()

usePageSeo({ pageType: 'page', pageName: '归档' })

const { data } = await useAsyncData('archives', async () => {
  const list = await fetchArchives().catch(() => [])
  return list.map(item => {
    const findCategory = appStore.categories.find(c => c.id === item.category_id)
    return {
      ...item,
      categoryUrl: findCategory ? `/${findCategory.type}/${findCategory.id}` : '',
      categoryName: findCategory?.name || '',
    }
  })
})

const archiveList = computed(() => data.value || [])

const formatList = computed(() => {
  const temp: Record<string, Record<string, any[]>> = {}
  archiveList.value.forEach(item => {
    const dateStr = parseTime(item.updatetime, '{y}-{m}-{d}')
    const [year, month, date] = dateStr.split('-')
    const entry = { ...item, year, month, date: `${month}-${date}` }

    if (!temp[year]) temp[year] = {}
    if (!temp[year][month]) temp[year][month] = []
    temp[year][month].push(entry)
  })

  return Object.entries(temp)
    .map(([year, months]) => ({
      year,
      children: Object.entries(months)
        .map(([month, children]) => ({ month, children }))
        .sort((a, b) => Number(b.month) - Number(a.month)),
    }))
    .sort((a, b) => Number(b.year) - Number(a.year))
})
</script>

<style scoped>
.archive-item::before {
  position: absolute;
  top: 26px;
  left: 0;
  z-index: 1;
  width: 10px;
  height: 10px;
  content: '';
  background: #fff;
  border: 2px solid #1890ff;
  border-radius: 50%;
}
.archive-item::after {
  position: absolute;
  top: 36px;
  bottom: -25px;
  left: 6px;
  content: '';
  border-left: 2px solid var(--border-color);
}
.archive-item--section::before { top: 20px; width: 8px; height: 8px; margin-left: 1px; }
.archive-item--normal::before { top: 18px; width: 4px; height: 4px; margin-left: 3px; background: #1890ff; }
.archive-item:last-child::after { display: none; }
</style>
