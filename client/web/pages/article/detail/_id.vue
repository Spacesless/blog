<template>
  <div class="blog">
    <div class="blog-summary">
      <el-row>
        <el-col class="blog-summary-cover" :xs="24" :sm="16" :lg="12">
          <img class="img-fluid" :src="data.imgurl" :alt="data.title">
        </el-col>
      </el-row>
      <h1 class="blog-summary__title">{{ data.title }}</h1>
      <div class="blog-summary__admin">
        <span><i class="tl-icon">&#xe70b;</i>{{ data.updatetime | parseTime('{y}-{m}-{d}') }}</span>
        <span><i class="tl-icon">&#xe681;</i>{{ data.hits }}</span>
      </div>
    </div>
    <!-- 文章内容 -->
    <div class="blog-content">
      <div class="blog-content-wrap">
        <div ref="content" class="Tinymce" v-html="data.content" />
        <el-image ref="preview" class="app-preview" :src="previewSrc" :preview-src-list="previewSrcList" />
      </div>
      <!-- 文章目录 -->
      <Catalog v-if="data.content" />
    </div>
    <!-- 社区分享 -->
    <Share />
    <!-- 评论 -->
    <Comment :topic-id="'article-' + data.id" />
  </div>
</template>

<script>
import Catalog from '@/components/Catalog'
import Share from '@/components/Share'
import Comment from '@/components/Comment'
import Prism from 'prismjs'
import ClipboardJS from 'clipboard'

export default {
  name: 'BlogConent',
  components: {
    Catalog,
    Share,
    Comment
  },
  async asyncData({ params, $axios }) {
    const id = params.id
    const { seo, content: data } = await $axios.$get('/article/detail', {
      params: { id }
    })
    return { id, seo, data }
  },
  data() {
    return {
      id: 0,
      previewSrc: '',
      previewSrcList: []
    }
  },
  mounted() {
    this.initPrism()
    this.initPreviw()

    // 浏览5秒才算访问量
    // this.timer = setTimeout(() => {
    //   this.handleRecordAccess()
    // }, 5000)
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
        copyIcon.innerHTML = '&#xe604;'
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
          this.$notify({
            title: '复制成功',
            message: '转载最好带上出处哟',
            type: 'success',
            offset: 50
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
    initPreviw() {
      const previews = document.querySelectorAll('.Tinymce img')
      this.previewSrcList = Array.from(previews).map(item => {
        return item.src
      })
      previews.forEach(item => {
        item.addEventListener('click', (e) => {
          this.previewSrc = e.target.src
          this.$refs.preview && this.$refs.preview.clickHandler()
        })
      })
    },
    closeViewer() {
      this.$refs.preview && this.$refs.preview.closeViewer()
    },
    // 记录访问量
    handleRecordAccess() {
      this.$axios.$get('/article/access', {
        params: { id: this.id }
      })
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
.blog{
  &-summary{
    padding: 15px 0;
    &-cover{
      margin-bottom: 15px;
    }
    &-info{
      padding: 0 15px;
    }
    &__title{
      color: var(--color-main);
      font-size: 30px;
      font-weight: normal;
      line-height: 2;
    }
    &__admin{
      font-size: 15px;
      span{
        margin-right: 10px;
      }
      .tl-icon{
        margin-right: 5px;
      }
    }
  }
  &-content{
    border-radius: 4px;
  }
}
</style>

<style lang="scss">
@import '~@/styles/prism.scss';
</style>
