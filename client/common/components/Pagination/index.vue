<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="pageLayout"
      :pager-count="device === 'desktop' ? 7 : 5"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { scrollTo } from '#/utils/scroll-to'

export default {
  name: 'PaginationIndex',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 50, 100]
      }
    },
    isAdmin: {
      type: Boolean,
      default: true
    },
    adminLayout: {
      type: String,
      default: 'total, sizes, ->, prev, pager, next, jumper'
    },
    webLayout: {
      type: String,
      default: 'total, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['device']),
    currentPage: {
      get () {
        return this.page
      },
      set (val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get () {
        return this.limit
      },
      set (val) {
        this.$emit('update:limit', val)
      }
    },
    pageLayout () {
      return this.device === 'desktop'
        ? (this.isAdmin ? this.adminLayout : this.webLayout)
        : 'prev, pager, next'
    }
  },
  methods: {
    /**
     * 每页个数改变
     * @param {Number [int]} val 每页个数
     */
    handleSizeChange (val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        const multipleTable = this.$parent?.$refs.multipleTable?.bodyWrapper
        multipleTable && scrollTo(0, 200, multipleTable)
      }
    },
    /**
     * 页码改变
     * @param {Number [int]} val 页码
     */
    handleCurrentChange (val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        const multipleTable = this.$parent?.$refs.multipleTable?.bodyWrapper
        multipleTable && scrollTo(0, 200, multipleTable)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container.hidden {
  display: none;
}

.el-pagination {
  font-weight: normal;
}
</style>
