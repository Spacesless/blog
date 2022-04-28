<template>
  <div class="webapp">
    <h2 class="tl__title">附属站</h2>
    <el-row class="webapp-list" :gutter="20">
      <el-col v-for="item in externalApp" :key="item.id" :sm="12" :md="8" :xl="6">
        <a class="webapp-card" :href="item.link" :title="item.name" target="_blank">
          <div class="webapp-card__header">{{ item.name }}</div>
          <div class="webapp-card__body">
            <div class="clearfix">
              <img class="webapp-card__logo img-fluid" :src="item.columnimg">
              <p class="webapp-card__desc">{{ item.description }}</p>
            </div>
            <p class="webapp-card__version">版本号：{{ item.version }}</p>
          </div>
        </a>
      </el-col>
    </el-row>
    <h2 class="tl__title">小工具</h2>
    <el-row class="webapp-list" :gutter="20">
      <el-col v-for="item in internalApp" :key="item.id" :sm="12" :md="8" :xl="6">
        <a class="webapp-card" :href="item.link || item.url" :title="item.name" target="_blank">
          <div class="webapp-card__header">{{ item.name }}</div>
          <div class="webapp-card__body">
            <div class="clearfix">
              <img class="webapp-card__logo img-fluid" :src="item.columnimg">
              <p class="webapp-card__desc">{{ item.description }}</p>
            </div>
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
  async asyncData({ params, $axios }) {
    const list = await $axios.$get('/tool/list', {
      params: {
        id: params.id
      }
    })

    return {
      webappList: list
    }
  },
  data() {
    return {
      pageType: 'list',
      externalApp: [],
      internalApp: []
    }
  },
  watch: {
    webappList: {
      handler(list) {
        list.forEach(element => {
          if (element.link) this.externalApp.push(element)
          else this.internalApp.push(element)
        })
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.webapp{
  &-card{
    display: block;
    position: relative;
    margin-bottom: 20px;
    background-color: var(--bg-normal);
    color: var(--color-text);
    font-size: 14px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.6s ease-in;
    &:before,&:after {
      content: '';
      display: block;
      position: absolute;
      width: 0;
      height: 0;
      border: 1px solid transparent;
      box-sizing: border-box;
      border-radius: 4px;
    }
    &:before {
      bottom: 0;
      right: 0;
      transition: border-color 0s ease-in 0.4s,width 0.2s ease-in 0.2s,height 0.2s ease-in;
    }
    &:after {
      top: 0;
      left: 0;
      transition: border-color 0s ease-in 0.8s,width 0.2s ease-in 0.6s,height 0.2s ease-in 0.4s;
    }
    &:hover {
      border-color: var(--color-primary);
    }
    &:hover:before,&:hover:after {
      width: 100%;
      height: 100%;
    }
    &:hover:before {
      border-bottom-color: var(--color-primary);
      border-left-color: var(--color-primary);
      transition: border-color 0s ease-out 0.4s,width 0.2s ease-out 0.4s,height 0.2s ease-out 0.6s;
    }
    &:hover:after {
      border-top-color: var(--color-primary);
      border-right-color: var(--color-primary);
      transition:width 0.2s ease-out,height 0.2s ease-out 0.2s;
    }
    &__header{
      height: 42px;
      padding: 0 15px;
      color: var(--color-heading);
      line-height: 42px;
      border-bottom: 1px solid var(--border-color);
    }
    &__body{
      padding: 10px 15px;
      line-height: 24px;
    }
    &__logo{
      float: left;
      width: 64px;
    }
    &__desc {
      overflow: hidden;
      height: 3em;
      padding-left: 10px;
    }
    &__version{
      color: var(--color-secondary);
      text-align: right;
    }
  }
}
</style>
