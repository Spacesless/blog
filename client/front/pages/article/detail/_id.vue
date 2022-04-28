<template>
  <div class="blog">
    <el-row class="blog-summary">
      <el-col class="blog-summary-cover" :xs="24" :sm="12" :lg="10">
        <img class="img-fluid" :src="data.imgurl" :alt="data.title">
      </el-col>
      <el-col class="blog-summary-text" :xs="24" :sm="12" :lg="14">
        <h1 class="blog-summary__title">{{ data.title }}</h1>
        <div class="blog-summary__admin">
          <span>{{ data.updatetime | parseTime('{y}年{m}月{d}日') }}</span>
          <span>阅读{{ data.hits }}</span>
          <span>字数{{ data.word_count }}</span>
          <span>{{ readDuration }}</span>
        </div>
        <p class="blog-summary__desc">{{ data.description }}</p>
      </el-col>
    </el-row>
    <!-- 文章内容 -->
    <div class="blog-content">
      <div class="blog-content-wrap">
        <div ref="content" class="markdown" v-html="data.content" />
        <!-- 社区分享 -->
        <Share />
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
      return total ? Math.ceil(total / 60) + ' min read' : ''
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
    overflow: hidden;
    position: relative;
    margin-bottom: 6px;
    background-color: var(--bg-normal);
    border-radius: 4px;
    &-text{
      padding: 15px;
    }
    &__title{
      margin-bottom: 12px;
      color: var(--color-heading);
      font-size: 30px;
      font-weight: normal;
      line-height: 1;
    }
    &__admin{
      font-size: 15px;
      color: var(--color-secondary);
      span{
        margin-right: 10px;
      }
      .tl-icon{
        margin-right: 5px;
      }
    }
    &__desc{
      margin-top: 16px;
      padding: 8px 12px;
      background: rgba($--color-primary, .1);
      border: 1px solid rgba($--color-primary, .3);
      border-left: 4px solid $--color-primary;
      border-radius: 4px;
      color: var(--color-text);
      font-size: 15px;
      line-height: 1.7;
      letter-spacing: 1px;
    }
  }
  &-content{
    padding: 15px;
    margin-bottom: 6px;
    background-color: var(--bg-normal);
    border-radius: 4px;
  }
}
</style>

<style lang="scss">
@import "~@/styles/content.scss";
@import '~@/styles/prism.scss';
</style>
