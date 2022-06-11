import { mapGetters } from 'vuex'

// 设置页面Meta
export const pageMeta = {
  data () {
    return {
      pageType: 'page',
      pageName: ''
    }
  },
  computed: {
    ...mapGetters(['categories', 'configs']),
    findCategory () {
      const { path, params } = this.$route
      let result
      switch (this.pageType) {
        case 'list': {
          const [id] = params?.id?.split('-') || []
          result = id && this.categories.find(item => item.id === +id)
          break
        }
        case 'detail': {
          const categoryId = this.data.category_id
          result = this.categories.find(item => item.id === categoryId)
          break
        }
        default:
          result = this.categories.find(item => item.filename && path.includes(item.filename))
          break
      }
      return result || {}
    },
    /**
     * 设置页面Meta属性
     * @returns {title: '页面标题', keyword: '关键字', description: '描述'}
     */
    meta () {
      const { sitename, keywords, description } = this.configs
      const { name: title, keywords: cateKeywords, description: cateDescription } = this.findCategory
      if (this.pageType === 'detail') {
        const { title: contentTitle, keywords: contentKeyword, description: contentDescription } = this.data
        return {
          title: `${contentTitle} ${title ? '- ' + title : ''} - ${sitename}`,
          keyword: contentKeyword || keywords,
          description: contentDescription || description
        }
      } else {
        const pageTitle = this.pageName || title
        return {
          keyword: cateKeywords || keywords,
          description: cateDescription || description,
          title: pageTitle ? `${pageTitle} -  ${sitename}` : sitename
        }
      }
    }
  },
  head () {
    return {
      title: this.meta.title,
      meta: [
        { hid: 'description', name: 'description', content: this.meta.description },
        { hid: 'keyword', name: 'keyword', content: this.meta.keyword }
      ]
    }
  },
  mounted () {
    if (this.pageType === 'detail') {
      this.setActiveMenu()
    }
  },
  methods: {
    /**
     * 详情页设置侧边菜单激活状态
     */
    setActiveMenu () {
      const { id, type } = this.findCategory
      const activeMenu = id ? `/${type}/${id}` : ''
      this.$store.commit('SET_ACTIVE_MENU', activeMenu)
    }
  }
}

// 列表页，分页、查询
export const listPage = {
  data () {
    return {
      total: 0,
      listPage: {
        page: 1,
        pageSize: 20
      },
      filters: {},
      dynamicTags: []
    }
  },
  methods: {
    /**
     * 列表分页切换
     * @param {Object} { page: 当前页, limit: 每页个数 }
     */
    changeListPage ({ page }) {
      const { name, params, query } = this.$route
      const [id] = params.id ? params.id.split('-') : ['list']
      this.$router.push({ name, params: { id: `${id}-${page}` }, query })
    },
    handleSearch () {
      const { name, params } = this.$route
      const [id] = params.id ? params.id.split('-') : ['list']
      const serachParams = this.filterParams(this.filters)
      this.$router.push({ name, params: { id: `${id}-1` }, query: serachParams })
    },
    /**
     * 删除筛选标签
     * @param {String} tag 列表标签
     */
    handleDeleteTag (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.filters.tags = this.dynamicTags.join()
      this.handleSearch()
    },
    /**
     * 添加筛选标签
     * @param {String} tag 列表标签
     */
    handleAddTag (tag) {
      if (this.dynamicTags.includes(tag)) { return }
      this.dynamicTags.push(tag)
      this.filters.tags = this.dynamicTags.join()
      this.handleSearch()
    },
    /**
     * 剔除对象中值为空的属性
     * @param {Object} data 源对象
     * @returns {Object}
     */
    filterParams (data) {
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
