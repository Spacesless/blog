<template>
  <div class="wallpaper">
    <el-form class="filter" label-width="70px" label-position="left">
      <el-form-item label="列表排序">
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
      <el-form-item label="壁纸尺寸">
        <el-select v-model="filters.resolutions" placeholder="请选择分辨率" @change="handleSearch">
          <el-option label="所有分辨率" value="" />
          <el-option value="1920x1080">
            <span class="filter-item__option">1920x1080</span>
            <span class="filter-item__desc">Full HD</span>
          </el-option>
          <el-option label="1920x1200" value="1920x1200">
            <span class="filter-item__option">1920x1200</span>
          </el-option>
          <el-option label="2560x1440" value="2560x1440">
            <span class="filter-item__option">2560x1440</span>
            <span class="filter-item__desc">QuadHD 2K</span>
          </el-option>
          <el-option value="3840x2160">
            <span class="filter-item__option">3840x2160</span>
            <span class="filter-item__desc">UltraHD 4K</span>
          </el-option>
          <el-option value="5120x2880">
            <span class="filter-item__option">5120x2880</span>
            <span class="filter-item__desc">5K Retina</span>
          </el-option>
          <el-option value="7680x4320">
            <span class="filter-item__option">7680x4320</span>
            <span class="filter-item__desc">UltraHD 8K</span>
          </el-option>
        </el-select>
        <el-radio-group v-model="filters.resolutionBy" @change="handleSearch('resolutionBy')">
          <el-radio-button label="">至少</el-radio-button>
          <el-radio-button label="equal">精确</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dynamicTags.length" label="标签">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleDeleteTag(tag)"
        >{{ tag }}</el-tag>
      </el-form-item>
    </el-form>
    <!--wallpaper list-->
    <div class="wallpaper-list">
      <el-row :gutter="15">
        <el-col v-for="item in imageList" :key="item.id" :md="12" :lg="8" :xl="6">
          <div class="wallpaper-list-item">
            <nuxt-link :to="'/wallpaper/content/' + item.id" :title="item.title">
              <img class="img-fluid" :src="item.imgurl" :alt="item.title">
            </nuxt-link>
            <div class="wallpaper-list__detail">
              <nuxt-link class="wallpaper-list__title" :to="'/wallpaper/content/' + item.id" :title="item.title">{{ item.title }}</nuxt-link>
              <div class="wallpaper-list-tag">
                <span
                  v-for="(tag,index) in tag"
                  :key="index"
                  class="tl-tag"
                  :class="tag | tagClassName"
                  @click="handleAddTag(tag)"
                >{{ tag }}</span>
              </div>
              <p class="wallpaper-list-info">
                <span><i class="tl-icon">&#xe70b;</i>{{ item.updatetime }}</span>
                <span><i class="tl-icon">&#xe601;</i>{{ item.hits }}</span>
                <span><i class="tl-icon">&#xe695;</i>{{ item.imgwidth }}x{{ item.imgheight }}</span>
              </p>
            </div>
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
    const { sortBy, orderBy, resolutions, resolutionBy, tags } = query
    const { seo, list } = await $axios.$get('/wallpaper/list', {
      params: {
        id: id === 'list' ? null : id,
        page,
        sortBy,
        orderBy,
        resolutions,
        resolutionBy
      }
    })
    return {
      seo,
      listPage: {
        page: +page || 1,
        pageSize: list.pageSize
      },
      total: list.count,
      imageList: list.data,
      search: {
        sortBy: sortBy || '',
        orderBy: orderBy || '',
        resolutions: resolutions || '',
        resolutionBy: resolutionBy || '',
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
  }
}
</script>

<style lang="scss" scoped>
.wallpaper-list{
  &-item{
    overflow: hidden;
    position: relative;
    margin-bottom: 15px;
    border: 4px solid #303133;
    background-color: #fff;
    box-shadow: 4px 4px 0 #66ccff;
    border-radius: 4px;
    &:hover .wallpaper-list__detail{
      margin-top: -66px;
    }
  }
  &__detail{
    position: absolute;
    top: 100%;
    width: 100%;
    margin-top: -34px;
    padding: 5px 10px;
    background-color: rgba(0,0,0,.5);
    line-height: 1.6em;
    transition: margin-top .3s;
    p{
      overflow: hidden;
      color: #fff;
      font-size: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      span{
        padding-right: 5px;
      }
    }
    .tl-icon{
      padding-right: 3px;
      font-size: 15px;
      vertical-align: baseline;
    }
  }
  &__title{
    overflow: hidden;
    display: inline-block;
    max-width: 100%;
    color: #fff;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover{
      color: $primary;
    }
  }
}
</style>
