<template>
  <div class="about">
    <h1 class="tl__title">
      关于
    </h1>
    <div class="hitokoto">
      <span class="hitokoto__title">
        生活总是两难，再多执着，再多不肯，最终不得不学会接受，从哭着控制，到笑着对待，到头来不过是一场随遇而安。<br>
        别想太多，一切都会过去的。
      </span>
    </div>

    <div class="about-introduce tl-card content">
      <div class="content-wrap">
        <!-- 文章目录 -->
        <Catalog v-if="isLoaded" class="content-right" />

        <div id="js-content" class="markup content-left" v-html="content" />
      </div>
    </div>
    <!-- 谷歌广告 -->
    <Adsense />
    <!-- comment start -->
    <Comment :topic-id="'about'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Catalog from '@/components/Catalog'
import Comment from '#/components/Comment'
import Adsense from '@/components/Adsense'
import { pageMeta } from '@/mixins'

export default {
  name: 'AboutUs',
  components: {
    Catalog,
    Comment,
    Adsense
  },
  mixins: [pageMeta],
  async asyncData ({ route, store, $axios }) {
    const { path } = route
    const findCategory = store.getters.categories.find(item => item.filename && path.includes(item.filename))
    if (findCategory) {
      const { content } = await $axios.$get('/category', {
        params: {
          id: findCategory.id
        }
      })

      return { content }
    }
  },
  data () {
    return {
      pageName: '关于本站',
      isLoaded: false
    }
  },
  computed: {
    ...mapGetters(['configs'])
  },
  mounted () {
    this.$nextTick(() => {
      this.isLoaded = true
    })
  }
}
</script>

<style lang="scss" scoped>
.about {
  &-introduce {
    padding-top: 0;
    margin-bottom: $grid-space;
  }
}
</style>

<style lang="scss">
@import '@/styles/components/content.scss';
</style>
