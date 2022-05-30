<template>
  <div class="blog">
    <el-row class="blog-summary tl-card">
      <el-col class="blog-summary-cover" :sm="24" :md="12">
        <img class="img-full" :src="data.imgurl" :alt="data.title">
      </el-col>
      <el-col class="blog-summary-text" :sm="24" :md="12">
        <h1 class="blog-summary__title">{{ data.title }}</h1>
        <div class="blog-summary__admin">
          <span>{{ data.updatetime | parseTime('{y}年{m}月{d}日') }}</span>
          <span>阅读：{{ data.hits }}</span>
          <span v-if="data.word_count">字数：{{ data.word_count }}</span>
          <span v-if="readDuration">阅读时长：{{ readDuration }}</span>
        </div>
        <p class="blog-summary__desc">{{ data.description }}</p>
      </el-col>
    </el-row>

    <div class="blog-content tl-card content">
      <div class="content-wrap">
        <!-- 文章目录 -->
        <Catalog v-if="isLoaded" class="content-right" />
        <!-- 文章内容 -->
        <div id="js-content" class="markup content-left line-numbers" v-html="data.content" />
      </div>
      <!-- 社区分享 -->
      <Share
        :title="data.title"
        :cover="data.imgurl"
        :description="data.description"
      />
    </div>
    <!-- 图片预览 -->
    <ImageViewer v-if="isLoaded" />
    <!-- 评论 -->
    <Comment :topic-id="'article-' + data.id" />
  </div>
</template>

<script>
import Prism from 'prismjs'
import ClipboardJS from 'clipboard'
import Catalog from '@/components/Catalog'
import Comment from '#/components/Comment'
import ImageViewer from '@/components/ImageViewer'
import Share from '@/components/Share'
import { pageMeta } from '@/mixins'

export default {
  name: 'BlogConent',
  components: {
    Catalog,
    Comment,
    ImageViewer,
    Share
  },
  mixins: [pageMeta],
  async asyncData({ params, $axios }) {
    const id = params.id
    const data = await $axios.$get('/article/detail', {
      params: { id }
    })
    return { id, data }
  },
  data() {
    return {
      pageType: 'detail',
      isLoaded: false
    }
  },
  computed: {
    readDuration() {
      const averageVelocity = 8.3
      const total = (this.data.word_count || 0) / averageVelocity
      return total ? Math.ceil(total / 60) + ' 分钟' : ''
    }
  },
  mounted() {
    this.initPrism()

    this.$nextTick(() => {
      this.isLoaded = true
    })

    // 浏览5秒才算访问量
    this.timer = setTimeout(() => {
      this.handleRecordAccess()
    }, 5000)
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    initPrism() {
      Prism.plugins.toolbar.registerButton('copy-to-clipboard', (env) => {
        const copyElement = document.createElement('button')
        const copyIcon = document.createElement('i')
        const copyTips = document.createElement('em')
        copyElement.className = 'toolbar-item-button'
        copyIcon.className = 'tl-icon'
        copyTips.className = 'toolbar-item-button__tips'
        copyIcon.innerHTML = '&#xe8b0;'
        copyTips.innerText = '复制代码'
        copyElement.appendChild(copyIcon)
        copyElement.appendChild(copyTips)

        const clipboard = new ClipboardJS(copyElement, {
          'text': () => {
            return env.code
          }
        })
        clipboard.on('success', () => {
          copyIcon.innerHTML = '&#xe628;'
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            copyIcon.innerHTML = '&#xe8b0;'
          }, 3000)

          this.$notify({
            title: '复制成功',
            message: '转载最好带上出处哟',
            type: 'success',
            offset: 40
          })
        })
        clipboard.on('error', () => {
          this.$notify.error({
            title: '复制失败了呢',
            message: '请使用 Ctrl + V 来复制吧'
          })
        })
        return copyElement
      })
      Prism.highlightAll()
    },
    // 记录访问量
    handleRecordAccess() {
      this.$axios.$get('/article/access', {
        params: { id: this.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.blog{
  &-summary{
    overflow: hidden;
    position: relative;
    margin-bottom: $grid-space;
    &-cover{
      position: relative;
      &:after{
        pointer-events: none;
        content: "";
        position: absolute;
        left: 50%;
        top: 0;
        height: 100%;
        width: 50%;
        background: var(--gradient-cover);
        @media (max-width: 992px) {
          display: none;
        }
      }
    }
    &-text{
      padding: $grid-space;
      @media (max-width: 576px) {
        padding: 16px;
      }
    }
    &__title{
      color: var(--color-heading);
      font-size: 32px;
      font-weight: normal;
      line-height: 1;
      padding: $grid-space 0;
    }
    &__admin{
      margin-bottom: $grid-space;
      font-size: 15px;
      color: var(--color-secondary);
      span{
        margin-right: $grid-space / 2;
      }
    }
    &__desc{
      position: relative;
      padding-top: 12px;
      text-indent: 40px;
      &:before{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
        width: 36px;
        height: 27px;
        background-image: url(~@/assets/image/quotee.svg);
        background-size: cover;
      }
    }
  }
  &-content{
    margin-bottom: $grid-space;
  }
}
</style>

<style lang="scss">
@import "~@/styles/components/content.scss";
@import '~@/styles/components/prism.scss';
</style>
