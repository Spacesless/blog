<template>
  <div class="blog">
    <h1 class="tl__title">{{ data.title }}</h1>
    <div class="hitokoto">
      <span class="hitokoto__title">{{ data.description }}</span>
    </div>
    <!-- 文章内容 -->
    <div class="blog-content">
      <div class="blog-summary">
        <div class="blog-summary__admin">
          <span>发布于：{{ data.updatetime | parseTime('{y}年{m}月{d}日') }}</span>
          <span>阅读：{{ data.hits }}</span>
          <span>字数：{{ data.word_count }}</span>
          <span>阅读时长：{{ readDuration }}</span>
        </div>
        <img class="blog-summary__cover" :src="data.imgurl" :alt="data.title">
      </div>
      <div class="blog-content-wrap">
        <div ref="content" class="markdown" v-html="data.content" />
        <!-- 社区分享 -->
        <Share
          :title="data.title"
          :cover="data.imgurl"
          :description="data.description"
        />
      </div>
    </div>
    <!-- 文章目录 -->
    <Catalog v-if="isLoaded" />
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
        copyIcon.className = 'el-icon-document-copy'
        copyTips.className = 'toolbar-item-button__tips'
        copyTips.innerText = '复制代码'
        copyElement.appendChild(copyIcon)
        copyElement.appendChild(copyTips)

        const clipboard = new ClipboardJS(copyElement, {
          'text': () => {
            return env.code
          }
        })
        clipboard.on('success', () => {
          copyIcon.className = 'el-icon-document-checked'
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            copyIcon.className = 'el-icon-document-copy'
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
    &-text{
      padding: $grid-space;
    }
    &__title{
      margin-bottom: 12px;
      color: var(--color-heading);
      font-size: 30px;
      font-weight: normal;
      line-height: 1;
    }
    &__admin{
      margin-bottom: $grid-space;
      font-size: 15px;
      color: var(--color-secondary);
      span{
        margin-right: $grid-space;
      }
    }
  }
  &-content{
    padding: $grid-space;
    margin-bottom: $grid-space;
    background-color: var(--bg-normal);
    border-radius: 4px;
  }
}
</style>

<style lang="scss">
@import "~@/styles/components/content.scss";
@import '~@/styles/components/prism.scss';
</style>
