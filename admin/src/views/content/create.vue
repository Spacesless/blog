<template>
  <article-content :is-edit="false" :column-options="columnOptions" :current-column="currentColumn" />
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleContent from './components/ArticleContent'
import { getColumnByModule } from '@/utils'

export default {
  name: 'ContentCreate',
  components: {
    ArticleContent
  },
  computed: {
    ...mapGetters(['columns']),
    columnOptions() {
      const currentModule = this.$route.query.module
      const result = getColumnByModule(this.columns, currentModule)
      return result
    },
    currentColumn() {
      const result = this.$route.query.column ? this.$route.query.column.split(',').map(Number) : []
      return result
    }
  }
}
</script>

