<template>
  <div class="article">
    <h2 class="tl__title">文章笔记</h2>
    <!-- 一言 -->
    <Hitokoto :kinds="['k']" />
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
        class="article-item"
        :class="index % 2 === 0 ? 'article-item--odd' : 'article-item--even'"
      >
        <el-col class="article-item-cover" :sm="24" :md="14">
          <nuxt-link :to="'/article/detail/' + item.id" :title="item.title">
            <img
              class="img-full"
              :width="configs.article_width"
              :height="configs.article_height"
              :src="item.imgurl"
              :srcset="item.imgurl | getImageSrcSet(configs.article_width)"
              :alt="item.title"
            >
          </nuxt-link>
        </el-col>
        <el-col class="article-item-info" :sm="24" :md="10">
          <p class="article-item-info__time">{{ item.updatetime | parseTime }}</p>
          <div class="article-item-info-title">
            <nuxt-link class="article-item-info__url" :to="'/article/detail/' + item.id" :title="item.title">{{ item.title }}</nuxt-link>
          </div>
          <p class="article-item-info__desc">{{ item.description }}</p>
          <div class="article-item-info-tags">
            <span
              v-for="(tag,childIndex) in item.tag"
              :key="childIndex"
              class="tl-tag"
              :class="tag | tagClassName"
              @click="handleAddTag(tag)"
            >{{ tag }}</span>
          </div>
          <div class="article-item-info-stuff">
            <span><i class="icon-wenzi"></i>{{ item.word_count }}</span>
            <span><i class="icon-chakan"></i>{{ item.hits }}</span>
            <span><i class="icon-pinglun"></i>{{ item.comment_count }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--list paper-->
    <div class="list-page">
      <pagination :is-admin="false" :total="total" :page.sync="listPage.page" :limit="listPage.pageSize" @pagination="changeListPage" />
    </div>
  </div>
</template>

<script>
import Hitokoto from '@/components/Hitokoto'
import Pagination from '#/components/Pagination'
import { pageMeta, listPage } from '@/mixins'

export default {
  components: {
    Hitokoto,
    Pagination
  },
  filters: {
    parseTime(time) {
      const monthEnum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
      const dateTime = new Date(time)
      const year = dateTime.getFullYear()
      const month = dateTime.getMonth()
      const date = dateTime.getDate()
      return `${monthEnum[month]}月 ${date}, ${year}`
    }
  },
  mixins: [pageMeta, listPage],
  async asyncData({ app, params, query, $axios }) {
    const paramId = params.id
    const [id, page] = paramId ? paramId.split('-') : []
    const { sortBy, orderBy, tags } = query

    const list = await $axios.$get('/article/list', {
      params: {
        id: id === 'list' ? null : id,
        page,
        sortBy,
        orderBy,
        tags
      }
    })

    return {
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
  data() {
    return {
      pageType: 'list'
    }
  },
  computed: {
    configs() {
      return this.$store.getters.configs
    }
  },
  watchQuery: ['sortBy', 'orderBy', 'tags']
}
</script>

<style lang="scss" scoped>
@import "~@/styles/components/list.scss";

.article{
  &-item{
    position: relative;
    z-index: 6;
    margin-bottom: $grid-space * 6;
    &:last-child{
      margin-bottom: 48px;
    }
    @media (max-width: 992px)  {
      margin-bottom: 48px;
    }
    &-cover{
      overflow: hidden;
      display: inline-block;
      float: none;
      position: relative;
      z-index: 5;
      border-radius: $border-radius;
      box-shadow: $shadow-3-down;
      &__picture{
        display: block;
        width: 100%;
      }
    }
    &-info{
      position: absolute;
      top: 6%;
      bottom: 6%;
      padding: 5%;
      background-color: var(--bg-normal);
      box-shadow: $shadow-3-right;
      @media (max-width: 992px) {
        position: static;
        height: auto;
        border-radius: $border-radius;
      }
      &__time{
        color: var(--color-secondary);
        font-size: 14px;
      }
      &-title{
        margin-top: 8px;
        font-size: 24px;
        line-height: 30px;
        word-break: break-all;
      }
      &__url{
        color: var(--color-heading);
        &:hover{
          color: var(--color-primary);
        }
      }
      &__desc{
        margin: 10px 0;
        color: var(--color-text);
        font-size: 15px;
        line-height: 22px;
      }
      &-stuff{
        position: absolute;
        bottom: 15%;
        color: var(--color-secondary);
        font-size: 14px;
        span{
          margin-right: 16px;
        }
        .tl-icon{
          margin-top: -2px;
          margin-right: 4px;
          font-size: 17px;
        }
        @media (max-width: 992px) {
          position: static;
        }
      }
    }
    &--odd &-info{
      right: 0;
      border-top-right-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }
    &--even{
      text-align: right;
    }
    &--even &-info{
      left: 0;
      text-align: left;
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
    }
  }
}
</style>
