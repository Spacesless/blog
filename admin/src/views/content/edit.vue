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
import { getColumnByModule } from '@/utils/index'

export default {
  name: 'ContentEdit',
  components: {
    ArticleContent
  },
  computed: {
    ...mapGetters(['columns']),
    columnOptions() {
      const currentModule = this.$route.query.module
      const result = getColumnByModule(this.columns, currentModule)
      return result
    }
  }
}
</script>

