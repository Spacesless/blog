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
    <!--blog content-->
    <div class="blog-content">
      <div class="blog-content-wrap">
        <div ref="content" class="Tinymce" v-html="data.content" />
        <el-image ref="preview" class="app-preview" :src="previewSrc" :preview-src-list="previewSrcList" />
      </div>
      <div v-if="catalogList.length" class="catalog">
        <ul class="catalog-list">
          <li
            v-for="(item, index) in catalogList"
            :key="index"
            class="catalog-item"
            :class="[
              {
                'catalog-item--active': index === isActive
              }
            ]"
            :title="item.innerText"
            @click="scrollIntoView(item)"
          >
            <p class="catalog-item__text">{{ item.innerText }}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- share start -->
    <Share />
    <!-- Advertisement -->
    <Advertisement />
    <!-- comment start -->
    <Comment :topic-id="'article-' + data.id" />
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
    const { seo, content: data } = await $axios.$get('/article/detail', {
      params: { id }
    })
    return { id, seo, data }
  },
  data() {
    return {
      id: 0,
      catalogList: [],
      isActive: -1,
      previewSrc: '',
      previewSrcList: []
    }
  },
  mounted() {
    this.initPrism()
    this.initPreviw()

    this.$nextTick(() => {
      this.initCatelog()
    })

    // 浏览5秒才算访问量
    setTimeout(() => {
      this.handleRecordAccess()
    }, 5000)
  },
  methods: {
    initCatelog() {
      const nodes = Array.from(this.$refs.content.childNodes)
      this.catalogList = nodes.filter(item => {
        const nodeName = item.nodeName.toLowerCase()
        return ['h2', 'h3', 'h4'].includes(nodeName)
      })

      const nodeOffsetTop = []
      const catalogListLen = this.catalogList.length
      const contentStart = this.getOffsetTop(this.$refs.content) - 10
      const contentEnd = this.getOffsetTop(this.$refs.content) + this.$refs.content.clientHeight
      for (let i = 0; i < catalogListLen; i++) {
        const top = this.getOffsetTop(this.catalogList[i]) - 10
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
    /**
     * 滚动到对应的dom元素
     * @param {Element} item
     */
    scrollIntoView(item) {
      const tagetTop = this.getOffsetTop(item) - 5
      scrollTo(tagetTop, 400)
    },
    /**
     * 计算元素的OffsetTop
     * @param {Element} dom
     */
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
  .catalog{
    position: fixed;
    top: 60px;
    right: 0;
    width: 230px;
    @media (max-width: 768px){
      display: none;
    }
    &-list{
      border-left: 1px solid var(--border-color);
    }
    &-item{
      position: relative;
      padding: 0 15px;
      color: var(--color-main);
      cursor: pointer;
      &__text{
        overflow: hidden;
        color: var(--color-main);
        font-size: 14px;
        line-height: 24px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &--active{
        color: var(--color-primary);
        &:before{
          content: '';
          position: absolute;
          left: -1px;
          top: 0;
          z-index: 1;
          width: 1px;
          height: 100%;
          background-color: var(--color-primary);
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '~@/styles/prism.scss';
</style>
