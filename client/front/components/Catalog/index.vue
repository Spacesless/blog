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
        >
          {{ item.innerText }}
        </li>
      </el-scrollbar>
    </div>
    <span v-show="!isShowCatalog" class="catalog-wrapper__show" @click="toggleShow">文章目录</span>
  </div>
</template>

<script>
import { scrollTo } from '#/utils/scroll-to'

export default {
  name: 'ArticleCatalog',
  data () {
    return {
      catalogList: [],
      activeIndex: -1,
      isShowCatalog: true
    }
  },
  computed: {
    content () {
      return this.$parent?.$refs.content || {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initCatelog()
    })
  },
  methods: {
    initCatelog () {
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
    scrollIntoView (index) {
      scrollTo(this.catalogList[index].offsetTop, 500)
    },
    toggleShow () {
      this.isShowCatalog = !this.isShowCatalog
    }
  }
}
</script>

<style lang="scss" scoped>
.catalog {
  position: sticky;
  top: 0;
  bottom: 16px;
  box-sizing: border-box;
  width: 200px;
  transition: width .3s;

  @media (max-width: 1280px) {
    position: static;
    width: 100%;
  }

  &-wrapper {
    transition: width .3s;

    &--close {
      width: 0;
      padding-top: 16px;
    }

    &__show {
      position: sticky;
      top: 16px;
      display: inline-block;
      width: 12px;
      padding: 4px;
      font-size: 12px;
      color: #FFFFFF;
      cursor: pointer;
      background: linear-gradient(130deg, rgb(36, 198, 220), var(--color-primary) 60%, rgb(84, 51, 255));
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  &-header {
    position: relative;
    height: 40px;
    padding: 0 16px;
    margin-bottom: 8px;
    line-height: 40px;
    color: var(--color-secondary);
    border-bottom: 1px dashed var(--border-color);

    @media (max-width: 1280px) {
      text-align: left;
      border-bottom: none;
    }

    &__close {
      position: absolute;
      top: 11px;
      right: 12px;
      font-size: 18px;
      cursor: pointer;
    }
  }

  &-scrollbar {
    height: calc(100vh - 60px);

    @media (max-width: 1280px) {
      height: auto;
    }
  }

  &-item {
    margin: 0 10px;
    font-size: 14px;
    line-height: 30px;
    color: var(--color-text);
    cursor: pointer;

    &.H3 {
      padding-left: 10px;
    }

    &.H4 {
      padding-left: 20px;
    }

    &.H5 {
      padding-left: 30px;
    }

    &--active {
      color: var(--color-primary);
    }
  }
}
</style>
