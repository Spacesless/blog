<template>
  <div class="archive">
    <h2 class="tl__title">
      归档
    </h2>
    <div class="hitokoto">
      <span class="hitokoto__title">
        目前共计 {{ archiveList.length }} 篇文章，不错哟~ 继续努力
      </span>
    </div>

    <div class="archive-list">
      <template v-for="y in formatList">
        <h2 :key="y.year" class="archive-item archive-item-header">
          {{ y.year }}年
        </h2>
        <template v-for="m in y.children">
          <h3 :key="m.month" class="archive-item archive-item-section">
            {{ +m.month }}月
          </h3>
          <article v-for="item in m.children" :key="item.updatetime" class="archive-item archive-item-normal">
            <span class="archive-item__time">{{ item.date }}</span>
            <nuxt-link class="archive-item__meta" :to="item.categoryUrl" :title="item.categoryName">
              {{ item.categoryName }}
            </nuxt-link>
            <nuxt-link class="archive-item__title" :to="'/article/detail/' + item.id" :title="item.title">
              {{ item.title }}
            </nuxt-link>
          </article>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { pageMeta } from '@/mixins'
import { parseTime } from '#/utils'

export default {
  name: 'ArchiveList',
  mixins: [pageMeta],
  async asyncData ({ $axios, store }) {
    const data = await $axios.$get('/archives/list')
    const archiveList = data || []

    archiveList.forEach((element) => {
      const findCategory = store.getters.categories.find(item => item.id === element.category_id)
      if (findCategory) {
        element.categoryUrl = `/${findCategory.type}/${findCategory.id}`
        element.categoryName = findCategory.name
      }
    })

    return {
      archiveList
    }
  },
  data () {
    return {
      archiveList: []
    }
  },
  computed: {
    formatList () {
      const temp = {}
      this.archiveList.forEach((item) => {
        const updatetime = parseTime(item.updatetime, '{y}-{m}-{d}')
        const [year, month, date] = updatetime.split('-')
        item = { ...item, year, month, date: month + '-' + date }

        if (temp[year]) {
          if (temp[year][month]) {
            temp[year][month].push(item)
          } else {
            temp[year][month] = [item]
          }
        } else {
          temp[year] = {
            [month]: [item]
          }
        }
      })
      const result = Object.values(temp).map((item) => {
        const monthGroup = Object.values(item)
        return {
          year: monthGroup[0][0].year,
          children: monthGroup.map((child) => {
            return {
              month: child[0].month,
              children: child
            }
          }).sort((a, b) => b.month - a.month)
        }
      }).sort((a, b) => b.year - a.year)

      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.archive {
  &-list {
    padding-bottom: $grid-space;
    padding-left: $grid-space;
  }

  &-item {
    position: relative;
    padding: 16px 32px;
    font-weight: normal;
    color: var(--color-heading);

    &::before {
      position: absolute;
      top: 26px;
      left: 0;
      z-index: 1;
      width: 10px;
      height: 10px;
      content: '';
      background: #FFFFFF;
      border: 2px solid #1890FF;
      border-radius: 50%;
    }

    &::after {
      position: absolute;
      top: 36px;
      bottom: -25px;
      left: 6px;
      content: '';
      border-left: 2px solid var(--border-color);
    }

    &-header {
      font-size: 28px;
      line-height: 30px;
    }

    &-section {
      padding: 12px 32px;
      font-size: 24px;
      line-height: 26px;

      &::before {
        top: 20px;
        width: 8px;
        height: 8px;
        margin-left: 1px;
      }

      &::after {
        top: 20px;
      }
    }

    &-normal {
      padding: 10px 32px;

      &::before {
        top: 18px;
        width: 4px;
        height: 4px;
        margin-left: 3px;
        background: #1890FF;
      }

      &::after {
        top: 24px;
      }
    }

    &:last-child::after {
      display: none;
    }

    &__time {
      margin-right: 4px;
      color: var(--color-text);
    }

    &__meta {
      margin-right: 4px;
      font-size: 15px;
      color: var(--color-secondary);
    }

    &__title {
      color: var(--color-text);
    }

    &__meta,
    &__title {
      &:hover {
        color: $--color-primary;
      }
    }
  }
}
</style>
