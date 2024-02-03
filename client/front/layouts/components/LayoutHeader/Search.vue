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
      <div class="search-wrap container clearfix">
        <el-select v-model="listQuery.classify" size="large" class="search-classify">
          <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value" />
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
      <div class="search-hot container hidden-md-and-down">
        <p class="search-hot-header">
          <i class="el-icon-star-off search-hot__icon" />
          <strong class="search-hot__title">热门搜索：</strong>
        </p>
        <a class="search-hot__link" @click="handleSearchHot('web')">web</a>
        <a class="search-hot__link" @click="handleSearchHot('Api')">Api</a>
        <a class="search-hot__link" @click="handleSearchHot('徒步')">徒步</a>
      </div>

      <div v-loading="fetchLoading" class="search-list">
        <h3 class="search-list__result">
          <template v-if="total">
            检索到包含 {{ resultInfo.keyword }} 的{{ resultInfo.classify }} {{ total }} 篇
          </template>
          <template v-else>
            啥也没找着
          </template>
        </h3>
        <div class="search-list-wrapper">
          <div v-if="total" class="container">
            <ul v-for="(item, index) in searchList" :key="index" class="search-list-item">
              <li class="search-list__info">
                <span class="search-list__count">{{ index + 1 + (listQuery.page - 1) * 10 }}</span>
                <nuxt-link class="search-list__title" :to="item.url" @click.native="onClose">
                  <span v-html="highlightKeyword(item.title)" />
                </nuxt-link>
                <span v-if="item.categoryUrl" class="search-list-classify">
                  <span class="search-list-classify__separator">-</span>
                  <nuxt-link class="search-list-classify__link" :title="item.categoryName" :to="item.categoryUrl" @click.native="onClose">{{ item.categoryName }}</nuxt-link>
                </span>
                <p class="search-list__content" v-html="highlightKeyword(item.content)" />
              </li>
            </ul>
          </div>
          <div v-else class="search-list__placeholder" />
        </div>
        <!-- list page -->
        <div class="list-page">
          <pagination :is-admin="false" :total="total" :page.sync="listQuery.page" :limit="10" @pagination="fetchList" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import Pagination from '#/components/Pagination'

const classifyOptions = [
  { value: '', label: '全部' },
  { value: 'article', label: '文章' },
  { value: 'bangumi', label: '番剧' }
]

export default {
  name: 'HeaderSearch',
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
  data () {
    return {
      classifyOptions,
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
    searchVisible: {
      handler (isShow) {
        this.visible = isShow
        if (isShow) {
          setTimeout(() => {
            this.$refs.searchKeyword.focus()
          }, 0)
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchList () {
      this.fetchLoading = true
      await this.$axios.$get('/search', { params: this.listQuery }).then((res) => {
        const { count, data } = res
        this.total = count
        this.searchList = data

        this.searchList.forEach((element) => {
          const { id, type, category_id: categoryId } = element
          element.url = `/${type}/detail/${id}`
          const findCategory = this.categories.find(item => item.id === categoryId)
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
      }).catch(() => {
        this.total = 0
        this.searchList = []
      })
      this.fetchLoading = false
    },
    handleSearch () {
      this.listQuery.page = 1
      this.fetchList()
    },
    /**
     * 搜索热门关键词
     * @param {String} keyword 关键词
     */
    handleSearchHot (keyword) {
      this.listQuery.keyword = keyword
      this.listQuery.classify = null
      this.handleSearch()
    },
    onClose () {
      this.$emit('onCloseSearch')
    },
    /**
     * 高亮显示关键字
     * @param {String} str
     * @returns {String}
     */
    highlightKeyword (str) {
      const keyword = this.resultInfo.keyword
      const Reg = new RegExp(keyword, 'gi')
      const res = str?.replace(Reg, (arg) => {
        return '<span class="search-list--highlight">' + arg + '</span>'
      })
      return res || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  clear: both;

  .container {
    min-height: auto;
  }

  &-drawer {
    height: auto;
    outline: none;

    .el-drawer__header > :first-child {
      outline: none;
    }
  }

  &-wrap {
    position: relative;
  }

  &-classify {
    float: left;
    margin-right: 15px;

    @media (max-width: 769px) {
      float: none;
      width: 100%;
      margin-right: 15px;
      margin-bottom: 15px;
    }
  }

  &-input {
    position: relative;
    display: block;
    width: auto;
    overflow: hidden;

    &__button {
      position: absolute;
      top: 0;
      right: 0;
      display: inline-block;
      width: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  &-hot {
    padding-top: $grid-space;

    &-header {
      display: inline-block;
      font-size: 18px;
    }

    &__icon {
      color: #F56C6C;
    }

    &__title {
      font-weight: normal;
    }

    &__link {
      display: inline-block;
      padding: 6px 16px;
      margin-right: 8px;
      margin-bottom: 8px;
      font-size: 12px;
      color: var(--color-primary);
      cursor: pointer;
      background-color: #ECF5FF;
      border-radius: 15px;
    }
  }

  &-list {
    height: calc(100vh - 168px);

    &-wrapper {
      height: calc(100% - 120px);
      overflow-y: auto;
    }

    &__placeholder {
      height: 100%;
      background: var(--empty-background);
      background-size: contain;
    }

    &__result {
      padding: 8px 0 16px;
      font-size: 22px;
      font-weight: normal;
      text-align: center;
    }

    &-item {
      position: relative;
      min-height: 48px;
      padding: 12px 16px 12px 86px;
      margin-bottom: 2px;
      background: var(--bg);
      border-radius: $border-radius;
    }

    &__count {
      position: absolute;
      top: 50%;
      left: 0;
      width: 86px;
      margin-top: -24px;
      font-size: 36px;
      font-style: italic;
      text-align: center;
    }

    &__title {
      font-size: 18px;
      color: var(--color-heading);

      &:hover {
        color: var(--color-primary);
      }
    }

    &-classify {
      font-size: 14px;

      &__separator {
        margin: 0 8px;
        color: var(--color-secondary);
      }

      &__link {
        color: var(--color-secondary);

        &:hover {
          color: var(--color-primary);
        }
      }
    }

    &__content {
      padding-top: 6px;
      font-size: 14px;
      line-height: 1.7;
      color: var(--color-text);
    }

    ::v-deep &--highlight {
      color: #F56C6C;
    }
  }

  .list-page {
    padding: 16px 0;
    text-align: center;
  }
}
</style>
