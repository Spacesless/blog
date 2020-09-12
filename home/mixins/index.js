import { parseTime } from '@/utils'

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

export const globalFilter = {
  filters: {
    /**
     * 截取字符串
     * @param {Number [int]} index 开始下标
     * @param {Number [int]} length 截取长度
     */
    substr(str, index, length) {
      return str.substr(index, length)
    },
    /**
     * 格式化时间
     * @param {String} format {y}-{m}-{d} {h}:{i}:{s}
     */
    moment(time, format) {
      return parseTime(time, format)
    },
    bangumiStatus(status) {
      status = status || 0
      const statusList = ['未上映', '连载中', '已完结']
      return statusList[status]
    },
    cdnAccess(url) {
      const isDev = process.env.NODE_ENV === 'development'
      return isDev ? url : '//cdn.timelessq.com' + url
    },
    /**
     * 计算tag的classname
     * @param {String} tag 标签名称
     * @returns {String}
     * @summary 标签charCodeAt总长度%颜色总数
     */
    tagClassName(tag) {
      const nameEnum = ['red', 'geekblue', 'orange', 'cyan', 'green', 'blue', 'purple', 'magenta']
      const enumLength = nameEnum.length
      let tagLength = 0
      for (let i = 0; i < tag.length; i++) {
        const charCode = tag.charCodeAt(i)
        tagLength += charCode
      }
      const findName = nameEnum[tagLength % enumLength]
      return findName ? `tl-tag--${findName}` : ''
    }
  }
}

export const contentPage = {
  methods: {
    accessStatistics(type, id) {
      this.$axios.post('/general/access', { type, id })
    }
  }
}
