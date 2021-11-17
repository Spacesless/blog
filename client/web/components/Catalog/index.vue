<template>
  <div v-if="catalogList.length" class="catalog">
    <el-scrollbar tag="ul">
      <li
        v-for="(item, index) in catalogList"
        :key="index"
        class="catalog-item"
        :class="{
          'catalog-item--active': index === isActive
        }"
        :title="item.innerText"
      >
        <div v-if="index !== catalogList.length - 1" class="catalog-item__tail" />
        <div class="catalog-item__node" :class="item.nodeName" />
        <div class="catalog-item__wrapper" :class="item.nodeName" @click="scrollIntoView(item)">{{ item.innerText }}</div>
      </li>
    </el-scrollbar>
  </div>
</template>

<script>
import { getPosition, scrollTo } from '#/utils/scroll-to'

export default {
  data() {
    return {
      catalogList: [],
      isActive: -1
    }
  },
  computed: {
    content() {
      return this.$parent?.$refs.content || {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCatelog()
    })
  },
  methods: {
    initCatelog() {
      const nodes = Array.from(this.content?.childNodes)
      this.catalogList = nodes.filter(item => {
        const nodeName = item.nodeName.toLowerCase()
        return ['h2', 'h3', 'h4'].includes(nodeName)
      })

      const nodeOffsetTop = []
      const catalogListLen = this.catalogList.length
      const contentStart = this.getOffsetTop(this.content) - 10
      const contentEnd = this.getOffsetTop(this.content) + this.content.clientHeight
      for (let i = 0; i < catalogListLen; i++) {
        const top = this.getOffsetTop(this.catalogList[i]) - 10
        nodeOffsetTop.push(top)
      }

      window.addEventListener('scroll', () => {
        const scrollTop = getPosition()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.catalog{
  position: fixed;
  top: 60px;
  right: 15px;
  bottom: 260px;
  width: 225px;
  @media (max-width: 768px){
    display: none;
  }
  &-item{
    position: relative;
    padding-bottom: 20px;
    padding-left: 25px;
    &__tail{
      position: absolute;
      left: 4px;
      top: 12px;
      height: 100%;
      border-left: 2px solid #E4E7ED;
    }
    &__node{
      position: absolute;
      background-color: #E4E7ED;
      border-radius: 50%;
      top: 11px;
      left: -1px;
      width: 12px;
      height: 12px;
      &.H2{
        left: -2px;
        width: 14px;
        height: 14px;
      }
      &.H4{
        left: -4px;
        width: 10px;
        height: 10px;
      }
    }
    &__wrapper{
      display: inline-block;
      position: relative;
      padding: 8px 15px 8px 12px;
      background: var(--bg-normal);
      border-radius: 10px;
      color: var(--color-text);
      font-size: 14px;
      line-height: 20px;
      box-shadow: 0 13px 15px rgba(0, 0, 0, .1);
      cursor: pointer;
      transition: box-shadow .3s, transform .3s,color .1s;
      &:before{
        position: absolute;
        border-right: 14px solid var(--bg-normal);
        border-top: 14px solid transparent;
        border-bottom: 14px solid transparent;
        top: 4px;
        left: -12px;
      }
      &.H2:before{
        content: "";
      }
    }
    &--active {
      .catalog-item__wrapper{
        background: linear-gradient(100deg, var(--color-primary),#79BBFF);
        color: #fff;
        box-shadow: 0 13px 15px rgba(32, 160, 255, .3);
        &:before{
          border-right-color: var(--color-primary);
        }
      }
      .catalog-item__node{
        background-color: var(--color-primary);
      }
    }
  }
}
</style>
