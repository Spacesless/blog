<template>
  <div class="home">
    <!-- 轮播图 -->
    <el-carousel
      ref="carousel"
      class="carousel"
      trigger="click"
      :interval="5000"
      :height="bannerHeight + 'px'"
      indicator-position="none"
    >
      <el-carousel-item v-for="item in bannerList" :key="item.title">
        <img
          ref="carouselImg"
          class="carousel-item__image"
          width="1280"
          height="500"
          :src="item.imgurl"
          :srcset="item.imgurl | getImageSrcSet(1280)"
          :alt="item.title"
          @load="onImageLoad"
        >
        <div class="carousel-item__title">{{ item.title }}</div>
      </el-carousel-item>
    </el-carousel>
    <!-- 博文 -->
    <div class="article">
      <div class="home-head">
        <h2 class="home-head__title tl__title">最新文章</h2>
        <nuxt-link class="home-head__more" to="/article">more+</nuxt-link>
      </div>
      <el-row class="article-list" :gutter="gridSpace">
        <el-col v-for="item in articleList" :key="item.id" :md="12" :lg="8">
          <div class="article-item">
            <nuxt-link class="article-item-cover" :to="'/article/detail/' + item.id" :title="item.title">
              <img
                class="img-fluid"
                :width="configs.article_width"
                :height="configs.article_height"
                :src="item.imgurl"
                :srcset="item.imgurl | getImageSrcSet(configs.article_width)"
                :alt="item.title"
              >
            </nuxt-link>
            <div class="article-item-media">
              <p class="article-title">
                <nuxt-link :to="'/article/detail/' + item.id" :title="item.title">{{ item.title }}</nuxt-link>
              </p>
              <div class="article-meta">
                <span class="article-meta__date"><i class="tl-icon">&#xe70b;</i>{{ item.updatetime | parseTime('{y}-{m}-{d}') }}</span>
                <span v-if="item.categoryUrl" class="article-meta__cate">
                  <i class="tl-icon">&#xe668;</i>
                  <nuxt-link :to="item.categoryUrl" :title="item.categoryName">{{ item.categoryName }}</nuxt-link>
                </span>
                <span class="article-meta__view"><i class="tl-icon">&#xe681;</i>{{ item.hits }}</span>
              </div>
              <div class="article-desc">
                <p>{{ item.description }}</p>
              </div>
              <div class="article-meta">
                <span
                  v-for="(tag,index) in item.tag"
                  :key="index"
                >#{{ tag }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 追番 -->
    <div class="bangumi">
      <div class="home-head">
        <h2 class="home-head__title tl__title">最近追番</h2>
        <nuxt-link class="home-head__more" to="/bangumi">more+</nuxt-link>
      </div>
      <el-row class="bangumi-list" :gutter="gridSpace">
        <el-col v-for="item in bangumiList" :key="item.id" :xs="24" :sm="12" :xl="8">
          <el-row class="bangumi-list-item">
            <el-col class="bangumi-list-cover" :span="8" :xl="10">
              <nuxt-link :to="'/bangumi/detail/' + item.id" :title="item.title">
                <img
                  class="img-fluid"
                  :width="configs.bangumi_width"
                  :height="configs.bangumi_height"
                  :src="item.imgurl"
                  :srcset="item.imgurl | getImageSrcSet(configs.bangumi_width)"
                  :alt="item.title"
                >
                <span class="bangumi-list__ratings">{{ item.ratings }}</span>
              </nuxt-link>
            </el-col>
            <el-col class="bangumi-list-info" :span="16" :xl="14">
              <nuxt-link class="bangumi-list__title" :to="'/bangumi/detail/' + item.id" :title="item.title">{{ item.title }}</nuxt-link>
              <p><span class="para-name">时间：</span>{{ item.showtime }}</p>
              <p><span class="para-name">状态：</span>{{ item.status | bangumiStatus }}</p>
              <p class="hidden-sm-and-down"><span class="para-name">简介：</span>{{ item.description }}……</p>
              <p><span class="para-name">进度：</span>{{ item.current }}/{{ item.total }}</p>
              <div class="bangumi-list-tag">
                <span
                  v-for="(tag,index) in item.tag"
                  :key="index"
                  class="tl-tag"
                  :class="tag | tagClassName"
                >{{ tag }}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { pageMeta } from '@/mixins'
import { gridSpace } from '@/styles/export-to-js.scss'

export default {
  mixins: [pageMeta],
  async asyncData({ store, $axios }) {
    const { bannerList, articleList, bangumiList } = await $axios.$get('/index')

    articleList.forEach(element => {
      element.tag = element.tag ? element.tag.split('|') : []
      const findCategory = store.getters.categories.find(item => item.id === element.category_id)
      if (findCategory) {
        element.categoryUrl = `/${findCategory.type}/${findCategory.id}`
        element.categoryName = findCategory.name
      }
    })

    bangumiList.forEach(element => {
      element.tag = element.tag ? element.tag.split('|') : []
    })

    return { bannerList, articleList, bangumiList }
  },
  data() {
    return {
      gridSpace: +gridSpace,
      bannerHeight: 500,
      isLoaded: false
    }
  },
  computed: {
    configs() {
      return this.$store.getters.configs
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      this.handleResize()
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    /**
     * @event 图片加载完成
     * @summary 设置走马灯高度，适用于所有图片高度一致的情况
     */
    onImageLoad(e) {
      if (this.isLoaded) return
      this.isLoaded = true
      this.handleResize()
    },
    handleResize() {
      const carouselWidth = this.$refs.carousel?.$el.clientWidth
      this.bannerHeight = 500 * carouselWidth / 1280
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/components/bangumi.scss";

.home{
  &-head{
    position: relative;
    &__title{
      padding-top: 10px;
    }
    &__more{
      position: absolute;
      right: 0;
      top: 20px;
      color: var(--color-secondary);
      line-height: 24px;
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
      &:hover{
        color: var(--color-primary);
      }
    }
  }
}

// 轮播图
.carousel {
  overflow: hidden;
  margin-bottom: 20px;
  border-radius: $border-radius;
  box-shadow: $shadow-3-down;
  &-item{
    &__image{
      display: block;
      width: 100%;
      height: auto;
    }
    &__title{
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 8px 24px;
      background: rgba($color: #000000, $alpha: .5);
      color: #fff;
      font-size: 15px;
      border-top-left-radius: $border-radius;
    }
  }
}

// 最新文章
.article{
  &-item {
    overflow: hidden;
    margin-bottom: $grid-space;
    background: var(--bg-normal);
    box-shadow: $shadow-3-down;
    border-radius: $border-radius;
    transition: all .3s;
    &:hover{
      box-shadow: 2px 0 10px rgba(0,0,0,.1);
    }
    &-cover{
      overflow: hidden;
      position: relative;
      display: block;
      border-radius: $border-radius;
      &:after{
        pointer-events: none;
        content: "";
        position: absolute;
        top: 13%;
        left: 0;
        z-index: 35;
        width: 100%;
        height: 120%;
        background: var(--article-cover);
      }
    }
    &-media{
      padding: 16px;
    }
  }
  &-title {
    font-size: 24px;
    a {
      overflow: hidden;
      display: inline-block;
      max-width: 100%;
      color: var(--color-heading);
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover{
        color: var(--color-primary);
      }
    }
  }
  &-meta {
    height: 30px;
    padding: 6px 0;
    font-size: 14px;
    box-sizing: border-box;
    span{
      color: var(--color-secondary);
      margin-right: 10px;
    }
    i {
      margin-right: 5px;
      font-size: 18px;
      vertical-align: bottom;
    }
    &__cate{
      a{
        color: var(--color-secondary);
        &:hover{
          color: var(--color-primary);
        }
      }
    }
  }
  &-desc {
    overflow: hidden;
    display: -webkit-box;
    height: 114px;
    margin-bottom: 6px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    text-overflow: ellipsis;
    p {
      font-size: 14px;
      line-height: 2em;
    }
  }
  &-tag{
    color: var(--color-secondary);
  }
}
</style>
