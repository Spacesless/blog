<template>
  <div v-if="catalogList.length" class="catalog-wrapper" :class="{'catalog-wrapper--close': !isShowCatalog}">
    <div v-show="isShowCatalog" ref="catalog" class="catalog">
      <p class="catalog-header">
        <span class="el-icon-reading" />
        <span>文章目录</span>
        <span class="catalog-header__close el-icon-close" @click="toggleShow" />
      </p>
      <el-scrollbar class="catalog-scrollbar" tag="ul">
        <li
          v-for="(item, index) in catalogList"
          ref="catalogItem"
          :key="index"
          class="catalog-item"
          :class="[
            item.nodeName,
            { 'catalog-item--active': index === activeIndex }
          ]"
          :title="item.innerText"
          @click="scrollIntoView(index)"
        >{{ item.innerText }}</li>
      </el-scrollbar>
    </div>
    <span v-show="!isShowCatalog" class="catalog-wrapper__show" @click="toggleShow">文章目录</span>
  </div>
</template>

<script>
import { scrollTo } from '#/utils/scroll-to'

export default {
  data() {
    return {
      catalogList: [],
      activeIndex: -1,
      isShowCatalog: true
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
      const markupElement = document.getElementById('js-content')
      if (!markupElement) {
        return
      }
      this.catalogList = markupElement.querySelectorAll('h2,h3,h4')

      window.addEventListener('scroll', () => {
        let index = -1
        for (let i = 0, len = this.catalogList.length; i < len; i++) {
          const el = this.catalogList[i]
          const { top, height } = el.getBoundingClientRect()
          if (top <= height) {
            index = i
          }
        }

        this.activeIndex = index
      })
    },
    /**
     * 滚动到对应的dom元素
     * @param {Number} index
     */
    scrollIntoView(index) {
      scrollTo(this.catalogList[index].offsetTop, 500)
    },
    toggleShow() {
      this.isShowCatalog = !this.isShowCatalog
    }
  }
}
</script>

<style lang="scss" scoped>
.catalog{
  position: sticky;
  top: 0;
  bottom: 16px;
  width: 200px;
  box-sizing: border-box;
  transition: width .3s;
  @media (max-width: 1280px){
    position: static;
    width: 100%;
    padding: 0 $grid-space;
  }
  &-wrapper{
    transition: width .3s;
    &--close {
      width: 0;
      padding-top: 16px;
    }
    &__show{
      display: inline-block;
      position: sticky;
      top: 16px;
      width: 12px;
      padding: 4px;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      background: linear-gradient(130deg, rgb(36, 198, 220), var(--color-primary) 60%, rgb(84, 51, 255));
      color: #fff;
      font-size: 12px;
      cursor: pointer;
    }
  }
  &-header{
    position: relative;
    height: 40px;
    padding: 0 16px;
    margin-bottom: 8px;
    border-bottom: 1px dashed var(--border-color);
    color: var(--color-secondary);
    line-height: 40px;
    @media (max-width: 1280px){
      text-align: left;
      border-bottom: none;
    }
    &__close{
      position: absolute;
      right: 12px;
      top: 11px;
      font-size: 18px;
      cursor: pointer;
    }
  }
  &-scrollbar{
    max-height: calc(100vh - 48px);
    padding-bottom: 10px;
  }
  &-item{
    margin: 0 10px;
    color: var(--color-text);
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
    &.H3{
      padding-left: 10px;
    }
    &.H4{
      padding-left: 20px;
    }
    &.H5{
      padding-left: 30px;
    }
    &--active {
      color: var(--color-primary);
    }
  }
}
</style>
