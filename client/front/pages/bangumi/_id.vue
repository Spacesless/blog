<template>
  <div class="bangumi">
    <div class="banner">
      <img
        class="img-fluid"
        width="1280"
        height="500"
        :src="bannerImage"
        :srcset="bannerImage | getImageSrcSet(1280)"
        alt="番剧"
      >
      <p class="banner__title">以一朵花的姿态，花开成景，花落成诗</p>
    </div>
    <el-form class="filter" label-width="40px" label-position="left">
      <el-form-item label="排序">
        <el-select v-model="filters.sortBy" placeholder="请选择排序方式" @change="handleSearch">
          <el-option label="更新时间" value="" />
          <el-option label="发布时间" value="addtime" />
          <el-option label="推荐指数" value="ratings" />
        </el-select>
        <el-radio-group v-model="filters.orderBy" @change="handleSearch">
          <el-radio-button label="">降序</el-radio-button>
          <el-radio-button label="asc">升序</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="filters.status" @change="handleSearch">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="0">未上映</el-radio-button>
          <el-radio-button label="1">连载中</el-radio-button>
          <el-radio-button label="2">已完结</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="进度">
        <el-radio-group v-model="filters.progress" @change="handleSearch">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="0">在看</el-radio-button>
          <el-radio-button label="1">看过</el-radio-button>
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
    <!--bangumi list-->
    <div class="bangumi-list">
      <el-row :gutter="20">
        <el-col v-for="item in bangumiList" :key="item.id" :xs="24" :sm="12">
          <el-row class="bangumi-list-item">
            <el-col class="bangumi-list-cover" :span="8" :xl="10">
              <nuxt-link :to="'/bangumi/detail/' + item.id">
                <img
                  class="img-fluid"
                  :width="configs.bangumi_width"
                  :height="configs.bangumi_height"
                  :src="item.imgurl"
                  :srcset="item.imgurl | getImageSrcSet(configs.bangumi_width)"
                  :alt="item.title"
                >
                <span class="bangumi-list__ratings">{{ item.ratings }}</span>
              </nuxt-link>
            </el-col>
            <el-col class="bangumi-list-info" :span="16" :xl="14">
              <nuxt-link class="bangumi-list__title" :to="'/bangumi/detail/' + item.id">{{ item.title }}</nuxt-link>
              <p><span class="para-name">时间：</span>{{ item.showtime }}</p>
              <p><span class="para-name">状态：</span>{{ item.status | bangumiStatus }}</p>
              <p class="hidden-sm-and-down"><span class="para-name">简介：</span>{{ item.description }}……</p>
              <div class="bangumi-list-tag">
                <span
                  v-for="(tag,index) in item.tag"
                  :key="index"
                  class="tl-tag"
                  :class="tag | tagClassName"
                  @click="handleAddTag(tag)"
                >{{ tag }}</span>
              </div>
              <div class="bangumi-progress clearfix">
                <span class="para-name">进度：</span>
                <div class="el-progress el-progress--line">
                  <div class="el-progress-bar">
                    <div class="el-progress-bar__outer">
                      <div class="el-progress-bar__inner" :style="'width:' + item.current / item.total * 100 + '%'" />
                    </div>
                  </div>
                  <div v-if="item.total" class="el-progress__text">{{ item.current }}/{{ item.total }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!--list paper-->
      <div class="list-page">
        <pagination :is-admin="false" :total="total" :page.sync="listPage.page" :limit="listPage.pageSize" @pagination="changeListPage" />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '#/components/Pagination'
import { pageMeta, listPage } from '@/mixins'
import { getAbsolutePath } from '#/utils'

export default {
  components: {
    Pagination
  },
  mixins: [pageMeta, listPage],
  async asyncData({ app, params, query, $axios }) {
    const paramId = params.id
    const [id, page] = paramId ? paramId.split('-') : []
    const { sortBy, orderBy, status, progress, tags } = query
    const list = await $axios.$get('/bangumi/list', {
      params: {
        id: id === 'list' ? null : id,
        page,
        sortBy,
        orderBy,
        status,
        progress,
        tags
      }
    })
    return {
      listPage: {
        page: +page || 1,
        pageSize: list.pageSize
      },
      total: list.count,
      bangumiList: list.data,
      filters: {
        sortBy: sortBy || '',
        orderBy: orderBy || '',
        status: status || '',
        progress: progress || '',
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
    bannerImage() {
      return getAbsolutePath('/static/img/bangumi-banner.jpg')
    },
    configs() {
      return this.$store.getters.configs
    }
  },
  watchQuery: ['sortBy', 'orderBy', 'status', 'progress', 'tags']
}
</script>

<style lang="scss" scoped>
@import "~@/styles/list.scss";
@import "~@/styles/bangumi.scss";
</style>
