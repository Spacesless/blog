import { debounce } from 'lodash-es'

/**
 * echarts自适应
 */
export const resizeChart = {
  data() {
    return {
      $_sidebarElm: null
    }
  },
  mounted() {
    // 函数消抖
    this.__resizeHandler = debounce(() => {
      if (this.chartInstance) {
        if (this.chartHeight && this.doResize) {
          this.doResize && this.doResize()
        } else {
          this.chartInstance.resize()
        }
      } else {
        this.doResize && this.doResize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)

    this.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.$_sidebarElm && this.$_sidebarElm.addEventListener('transitionend', this.$_sidebarResizeHandler)
  },
  activated() {
    this.chartInstance && this.chartInstance.resize()
    this.doResize && this.doResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)

    this.$_sidebarElm && this.$_sidebarElm.removeEventListener('transitionend', this.$_sidebarResizeHandler)
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    }
  }
}

/**
 * 列表多选表格
 * @summary 包括分页、复选框、删除选中
 */
export const multipleTable = {
  data() {
    return {
      multipleSelection: [],
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20
      },
      total: 0,
      deleteLoading: false,
      updateLoading: false
    }
  },
  methods: {
    onSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$set(row, 'deleteLoading', false)
        this.deleteSingle(row).catch(() => {
          this.$set(row, 'deleteLoading', false)
        })
      })
    },
    handleDeleteSelection() {
      const listCount = this.multipleSelection.length
      if (listCount) {
        this.$confirm(`确定要删除${listCount}条内容?`, '提示', {
          type: 'warning'
        }).then(async() => {
          this.deleteLoading = true
          await this.deleteSelection(listCount).catch(() => {})
          this.deleteLoading = false
        })
      } else {
        this.$message('请先选择数据，再进行操作')
      }
    },
    handleSearch() {
      this.listQuery.page = 1 // 搜索重置页码
      this.fetchList && this.fetchList()

      // 表格返回头部
      const multipleTable = this.$refs.multipleTable && this.$refs.multipleTable.bodyWrapper
      multipleTable && scrollTo(0, 200, null, multipleTable)
    },
    onKeywordInput: debounce(() => {
      this.handleSearch()
    }, 500),
    handleSearchTitle(keyword) {
      this.listQuery.keyword = keyword
      this.handleSearch()
    },
    handleChangeColumn(columns) {
      this.listQuery = { ...this.listQuery, ...columns, page: 1 }
      this.handleSearch()
    },
    /**
     * 重新计算当前分页
     * @summary 处理删除分页最后一页所有数据时，PageIndex不变，页面列表为空的问题
     * @param {Number [int]} listCount 列表改变的个数（暂为删除操作）
     */
    calcCurrentPage(listCount) {
      this.total -= listCount
      const { page, pageSize } = this.listQuery
      if (this.total > 0 && (page - 1) * pageSize === this.total) {
        this.listQuery.page -= 1
      }
    }
  }
}

/**
 * 列表弹窗
 * @summary 包括添加、搜索、编辑、监听子组件提交或取消事件
 */
export const listDialog = {
  data() {
    return {
      currentId: 0,
      dialogVisible: false
    }
  },
  methods: {
    handleAdd() {
      this.currentId = 0
      this.dialogVisible = true
    },
    /**
     * 编辑指定ID数据
     * @param {Number [int]} id
     */
    handleEdit(id) {
      this.currentId = id
      this.dialogVisible = true
    },
    /**
     * 取消或提交
     * @param {Boolean} isConfirm 是否提交完成
     */
    onConfirm(isConfirm) {
      this.dialogVisible = false
      isConfirm && this.fetchList()
    }
  }
}

/**
 * 弹窗内的表单
 * @summary 包括取消、监听弹窗关闭动画结束的事件
 */
export const dialogForm = {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      dialogLoading: false
    }
  },
  methods: {
    handleCancel() {
      // 取消只关闭弹窗，不刷新列表
      this.$emit('onConfirm', false)
    },
    /**
     * 关闭弹窗后重置表单，保证编辑、添加不互相影响
     * @summary 部分表单有初始默认值的需要在onOpen或onOpened中重新赋值
     */
    onClosed() {
      this.$refs.form && this.$refs.form.resetFields() // 关闭后对整个表单进行重置值以及校验结果
      this.formData = {} // 必须 否则1、重置后部分无法改变值，当然也可在data()给对应属性赋初始值 2、无prop属性的formColumn没重置
    }
  }
}
