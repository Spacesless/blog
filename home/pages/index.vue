<template>
  <div class="home">
    <!-- banner start -->
    <el-carousel ref="carousel" class="banner" trigger="click" :interval="5000" :height="bannerHeight">
      <el-carousel-item v-for="item in bannerList" :key="item.title">
        <img class="banner-item__image" :src="item.imgurl" alt="">
        <div class="banner-item__title">{{ item.title }}</div>
      </el-carousel-item>
    </el-carousel>
    <!-- blog start -->
    <div class="articles">
      <div class="home-head">
        <h2 class="home-head__title">最新博文</h2>
        <nuxt-link class="home-head__more" to="/blog">more+</nuxt-link>
      </div>
      <el-row class="articles-list" :gutter="15">
        <el-col v-for="item in articleList" :key="item.id" :md="12">
          <div class="articles-item">
            <p class="articles-title">
              <nuxt-link :to="'/article/detail/' + item.id" :title="item.title">{{ item.title }}</nuxt-link>
            </p>
            <div class="articles-meta">
              <span class="articles-meta__date"><i class="tl-icon">&#xe70b;</i>{{ item.updatetime | moment('{y}-{m}-{d}') }}</span>
              <span class="articles-meta__cate">
                <i class="tl-icon">&#xe652;</i>
                <nuxt-link :to="item.column.url" :title="item.column.name">{{ item.column.name }}</nuxt-link>
              </span>
              <span class="articles-meta__view"><i class="tl-icon">&#xe601;</i>{{ item.hits }}</span>
            </div>
            <div class="articles-desc">
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- bangumi start -->
    <div class="bangumi">
      <div class="home-head">
        <h2 class="home-head__title">最近追番</h2>
        <nuxt-link class="home-head__more" to="/bangumi">more+</nuxt-link>
      </div>
      <el-row class="bangumi-list" :gutter="15">
        <el-col v-for="item in bangumiList" :key="item.id" :xs="24" :sm="12">
          <el-row class="bangumi-list-item">
            <el-col :span="8" :xl="10">
              <nuxt-link :to="'/bangumi/detail/' + item.id" :title="item.title">
                <img class="img-fluid" :src="item.imgurl" :alt="item.title">
              </nuxt-link>
            </el-col>
            <el-col class="bangumi-list-info" :span="16" :xl="14">
              <nuxt-link class="bangumi-list__title" :to="'/bangumi/detail/' + item.id" :title="item.title">{{ item.title }}</nuxt-link>
              <p><span class="para-name">时间：</span>{{ item.showtime }}</p>
              <p><span class="para-name">状态：</span>{{ item.status | bangumiStatus }}</p>
              <p class="hidden-xs-only"><span class="para-name">简介：</span>{{ item.description }}</p>
              <div class="bangumi-progress clearfix">
                <span class="para-name">进度：</span>
                <div class="el-progress el-progress--line">
                  <div class="el-progress-bar">
                    <div class="el-progress-bar__outer">
                      <div class="el-progress-bar__inner" :style="'width:' + item.current / item.total * 100 + '%'" />
                    </div>
                  </div>
                  <div v-if="item.total" class="el-progress__text">{{ item.current }}/{{ item.total }}</div>
                </div>
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
import { globalFilter } from '@/mixins'

export default {
  mixins: [globalFilter],
  async asyncData({ $axios }) {
    const { seo, bannerList, articleList, bangumiList } = await $axios.$get('/index')
    return { seo, bannerList, articleList, bangumiList }
  },
  data() {
    return {
      bannerHeight: '450px'
    }
  },
  mounted() {
    setTimeout(() => {
      this.handleResize()
    }, 100)
    this.__resizeHandler = debounce(() => {
      this.handleResize()
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    handleResize() {
      const carouselWidth = this.$refs.carousel.$el.clientWidth
      this.bannerHeight = 450 * carouselWidth / 1280 + 'px'
    }
  },
  head() {
    return {
      title: this.seo.title,
      meta: [
        { hid: 'description', name: 'description', content: this.seo.description },
        { hid: 'keyword', name: 'keyword', content: this.seo.keyword }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.home{
  &-head{
    position: relative;
    padding: 30px 0;
    &__title{
      color: $primary;
      font-size: 24px;
      font-weight: normal;
      line-height: 1;
    }
    &__more{
      position: absolute;
      right: 0;
      top: 30px;
      color: #909399;
      font-size: 14px;
      line-height: 24px;
      &:hover{
        color: $primary;
      }
    }
  }
}
.banner {
  overflow: hidden;
  margin-top: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  &-item{
    &__image{
      display: block;
      width: 100%;
    }
    &__title{
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 7px 15px;
      background: rgba($color: #000000, $alpha: .5);
      color: #fff;
      font-size: 15px;
      border-top-left-radius: 4px;
    }
  }
}
.articles{
  .el-row{
    margin-top: -15px;
  }
  &-item {
    margin-top: 15px;
    padding: 10px 15px;
    background: #fff;
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    transition: all .3s;
    &:hover{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
  &-title {
    font-size: 24px;
    padding-top: 5px;
    a {
      overflow: hidden;
      display: inline-block;
      max-width: 100%;
      color: #303133;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover{
        color: $primary;
      }
    }
  }
  &-meta {
    padding: 5px 0;
    font-size: 14px;
    span{
      color: #909399;
      margin-right: 10px;
    }
    i {
      margin-right: 5px;
      font-size: 18px;
      vertical-align: bottom;
    }
    &__cate{
      a{
        color: #F56C6C;
        &:hover{
          color: $primary;
        }
      }
    }
  }
  &-desc {
    p {
      overflow: hidden;
      height: 60px;
      color: #606266;
      font-size: 14px;
      line-height: 2em;
    }
  }
}
.bangumi{
  &-list{
    margin-top: -15px;
    &-item{
      margin-top: 15px;
      border: 1px dashed #EBEEF5;
      background-color: #fff;
      border-radius: 4px;
      transition: all .3s;
      &:hover{
        border-style: solid;
        border-color: $primary;
      }
    }
    &-cover{
      position: relative;
    }
    &__ratings{
      position: absolute;
      right: 0;
      bottom: 0;
      width: 30px;
      height: 16px;
      background: $primary;
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      border-top-left-radius: 4px;
    }
    &-info{
      padding: 10px 12px;
      p, span, .el-progress__text{
        color: #606266;
        font-size: 14px;
        line-height: 1.6em;
      }
      .el-progress-bar{
        padding-right: 55px;
      }
      .el-progress__text{
        font-size: 12px;
        margin-left: 0;
      }
      .para-name{
        color: #909399;
      }
    }
    &__title{
      overflow: hidden;
      display: inline-block;
      max-width: 100%;
      margin-bottom: 5px;
      font-size: 18px;
      color: $primary;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &-ratings{
    .para-name{
      float: left;
    }
    .el-rate {
      overflow: hidden;
    }
  }
  &-progress{
    position: absolute;
    bottom: 10px;
    width: 62%;
    .para-name{
      float: left;
    }
    .el-progress{
      margin-left: 45px;
      line-height: 1.2em;
    }
  }
}
</style>
