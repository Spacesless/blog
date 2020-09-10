<template>
  <article-content
    :is-edit="true"
    :columns="columns"
    :column-options="columnOptions"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleContent from './components/ArticleContent'
import { getColumnByType } from '@/utils/index'

export default {
  name: 'ContentEdit',
  components: {
    ArticleContent
  },
  computed: {
    ...mapGetters(['columns']),
    columnOptions() {
      const currentType = this.$route.query.type
      const result = getColumnByType(this.columns, currentType)
      return result
    }
  }
}
</script>

