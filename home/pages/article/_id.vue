<template>
  <div class="article">
    <!-- filter -->
    <el-form class="filter" label-width="40px" label-position="left">
      <el-form-item label="排序">
        <el-select v-model="filters.sortBy" placeholder="请选择排序方式" @change="handleSearch">
          <el-option label="更新时间" value="" />
          <el-option label="发布时间" value="addtime" />
          <el-option label="浏览次数" value="hits" />
        </el-select>
        <el-radio-group v-model="filters.orderBy" @change="handleSearch">
          <el-radio-button label="">降序</el-radio-button>
          <el-radio-button label="asc">升序</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dynamicTags.length" label="标签">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          size="medium"
          :disable-transitions="false"
          @close="handleDeleteTag(tag)"
        >{{ tag }}</el-tag>
      </el-form-item>
    </el-form>
    <!--article list-->
    <div class="article-list">
      <el-row
        v-for="(item, index) in articleList"
        :key="item.id"
        class="article-item article-item--odd"
        :class="index % 2 === 0 ? 'article-item--even' : 'article-item--odd'"
      >
        <el-col class="article-item-cover" :sm="24" :md="14">
          <nuxt-link :to="'/article/detail/' + item.id" :title="item.title">
            <img class="img-full" :src="item.imgurl" :alt="item.title">
          </nuxt-link>
        </el-col>
        <el-col class="article-item-info" :sm="24" :md="10">
          <p class="article-item__time">{{ item.updatetime | parseTime }}</p>
          <div class="article-item-title">
            <nuxt-link :to="item.id" :title="item.title">{{ item.title }}</nuxt-link>
          </div>
          <p class="article-item__desc">{{ item.description }}</p>
          <div class="article-item-tags">
            <span
              v-for="(tag,childIndex) in item.tag"
              :key="childIndex"
              class="tl-tag"
              :class="tag | tagClassName"
              @click="handleAddTag(tag)"
            >{{ tag }}</span>
          </div>
          <div class="article-item-stuff">
            <span>icon</span>
          </div>
        </el-col>
      </el-row>
      <!--list paper-->
      <div class="list-page">
        <pagination :total="total" :page.sync="listPage.page" :limit="listPage.pageSize" @pagination="changeListPage" />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { listQuery, listPage, globalFilter } from '@/mixins'

export default {
  components: {
    Pagination
  },
  mixins: [listQuery, listPage, globalFilter],
  async asyncData({ app, params, query, $axios }) {
    const paramId = params.id
    const [id, page] = paramId ? paramId.split('-') : []
    const { sortBy, orderBy, tags } = query
    const { seo, list } = await $axios.$get('/article/list', {
      params: {
        id: id === 'list' ? null : id,
        page,
        sortBy,
        orderBy
      }
    })
    return {
      seo,
      listPage: {
        page: +page || 1,
        pageSize: list.pageSize
      },
      total: list.count,
      articleList: list.data,
      filters: {
        sortBy: sortBy || '',
        orderBy: orderBy || '',
        tags: tags || ''
      },
      dynamicTags: tags ? tags.split(',') : []
    }
  },
  head() {
    return {
      title: this.seo.title,
      meta: [
        { hid: 'description', name: 'description', content: this.seo.description },
        { hid: 'keyword', name: 'keyword', content: this.seo.keyword }
      ]
    }
  },
  watchQuery: ['sortBy', 'orderBy', 'tags']
}
</script>

<style lang="scss" scoped>
.arcitle{
  &-item{
    position: relative;
    margin-bottom: 100px;
    &:last-child{
      margin-bottom: 0;
    }
    @media (max-width: 992px)  {
      margin-top: 30px;
    }
    &-cover{
      overflow: hidden;
      display: inline-block;
      float: none;
      border: 1px solid #eaeaea;
      border-radius: 4px;
      &__picture{
        display: block;
        width: 100%;
      }
    }
    &-info{
      position: absolute;
      top: 50%;
      height: 400px;
      margin-top: -200px;
      border: 1px solid #eaeaea;
      @media (max-width: 992px) {
        position: static;
        height: auto;
        border: none;
      }
      @media (min-width: 992px) {
        height: 300px;
        margin-top: -150px;
      }
      @media (min-width: 1200px) {
        height: 360px;
        margin-top: -180px;
      }
    }
    &--odd &-info{
      right: 0;
      border-left: none;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    &--even{
      text-align: right;
    }
    &--even &-info{
      left: 0;
      border-right: none;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      text-align: left;
    }
  }
}
</style>
