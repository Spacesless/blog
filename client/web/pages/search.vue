<template>
  <div class="search">
    <div class="search-wrap clearfix">
      <el-select v-model="listQuery.classify" size="large" class="search-classify">
        <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input
        ref="searchKeyword"
        v-model="listQuery.keyword"
        class="search-input"
        size="large"
        placeholder="请输入关键字"
        @keyup.enter.native="handleSearch"
      />
      <span class="el-icon-search search-input__button" @click="handleSearch" />
    </div>
    <div class="search-hot">
      <p class="search-hot-header">
        <i class="tl-icon search-hot__icon">&#xe6e1;</i>
        <strong class="search-hot__title">热门推荐：</strong>
      </p>
      <a class="search-hot__link" @click="handleSearchHot('web前端')">web前端</a>
      <a class="search-hot__link" @click="handleSearchHot('二次元')">二次元</a>
    </div>
    <div v-if="total > 0" class="search-list">
      <h3 class="search-list__result">检索到包含 {{ resultInfo.keyword }} 的{{ resultInfo.classify }} {{ total }} 篇</h3>
      <el-row v-for="item in searchList" :key="item.id" class="search-list-item">
        <el-col class="search-list__thumb" :sm="10" :md="6" :lg="8">
          <nuxt-link :to="item.url">
            <img class="img-fluid" :src="item.imgurl" :alt="item.title">
          </nuxt-link>
        </el-col>
        <el-col class="search-list__info" :sm="14" :md="18" :lg="16">
          <nuxt-link class="search-list__title" :to="item.url" v-html="item.title" />
          <p v-html="item.content" />
          <div class="search-list__classify">
            <nuxt-link v-for="info in item.classList" :key="info.name" :to="info.url" :title="info.name">{{ info.name }}</nuxt-link>
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
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '#/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      searchList: [],
      classifyOptions: [{
        label: '全部',
        value: ''
      },
      {
        label: '文章',
        value: 'article'
      },
      {
        label: '番剧',
        value: 'bangumi'
      }],
      listQuery: {
        page: 1,
        classify: '',
        keyword: ''
      },
      resultInfo: {},
      total: 0,
      fetchLoading: false
    }
  },
  computed: {
    ...mapGetters(['configs'])
  },
  mounted() {
    const { keyword, classify } = this.$route.query

    if (keyword) {
      this.listQuery.keyword = keyword
      this.listQuery.classify = classify || ''

      this.fetchList()
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
    }
  },
  head() {
    const { sitename, keywords, description } = this.configs
    return {
      title: `站内搜索 - ${sitename}`,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'keyword', name: 'keyword', content: keywords }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/list.scss";

.search{
  padding-top: 50px;
  &-noData{
    height: 350px;
    color: var(--color-secondary);
    font-size: 18px;
    line-height: 350px;
    text-align: center;
  }
  &-list{
    overflow: hidden;
    margin-top: 15px;
    border: 1px solid var(--border-color);
    background-color: var(--bg-normal);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    &__result{
      padding: 10px 15px;
      color: var(--color-main);
      font-size: 24px;
      font-weight: normal;
    }
    &-item{
      position: relative;
      margin-top: -1px;
      padding: 10px 15px;
      border-top: 1px solid var(--border-color);
    }
    em{
      padding: 0 5px;
      color: #f56c6c;
    }
    &__thumb{
      img{
        overflow: hidden;
        border-radius: 4px;
      }
    }
    &__info{
      padding-left: 15px;
      p{
        font-size: 15px;
        line-height: 1.6em;
      }
    }
    &__title{
      display: inline-block;
      margin: 5px 0 10px;
      color: var(--color-main);
      font-size: 20px;
      &:hover{
        color: var(--color-primary);
      }
    }
    &__classify{
      position: absolute;
      bottom: 15px;
      margin-left: -5px;
      color: var(--color-secondary);
      a{
        margin: 0 5px;
        color: var(--color-primary);
        font-size: 14px;
        &:hover{
          color:#f56c6c;
        }
      }
    }
  }
}
</style>
