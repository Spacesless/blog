<template>
  <div class="home">
    <!-- 轮播图 -->
    <el-carousel
      ref="carousel"
      class="carousel"
      trigger="click"
      :interval="5000"
      :height="bannerHeight + 'px'"
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
        <div class="carousel-item__title">
          {{ item.title }}
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- 博文 -->
    <div v-if="articleList.length" class="article">
      <div class="home-head">
        <h2 class="home-head__title tl__title">
          最新文章
        </h2>
        <nuxt-link class="home-head__more" to="/article">
          more+
        </nuxt-link>
      </div>
      <el-row class="article-list" :gutter="gridSpace">
        <el-col v-for="item in articleList" :key="item.id" :sm="12" :lg="8">
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
                <nuxt-link :to="'/article/detail/' + item.id" :title="item.title">
                  {{ item.title }}
                </nuxt-link>
              </p>
              <div class="article-meta">
                <span class="article-meta__date"><i class="icon-riqi" />{{ item.updatetime | parseTime('{y}-{m}-{d}') }}</span>
                <span v-if="item.categoryUrl" class="article-meta__cate">
                  <i class="icon-bianqian" />
                  <nuxt-link :to="item.categoryUrl" :title="item.categoryName">{{ item.categoryName }}</nuxt-link>
                </span>
                <span class="article-meta__view"><i class="icon-chakan" />{{ item.hits }}</span>
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
    <div v-if="bangumiList.length" class="bangumi">
      <div class="home-head">
        <h2 class="home-head__title tl__title">
          最近追番
        </h2>
        <nuxt-link class="home-head__more" to="/bangumi">
          more+
        </nuxt-link>
      </div>
      <el-row class="bangumi-list" :gutter="gridSpace">
        <el-col v-for="item in bangumiList" :key="item.id" :xs="24" :sm="12">
          <el-row class="bangumi-list-item">
            <el-col class="bangumi-list-cover" :span="10" :xl="8">
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
            <el-col class="bangumi-list-info" :span="14" :xl="16">
              <nuxt-link class="bangumi-list__title" :to="'/bangumi/detail/' + item.id" :title="item.title">
                {{ item.title }}
              </nuxt-link>
              <p><span class="para-name">时间：</span>{{ item.showtime }}</p>
              <p><span class="para-name">状态：</span>{{ item.status | bangumiStatus }}</p>
              <p class="hidden-md-and-down">
                <span class="para-name">简介：</span>{{ item.description }}……
              </p>
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
  name: 'HomePage',
  mixins: [pageMeta],
  async asyncData ({ store, $axios }) {
    const { bannerList, articleList, bangumiList } = await $axios.$get('/index')

    articleList.forEach((element) => {
      element.tag = element.tag ? element.tag.split('|') : []
      const findCategory = store.getters.categories.find(item => item.id === element.category_id)
      if (findCategory) {
        element.categoryUrl = `/${findCategory.type}/${findCategory.id}`
        element.categoryName = findCategory.name
      }
    })

    bangumiList.forEach((element) => {
      element.tag = element.tag ? element.tag.split('|') : []
    })

    return { bannerList, articleList, bangumiList }
  },
  data () {
    return {
      gridSpace: +gridSpace || 20,
      bannerHeight: 500,
      isLoaded: false
    }
  },
  computed: {
    configs () {
      return this.$store.getters.configs
    },
    meta () {
      const { sitename, keywords, description } = this.configs

      return {
        keyword: keywords,
        description,
        title: `${sitename} - 花开成景，花落成诗`
      }
    }
  },
  mounted () {
    this.__resizeHandler = debounce(() => {
      this.handleResize()
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    /**
     * @event 图片加载完成
     * @summary 设置走马灯高度，适用于所有图片高度一致的情况
     */
    onImageLoad (e) {
      if (this.isLoaded) { return }
      this.isLoaded = true
      this.handleResize()
    },
    handleResize () {
      const carouselWidth = this.$refs.carousel?.$el.clientWidth
      this.bannerHeight = 500 * carouselWidth / 1280
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/components/bangumi.scss';

.home {
  &-head {
    position: relative;

    &__title {
      padding-top: 10px;
    }

    &__more {
      position: absolute;
      top: 20px;
      right: 0;
      line-height: 24px;
      color: var(--color-secondary);
      text-shadow: 0 2px 6px rgba(0, 0, 0, .5);

      &:hover {
        color: var(--color-primary);
      }
    }
  }
}

// 轮播图
.carousel {
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: $border-radius;
  box-shadow: $shadow-3-down;

  &-item {
    &__image {
      display: block;
      width: 100%;
      height: auto;
    }

    &__title {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 8px 24px;
      font-size: 15px;
      color: #FFFFFF;
      background: rgba($color: #000000, $alpha: .5);
      border-top-left-radius: $border-radius;
    }
  }
}

// 最新文章
.article {
  &-item {
    margin-bottom: $grid-space;
    overflow: hidden;
    background: var(--bg-normal);
    border-radius: $border-radius;
    box-shadow: $shadow-3-down;
    transition: all .3s;

    &:hover {
      box-shadow: 2px 0 10px rgba(0, 0, 0, .1);
    }

    &-cover {
      position: relative;
      display: block;
      overflow: hidden;
      border-radius: $border-radius;

      &::after {
        position: absolute;
        top: 13%;
        left: 0;
        z-index: 35;
        width: 100%;
        height: 120%;
        pointer-events: none;
        content: '';
        background: var(--article-cover);
      }
    }

    &-media {
      padding: 16px;
    }
  }

  &-title {
    font-size: 24px;

    a {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      color: var(--color-heading);
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  &-meta {
    box-sizing: border-box;
    height: 30px;
    padding: 6px 0;
    font-size: 14px;

    span {
      margin-right: 10px;
      color: var(--color-secondary);
    }

    i {
      margin-right: 5px;
      font-size: 18px;
      vertical-align: middle;
    }

    &__cate {
      a {
        color: var(--color-secondary);

        &:hover {
          color: var(--color-primary);
        }
      }
    }
  }

  &-desc {
    display: -webkit-box;
    height: 114px;
    margin-bottom: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;

    p {
      font-size: 14px;
      line-height: 2em;
    }
  }

  &-tag {
    color: var(--color-secondary);
  }
}

// 最近追番
.bangumi {
  &-list {
    &-tag .tl-tag {
      cursor: default;
    }
  }
}
</style>
