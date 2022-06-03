<template>
  <el-drawer
    title="站内搜索"
    :append-to-body="true"
    custom-class="search-drawer"
    direction="ttb"
    :visible.sync="visible"
    size="100%"
    @close="onClose"
  >
    <div class="search">
      <div class="container">
        <div class="search-wrap clearfix">
          <el-select v-model="listQuery.classify" size="large" class="search-classify">
            <el-option label="全部" value="" />
            <el-option label="文章" value="article" />
            <el-option label="番剧" value="bangumi" />
          </el-select>
          <div class="search-input">
            <el-input
              ref="searchKeyword"
              v-model="listQuery.keyword"
              size="large"
              placeholder="请输入关键字"
              @keyup.enter.native="handleSearch"
            />
            <span class="el-icon-search search-input__button" @click="handleSearch" />
          </div>
        </div>
        <div class="search-hot hidden-md-and-down">
          <p class="search-hot-header">
            <i class="tl-icon search-hot__icon">&#xe6e1;</i>
            <strong class="search-hot__title">热门推荐：</strong>
          </p>
          <a class="search-hot__link" @click="handleSearchHot('web前端')">web前端</a>
          <a class="search-hot__link" @click="handleSearchHot('二次元')">二次元</a>
        </div>

        <div class="search-list">
          <div v-if="total > 0" class="search-list tl-card">
            <h3 class="search-list__result">检索到包含 {{ resultInfo.keyword }} 的{{ resultInfo.classify }} {{ total }} 篇</h3>
            <el-row v-for="item in searchList" :key="item.id" class="search-list-item">
              <el-col class="search-list__info">
                <nuxt-link class="search-list__title" :to="item.url" v-html="item.title" />
                <p v-html="item.content" />
                <div v-if="item.categoryUrl" class="search-list__classify">
                  <nuxt-link :title="item.categoryName" :to="item.categoryUrl">{{ item.categoryName }}</nuxt-link>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-else class="search-noData">暂无数据</div>
          <!-- list page -->
          <div class="list-page">
            <pagination :is-admin="false" :total="total" :page.sync="listQuery.page" :limit="20" @pagination="fetchList" />
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import Pagination from '#/components/Pagination'

export default {
  components: {
    Pagination
  },
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    searchVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      listQuery: {
        page: 1,
        classify: '',
        keyword: ''
      },
      searchList: [],
      resultInfo: {},
      total: 0,
      fetchLoading: false
    }
  },
  watch: {
    searchVisible(isShow) {
      this.visible = isShow
      if (isShow) {
        setTimeout(() => {
          this.$refs.searchKeyword.focus()
        }, 0)
      }
    }
  },
  methods: {
    async fetchList() {
      this.total = 0
      this.searchList = []
      this.fetchLoading = true
      await this.$axios.$get('/search', { params: this.listQuery }).then(res => {
        const { count, data } = res
        this.total = count
        this.searchList = data

        this.searchList.forEach(element => {
          const { id, type, category_id } = element
          element.url = `/${type}/detail/${id}`
          const findCategory = this.categories.find(item => item.id === category_id)
          if (findCategory) {
            element.categoryUrl = `/${findCategory.type}/${findCategory.id}`
            element.categoryName = findCategory.name
          }
        })

        const { keyword, classify } = this.listQuery
        const findClassify = this.classifyOptions.find(item => item.value === classify)
        this.resultInfo = {
          keyword,
          classify: findClassify ? findClassify.value : '文章'
        }
      }).catch(() => {})
      this.fetchLoading = false
    },
    handleSearch() {
      this.listQuery.page = 1
      this.fetchList()
    },
    /**
     * 搜索热门关键词
     * @param {String} keyword 关键词
     */
    handleSearchHot(keyword) {
      this.listQuery.keyword = keyword
      this.listQuery.classify = null
      this.handleSearch()
    },
    onClose() {
      this.$emit('onCloseSearch')
    }
  }
}
</script>
