<template>
  <article-content :is-edit="false" :column-options="columnOptions" :current-column="currentColumn" />
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleContent from './components/ArticleContent'
import { getColumnByType } from '@/utils'

export default {
  name: 'ContentCreate',
  components: {
    ArticleContent
  },
  computed: {
    ...mapGetters(['columns']),
    columnOptions() {
      const currentType = this.$route.query.type
      const result = getColumnByType(this.columns, currentType)
      return result
    },
    currentColumn() {
      const result = this.$route.query.column ? this.$route.query.column.split(',').map(Number) : []
      return result
    }
  }
}
</script>

