<template>
  <div class="search">
    <div class="search-wrap clearfix">
      <el-select v-model="listQuery.classify" size="large" class="search-classify">
        <el-option v-for="(item,index) in classifyOptions" :key="index" :label="item" :value="index" />
      </el-select>
      <el-input ref="searchKeyword" v-model="listQuery.keyword" class="search-input" size="large" placeholder="请输入关键字" />
      <span class="el-icon-search search__button" @click="handleSearch" />
    </div>
    <div class="search-hot">
      <p class="search-hot-header">
        <i class="tl-icon search-hot__icon">&#xe6e1;</i>
        <strong class="search-hot__title">热门推荐：</strong>
      </p>
      <a class="search-hot__link" @click="handleSearchHot('web前端')">web前端</a>
      <a class="search-hot__link" @click="handleSearchHot('二次元')">二次元</a>
    </div>
    <ol v-if="total > 0" class="search-list">
      <h3 class="search-list__result">检索到包含 {{ resultInfo.keyword }} 的{{ resultInfo.classify }} {{ total }} 篇</h3>
      <li v-for="item in searchList" :key="item.id" class="search-list-item el-row">
        <div class="search-list__thumb el-col el-col el-col-sm-10 el-col-md-6 el-col-lg-8">
          <nuxt-link :to="item.url">
            <img class="img-fluid" :src="item.imgurl" :alt="item.title">
          </nuxt-link>
        </div>
        <div class="search-list__info el-col el-col-sm-14 el-col-md-18 el-col-lg-16">
          <nuxt-link class="search-list__title" :to="item.url" v-html="item.title" />
          <p v-html="item.content" />
          <div class="search-list__classify">
            <nuxt-link v-for="info in item.classList" :key="info.name" :to="info.url" :title="info.name">{{ info.name }}</nuxt-link>
          </div>
        </div>
      </li>
    </ol>
    <div v-else class="search-noData">暂无数据</div>
    <!-- list page -->
    <div class="list-page">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit="20" @pagination="fetchList" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { GetSearchList } from '@/api/list'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      searchList: [],
      classifyOptions: ['全部', '文章', '壁纸', '番剧'],
      listQuery: {
        page: 1,
        classify: 0,
        keyword: ''
      },
      resultInfo: {},
      total: 0
    }
  },
  computed: {
    ...mapGetters(['configs'])
  },
  mounted() {
    const { keyword, classify } = this.$route.query

    if (keyword) {
      this.listQuery.keyword = keyword
      this.listQuery.classify = classify || 0

      this.fetchList()
    }
  },
  methods: {
    fetchList() {
      GetSearchList(this.listQuery).then(res => {
        const { count, data } = res.data
        this.total = count
        this.searchList = data

        const { keyword, classify } = this.listQuery
        this.resultInfo = {
          keyword,
          classify: this.classifyOptions[classify] || '文章'
        }
      })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.fetchList()
    },
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
.search{
  padding-top: 30px;
  &-hot{
    padding-top: 15px;
  }
  &-noData{
    height: 350px;
    line-height: 350px;
    text-align: center;
    font-size: 18px;
    color: #909399;
  }
  &-list{
    margin-top: 15px;
    background-color: #fff;
    border: 1px solid #EBEEF5;
    overflow: hidden;
    border-radius: 4px;
    &__result{
      padding: 10px 15px;
      font-size: 24px;
      font-weight: normal;
      color: #303133;
    }
    &-item{
      padding: 10px 15px;
      background: #fff;
      border-top: 1px solid #EBEEF5;
      margin-top: -1px;
      position: relative;
    }
    em{
      color: #f56c6c;
      padding: 0 5px;
    }
    &__thumb{
      img{
        border-radius: 4px;
        overflow: hidden;
      }
    }
    &__info{
      padding-left: 15px;
      p{
        font-size: 15px;
        color: #606266;
        line-height: 1.6em;
      }
    }
    &__title{
      display: inline-block;
      font-size: 20px;
      margin: 5px 0 10px;
      color: #303133;
      &:hover{
        color: $primary;
      }
    }
    &__classify{
      position: absolute;
      bottom: 15px;
      color: #909399;
      margin-left: -5px;
      a{
        font-size: 14px;
        color: $primary;
        margin: 0 5px;
        &:hover{
          color:#f56c6c;
        }
      }
    }
  }
}
</style>
