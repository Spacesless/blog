export const listPage = {
  data() {
    return {
      total: 0,
      listPage: {
        page: 1,
        pageSize: 20
      }
    }
  },
  methods: {
    /**
     * 列表分页切换
     * @param {Object} { page: 当前页, limit: 每页个数 }
     */
    changeListPage({ page }) {
      const { name, params, query } = this.$route
      const [id] = params.id ? params.id.split('-') : ['list']
      this.$router.push({ name, params: { id: `${id}-${page}` }, query })
    }
  }
}

export const listQuery = {
  data() {
    return {
      filters: {},
      dynamicTags: []
    }
  },
  methods: {
    handleSearch() {
      const { name, params } = this.$route
      const [id] = params.id ? params.id.split('-') : ['list']
      const serachParams = this.filterParams(this.filters)
      this.$router.push({ name, params: { id: `${id}-1` }, query: serachParams })
    },
    /**
     * 删除筛选标签
     * @param {String} tag 列表标签
     */
    handleDeleteTag(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.filters.tags = this.dynamicTags.join()
      this.handleSearch()
    },
    /**
     * 添加筛选标签
     * @param {String} tag 列表标签
     */
    handleAddTag(tag) {
      if (this.dynamicTags.includes(tag)) return
      this.dynamicTags.push(tag)
      this.filters.tags = this.dynamicTags.join()
      this.handleSearch()
    },
    /**
     * 剔除对象中值为空的属性
     * @param {Object} data 源对象
     * @returns {Object}
     */
    filterParams(data) {
      const target = {}
      for (const key in data) {
        if (data[key] !== '') {
          target[key] = data[key]
        }
      }
      return target
    }
  }
}
