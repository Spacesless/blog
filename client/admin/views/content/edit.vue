<template>
  <article-content
    :is-edit="true"
    :categories="categories"
    :category-options="categoryOptions"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleContent from './components/ArticleContent'
import { getCategoryByType } from '@/utils/index'

export default {
  name: 'ContentEdit',
  components: {
    ArticleContent
  },
  computed: {
    ...mapGetters(['categories']),
    categoryOptions () {
      const currentType = this.$route.query.type
      const result = getCategoryByType(this.categories, currentType)
      return result
    }
  }
}
</script>
