import { parseTime } from '@/utils'

export const listPage = {
  data() {
    return {
      total: 0,
      listPage: {
        page: 1,
        limit: 20
      }
    }
  },
  methods: {
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
      search: {},
      dynamicTags: []
    }
  },
  methods: {
    handleSearch(key) {
      const path = this.$route.fullPath
      const query = {}
      query[key] = this.search[key]
      this.$router.push({ path, query })
    },
    handleDeleteTag(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.search.tags = this.dynamicTags.join()
      this.handleSearch('tags')
    },
    handleAddTag(tag) {
      if (this.dynamicTags.includes(tag)) return
      this.dynamicTags.push(tag)
      this.search.tags = this.dynamicTags.join()
      this.handleSearch('tags')
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
     * @summary 标签charCodeAt总长度模8
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
    accessStatistics(module, id) {
      this.$axios.post('/global/access', { module, id })
    }
  }
}
