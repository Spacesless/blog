<template>
  <div class="blog">
    <el-row class="blog-summary">
      <el-col class="blog-summary-cover" :sm="12" :lg="8">
        <img class="img-fluid" :src="data.imgurl" :alt="data.title">
      </el-col>
      <el-col class="blog-summary-info" :sm="12" :lg="16">
        <h1 class="blog-summary__title">{{ data.title }}</h1>
        <div class="blog-summary__admin">
          <span><i class="el-icon-user" />{{ data.author }}</span>
          <span><i class="tl-icon">&#xe70b;</i>{{ data.updatetime }}</span>
          <span><i class="tl-icon">&#xe601;</i>{{ data.hits }}</span>
        </div>
      </el-col>
    </el-row>
    <!--blog content-->
    <div class="blog-content">
      <div class="blog-content-wrap">
        <div ref="content" class="Tinymce" v-html="data.content" />
        <el-image ref="preview" class="app-preview" :src="previewSrc" :preview-src-list="previewSrcList" />
      </div>
      <div v-if="headings.length" class="blog-content-catalogue" :class="{'blog-content-catalogue--close': isHideCatalogue}">
        <div class="blog-content-catalogue-head">
          文章目录
          <!-- <i class="blog-content-catalogue__close el-icon-close" @click="isHideCatalogue = true"></i> -->
        </div>
        <ul>
          <li v-for="(item,index) in headings" :key="index" class="blog-content-catalogue-item" :class="'blog-content-catalogue--'+item.nodeName">
            <span :class="index === isActive ? 'active': ''" @click="scrollIntoView(item)">{{ item.innerText }}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- share start -->
    <Share />
    <!-- Advertisement -->
    <Advertisement />
    <!-- comment start -->
    <Comment />
  </div>
</template>

<script>
import Share from '@/components/Share'
import Advertisement from '@/components/Advertisement'
import Comment from '@/components/Comment'
import Prism from 'prismjs'
import ClipboardJS from 'clipboard'
import { position, scrollTo } from '@/utils/scroll-to'

export default {
  name: 'BlogConent',
  components: {
    Share,
    Advertisement,
    Comment
  },
  async asyncData({ params, $axios }) {
    const id = params.id
    const { seo, content: data } = await $axios.$get('/blog/content', {
      params: { id }
    })
    return { seo, data }
  },
  data() {
    return {
      headings: [],
      isActive: -1,
      isHideCatalogue: false,
      previewSrc: '',
      previewSrcList: []
    }
  },
  mounted() {
    this.initContent()
    this.initPrism()
    this.initPreviw()
  },
  methods: {
    initContent() {
      const nodes = Array.from(this.$refs.content.childNodes)
      this.headings = nodes.filter(item => {
        const nodeName = item.nodeName.toLowerCase()
        return nodeName === 'h2' ||
        nodeName === 'h3' ||
        nodeName === 'h4'
      })
      this.sideType = this.headings.length > 0 ? 2 : 1

      const nodeOffsetTop = []
      const headings = this.headings
      const headingsLen = headings.length
      const contentStart = this.getOffsetTop(this.$refs.content)
      const contentEnd = this.getOffsetTop(this.$refs.content) + this.$refs.content.clientHeight
      for (let i = 0; i < headingsLen; i++) {
        const top = this.getOffsetTop(headings[i]) - 100
        nodeOffsetTop.push(top)
      }

      window.addEventListener('scroll', () => {
        const scrollTop = position()
        nodeOffsetTop.forEach((top, index) => {
          if (scrollTop >= top) {
            this.isActive = index
          }
          if (scrollTop < contentStart || scrollTop > contentEnd) {
            this.isActive = -1
          }
        })
      })
    },
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
            offset: 60
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
    scrollIntoView(item) {
      const tagetTop = this.getOffsetTop(item) - 60
      scrollTo(tagetTop, 400)
    },
    getOffsetTop(dom) {
      let top = dom.offsetTop
      while (dom.offsetParent) {
        dom = dom.offsetParent
        top += dom.offsetTop
      }
      return top
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
    &-info{
      padding: 0 15px;
    }
    &__title{
      color: #303133;
      font-size: 28px;
      font-weight: normal;
      line-height: 2;
    }
    &__admin{
      color: #606266;
      font-size: 15px;
      span{
        margin-right: 8px;
      }
    }
  }
  &-content{
    border-radius: 4px;
    &-catalogue{
      position: fixed;
      right: 0;
      top: 80px;
      max-width: 250px;
      background-color: #fff;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 6px;
      &-head{
        position: relative;
        padding: 0 15px;
        color: #303133;
        line-height: 2;
        border-bottom: 1px dashed #EBEEF5;
      }
      &__close{
        position: absolute;
        right: 10px;
        top: 7px;
        cursor: pointer;
      }
      &-item{
        padding: 7px 15px;
        color: #606266;
        font-size: 14px;
        cursor: pointer;
        .active{
          color: $primary;
        }
        &:hover{
          color: $primary;
          background-color: #ecf5ff;
        }
      }
      &--H3{
        margin-left: 5px;
      }
      &--H4{
        margin-left: 10px;
      }
      &--H5{
        margin-left: 15px;
      }
    }
  }
}
</style>

<style lang="scss">
@import '~@/styles/prism.scss';
</style>
