<template>
  <div>
    <div
      class="relative mb-[var(--grid-space)] flex flex-col items-center justify-center overflow-hidden rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)] bg-cover bg-center text-center"
      :style="{ backgroundImage: `url(${bannerImg})` }"
      style="min-height: 220px"
    >
      <div class="absolute inset-0 bg-black/40" />
      <h2
        class="relative z-1 py-2.5 text-3xl font-normal text-white text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
      >
        文章归档
      </h2>
      <div
        class="relative z-1 px-4 text-[15px] text-white/90 text-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
      >
        目前共计 {{ archiveList.length }} 篇文章，不错哟~ 继续努力
      </div>
    </div>

    <div
      class="mb-[var(--grid-space)] bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]"
    >
      <div class="timeline relative px-6 py-5 lt-sm:px-4">
        <template v-for="y in formatList" :key="y.year">
          <div class="node node--year">
            <span class="year-badge">{{ y.year }}</span>
            <span class="ml-2 text-sm text-[var(--color-secondary)]"
              >{{ y.count }} 篇</span
            >
          </div>
          <template v-for="m in y.children" :key="m.month">
            <div class="node node--month">
              <span class="text-lg font-medium text-[var(--color-heading)]"
                >{{ +m.month }} 月</span
              >
            </div>
            <article
              v-for="item in m.children"
              :key="item.id"
              class="node node--post group"
            >
              <span class="date-pill">{{ item.date }}</span>
              <NuxtLink
                v-if="item.categoryUrl"
                class="category-tag"
                :to="item.categoryUrl"
              >
                {{ item.categoryName }}
              </NuxtLink>
              <NuxtLink
                class="post-title"
                :to="`/article/detail/${item.pathname || item.id}`"
              >
                {{ item.title }}
              </NuxtLink>
            </article>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore();
const { fetchArchives } = useApi();

usePageSeo({ pageType: "page", pageName: "归档" });

const bannerImg = "/background.png";

const { data } = await useAsyncData("archives", async () => {
  const list = await fetchArchives().catch(() => []);
  return list.map((item) => {
    const findCategory = appStore.categories.find(
      (c) => c.id === item.category_id,
    );
    return {
      ...item,
      categoryUrl: findCategory
        ? `/${findCategory.type}/${findCategory.id}`
        : "",
      categoryName: findCategory?.name || "",
    };
  });
});

const archiveList = computed(() => data.value || []);

const formatList = computed(() => {
  const temp: Record<string, Record<string, any[]>> = {};
  archiveList.value.forEach((item) => {
    const dateStr = parseTime(item.updatetime, "{y}-{m}-{d}");
    const [year, month, date] = dateStr.split("-");
    const entry = { ...item, year, month, date: `${month}-${date}` };

    if (!temp[year]) temp[year] = {};
    if (!temp[year][month]) temp[year][month] = [];
    temp[year][month].push(entry);
  });

  return Object.entries(temp)
    .map(([year, months]) => ({
      year,
      count: Object.values(months).reduce((s, arr) => s + arr.length, 0),
      children: Object.entries(months)
        .map(([month, children]) => ({ month, children }))
        .sort((a, b) => Number(b.month) - Number(a.month)),
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));
});
</script>

<style scoped>
/* 贯穿时间线竖线，中心 x = 8px（相对内边距起点） */
.timeline::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(1.5rem + 7px);
  width: 2px;
  content: "";
  background: var(--border-color);
}
.lt-sm .timeline::before {
  left: calc(1rem + 7px);
}

.node {
  position: relative;
  padding-left: 28px;
}
.node::before {
  position: absolute;
  left: 0;
  z-index: 1;
  content: "";
  border-radius: 50%;
}

/* 年份节点 */
.node--year {
  margin-top: 22px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}
.node--year:first-child {
  margin-top: 0;
}
.node--year::before {
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  margin-left: -7px;
  background: var(--color-primary);
  box-shadow:
    0 0 0 4px var(--bg-normal),
    0 0 0 5px var(--border-color);
}
.year-badge {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

/* 月份节点 */
.node--month {
  margin-top: 14px;
  margin-bottom: 4px;
}
.node--month::before {
  top: 9px;
  width: 10px;
  height: 10px;
  margin-left: -4px;
  background: var(--bg-normal);
  border: 2px solid var(--color-primary);
}

/* 文章节点 */
.node--post {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: var(--border-radius);
  transition:
    background 0.25s,
    transform 0.25s;
}
.node--post::before {
  top: 50%;
  width: 8px;
  height: 8px;
  margin-top: -4px;
  margin-left: -3px;
  background: var(--bg-normal);
  border: 2px solid var(--border-color);
  transition:
    border-color 0.25s,
    transform 0.25s;
}
.node--post:hover {
  background: var(--bg);
  transform: translateX(4px);
}
.node--post:hover::before {
  border-color: var(--color-primary);
  transform: scale(1.25);
}

.date-pill {
  flex-shrink: 0;
  padding: 1px 8px;
  font-size: 13px;
  color: var(--color-secondary);
  background: var(--bg);
  border-radius: 999px;
}
.category-tag {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--color-secondary);
  transition: color 0.25s;
}
.category-tag:hover {
  color: var(--color-primary);
}
.post-title {
  color: var(--color-text);
  transition: color 0.25s;
}
.group:hover .post-title {
  color: var(--color-primary);
}
</style>
