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
        <el-col :md="12" v-for="item in blogs" :key="item.id">
          <div class="articles-item">
            <p class="articles-title">
              <nuxt-link :to="'/blog/content/' + item.id" :title="item.title">{{ item.title }}</nuxt-link>
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
        <el-col v-for="item in bangumis" :key="item.id" :xs="8" :sm="12">
          <el-row class="bangumi-list-item">
            <el-col :span="8" :xl="10">
              <nuxt-link :to="'/bangumi/content/' + item.id" :title="item.title">
                <img class="img-fluid" :src="item.imgurl"  :alt="item.title" />
              </nuxt-link>
            </el-col>
            <el-col class="bangumi-list-info" :span="16" :xl="14">
              <nuxt-link class="bangumi-list__title" :to="'/bangumi/content/' + item.id" :title="item.title">{{ item.title }}</nuxt-link>
              <p><span class="para-name">时间：</span>{{ item.showtime }}</p>
              <p><span class="para-name">状态：</span>{{ item.status | bangumiStatus }}</p>
              <p class="hidden-xs-only"><span class="para-name">简介：</span>{{ item.description }}</p>
              <div class="bangumi-progress clearfix">
                <span class="para-name">进度：</span>
                <div class="el-progress el-progress--line">
                  <div class="el-progress-bar">
                    <div class="el-progress-bar__outer">
                      <div class="el-progress-bar__inner" :style="'width:' + item.current / item.total * 100 + '%'"></div>
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
  async asyncData({ $axios }) {
    const { seo, banners: bannerList, blogs, bangumis } = await $axios.$get('/index')
    return { seo, bannerList, blogs, bangumis }
  },
  head() {
    return {
      title: this.seo.title,
      meta: [
        { hid: 'description', name: 'description', content: this.seo.description },
        { hid: 'keyword', name: 'keyword', content: this.seo.keyword }
      ]
    }
  },
  mixins: [globalFilter],
  data() {
    return {
      bannerHeight: '450px'
    }
  },
  mounted() {
    this.handleResize()
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
      this.bannerHeight = 420 * carouselWidth / 1280 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.home{
  &-head{
    padding: 30px 0;
    position: relative;
    &__title{
      font-size: 24px;
      font-weight: normal;
      line-height: 1;
      color: $primary;
    }
    &__more{
      font-size: 14px;
      line-height: 24px;
      color: #909399;
      position: absolute;
      right: 0;
      top: 30px;
      &:hover{
        color: $primary;
      }
    }
  }
}
.banner{
  margin-top: 15px;
  border-radius: 4px;
  overflow: hidden;
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
      color: #fff;
      font-size: 15px;
      padding: 7px 15px;
      border-top-left-radius: 4px;
      background: rgba($color: #000000, $alpha: .5);
    }
  }
}
.articles{
  .el-row{
    margin-top: -15px;
  }
  &-item {
    padding: 10px 15px;
    background: #fff;
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    margin-top: 15px;
    transition: all .3s;
    &:hover{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
  &-title {
    font-size: 24px;
    padding-top: 5px;
    a {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #303133;
      &:hover{
        color: $primary;
      }
    }
  }
  &-meta {
    font-size: 14px;
    padding: 5px 0;
    span{
      margin-right: 10px;
      color: #909399;
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
      color: #606266;
      font-size: 14px;
      line-height: 2em;
      height: 60px;
      overflow: hidden;
    }
  }
}
.bangumi{
  &-list{
    margin-top: -15px;
    &-item{
      margin-top: 15px;
      background-color: #fff;
      border-radius: 4px;
      border: 1px dashed #EBEEF5;
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
      font-size: 12px;
      background: $primary;
      color: #fff;
      width: 30px;
      text-align: center;
      height: 16px;
      line-height: 16px;
      border-top-left-radius: 4px;
    }
    &-info{
      padding: 10px 12px;
      p, span, .el-progress__text{
        font-size: 14px;
        line-height: 1.6em;
        color: #606266;
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
      display: inline-block;
      font-size: 18px;
      max-width: 100%;
      color: $primary;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 5px;
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
