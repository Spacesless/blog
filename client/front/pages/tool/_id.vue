<template>
  <div class="webapp">
    <h2 class="tl__title">
      附属站
    </h2>
    <el-row class="webapp-list" :gutter="20">
      <el-col v-for="item in externalApp" :key="item.id" :sm="12" :md="8" :xl="6">
        <a class="webapp-card" :href="item.link" :title="item.name" target="_blank">
          <div class="webapp-card__header">{{ item.name }}</div>
          <div class="webapp-card__body">
            <p class="webapp-card__desc">{{ item.description }}</p>
            <p class="webapp-card__version">版本号：{{ item.version }}</p>
          </div>
        </a>
      </el-col>
    </el-row>
    <h2 class="tl__title">
      小工具
    </h2>
    <el-row class="webapp-list" :gutter="20">
      <el-col v-for="item in internalApp" :key="item.id" :sm="12" :md="8" :xl="6">
        <a class="webapp-card" :href="item.link || item.url" :title="item.name" target="_blank">
          <div class="webapp-card__header">{{ item.name }}</div>
          <div class="webapp-card__body">
            <p class="webapp-card__desc">{{ item.description }}</p>
            <p class="webapp-card__version">版本号：{{ item.version }}</p>
          </div>
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { pageMeta } from '@/mixins'

export default {
  mixins: [pageMeta],
  async asyncData ({ params, $axios }) {
    const list = await $axios.$get('/tool/list', {
      params: {
        id: params.id
      }
    })

    return {
      webappList: list
    }
  },
  data () {
    return {
      pageType: 'list',
      externalApp: [],
      internalApp: []
    }
  },
  watch: {
    webappList: {
      handler (list) {
        list.forEach((element) => {
          if (element.link) { this.externalApp.push(element) } else { this.internalApp.push(element) }
        })
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.webapp {
  &-card {
    position: relative;
    display: block;
    margin-bottom: 20px;
    font-size: 14px;
    color: var(--color-text);
    background-color: var(--bg-normal);
    border-radius: 4px;
    box-shadow: $shadow-3-down;
    transition: all .6s ease-in;

    &::before,
    &::after {
      position: absolute;
      box-sizing: border-box;
      display: block;
      width: 0;
      height: 0;
      content: '';
      border: 1px solid transparent;
      border-radius: 4px;
    }

    &::before {
      right: 0;
      bottom: 0;
      transition: border-color 0s ease-in .4s, width .2s ease-in .2s, height .2s ease-in;
    }

    &::after {
      top: 0;
      left: 0;
      transition: border-color 0s ease-in .8s, width .2s ease-in .6s, height .2s ease-in .4s;
    }

    &:hover {
      border-color: var(--color-primary);
    }

    &:hover::before,
    &:hover::after {
      width: 100%;
      height: 100%;
    }

    &:hover::before {
      border-bottom-color: var(--color-primary);
      border-left-color: var(--color-primary);
      transition: border-color 0s ease-out .4s, width .2s ease-out .4s, height .2s ease-out .6s;
    }

    &:hover::after {
      border-top-color: var(--color-primary);
      border-right-color: var(--color-primary);
      transition: width .2s ease-out, height .2s ease-out .2s;
    }

    &__header {
      height: 42px;
      padding: 0 15px;
      line-height: 42px;
      color: var(--color-heading);
      border-bottom: 1px solid var(--border-color);
    }

    &__body {
      padding: 10px 15px;
      line-height: 24px;
    }

    &__desc {
      height: 3em;
      overflow: hidden;
    }

    &__version {
      color: var(--color-secondary);
      text-align: right;
    }
  }
}
</style>
