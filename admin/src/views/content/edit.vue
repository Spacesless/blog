<template>
  <article-content
    :is-edit="true"
    :columns="column"
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
    ...mapGetters(['column']),
    columnOptions() {
      const currentModule = this.$route.query.module
      const result = getColumnByModule(this.column, currentModule)
      return result
    }
  }
}
</script>

