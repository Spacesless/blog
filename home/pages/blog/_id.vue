<template>
  <div class="blog">
    <!-- filter -->
    <el-form class="filter">
      <el-form-item label="列表排序">
        <el-select v-model="search.sortBy" placeholder="请选择排序方式" @change="handleSearch('sortBy')">
          <el-option label="更新时间" value="updatetime" />
          <el-option label="发布时间" value="addtime" />
          <el-option label="浏览次数" value="hits" />
        </el-select>
        <el-radio-group v-model="search.orderBy" @change="handleSearch('orderBy')">
          <el-radio-button label="asc">升序</el-radio-button>
          <el-radio-button label="desc">降序</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dynamicTags.length" label="标签">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleDeleteTag(tag)"
        >
          {{ tag }}
        </el-tag>
      </el-form-item>
    </el-form>
    <!--blog list-->
    <div class="blog-list">
      <el-row
        v-for="(item, index) in blogList"
        :key="item.id"
        class="blog-list-item"
      >
        <el-col
          :sm="index % 2 === 0 ? 12 : { span: 12, push: 12 }"
          :md="index % 2 === 0 ? 10 : { span: 10, push: 14 }"
        >
          <nuxt-link :to="'/blog/content/' + item.id" :title="item.title">
            <img class="img-full" :src="item.imgurl" :alt="item.title">
          </nuxt-link>
        </el-col>
        <el-col
          class="blog-list-content"
          :sm="index % 2 === 0 ? 12 : { span: 12, pull: 12 }"
          :md="index % 2 === 0 ? 14 : { span: 14, pull: 10 }"
        >
          <nuxt-link class="blog-list__title" :to="'/blog/content/' + item.id" :title="item.title">{{ item.title }}</nuxt-link>
          <div class="blog-list-info">
            <span><i class="tl-icon">&#xe70b;</i>{{ item.updatetime }}</span>
            <span><i class="tl-icon">&#xe601;</i>{{ item.hits }}</span>
          </div>
          <div class="blog-list-tag">
            <span
              v-for="(child, childIndex) in tag"
              :key="childIndex"
              class="tl-tag"
              :class="item | tagClassName"
              @click="handleAddTag(item)"
            >{{ item }}</span>
          </div>
          <p class="blog-list__desc">{{ item.description | substr(0, 120) }}</p>
        </el-col>
      </el-row>
      <!--list paper-->
      <div class="list-page">
        <pagination v-show="total>0" :total="total" :page.sync="listPage.page" :limit="listPage.limit" @pagination="changeListPage" />
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
    const { sortBy, orderBy } = query
    const { seo, list } = await $axios.$get('/blog/list', {
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
        limit: list.pageSize
      },
      total: list.count,
      blogList: list.data,
      search: {
        sortBy: sortBy || 'updatetime',
        orderBy: orderBy || 'desc'
      }
    }
  },
  watchQuery: ['sortBy', 'orderBy'],
  head() {
    return {
      title: this.seo.title,
      meta: [
        { hid: 'description', name: 'description', content: this.seo.description },
        { hid: 'keyword', name: 'keyword', content: this.seo.keyword }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-list{
  &-item{
    margin-bottom: 15px;
    border: 1px solid #EBEEF5;
    background: #fff;
    font-size: 15px;
    border-radius: 4px;
    transition: all .3s;
    &:hover{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
  &-content{
    padding: 10px 15px;
  }
  &-info{
    color: #909399;
    font-size: 14px;
    line-height: 2em;
    i{
      margin-right: 3px;
    }
    span{
      margin-right: 5px
    }
  }
  &__title{
    overflow: hidden;
    display: inline-block;
    color: #303133;
    font-size: 24px;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover{
      color: $primary;
    }
  }
  &__desc{
    color: #606266;
    font-size: 15px;
    line-height: 1.6em;
  }
}
</style>
