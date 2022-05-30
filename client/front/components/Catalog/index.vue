<template>
  <div v-if="catalogList.length">
    <div ref="catalog" class="catalog">
      <p class="catalog-header">
        <span class="el-icon-reading" />
        目录
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
  </div>
</template>

<script>
import { scrollTo } from '#/utils/scroll-to'

export default {
  data() {
    return {
      catalogList: [],
      activeIndex: -1
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
  @media (max-width: 1280px){
    position: static;
    width: 100%;
    padding: 0 $grid-space;
  }
  &-header{
    height: 40px;
    margin-bottom: 8px;
    border-bottom: 1px dashed var(--border-color);
    color: var(--color-secondary);
    line-height: 40px;
    text-align: center;
    @media (max-width: 1280px){
      text-align: left;
      border-bottom: none;
    }
  }
  &-scrollbar{
    max-height: calc(100vh - 48px);
    padding-bottom: 10px;
  }
  &-item{
    margin: 0 10px;
    color: var(--color-text);
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
