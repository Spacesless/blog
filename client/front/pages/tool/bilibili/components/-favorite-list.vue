<template>
  <div v-loading="listLoading" class="favorite">
    <el-scrollbar class="favorite-list-scrollbar" wrap-class="favorite-scrollbar-wrapper">
      <el-row class="favorite-list">
        <el-col v-for="item in mediaList" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6" class="favorite-list-item">
          <div class="favorite-list-media">
            <a :href="item.bvid | formatVideoUrl" :title="item.title" target="_blank" rel="noopener noreferrer">
              <img class="favorite-list__cover" :src="item.cover + '@380w_240h_100Q_1c.webp'" alt="" referrerpolicy="no-referrer">
              <div class="favorite-list-media-info">
                <p class="favorite-list-media__param">播放：{{ item.cnt_info.play }}</p>
                <p class="favorite-list-media__param">收藏：{{ item.cnt_info.collect }}</p>
                <p class="favorite-list-media__param">UP主：{{ item.upper.name }}</p>
                <p class="favorite-list-media__param">投稿：{{ item.pubtime | parseTime('{y}-{m}-{d}') }}</p>
              </div>
            </a>
          </div>
          <a class="favorite-list__title" :href="item.bvid | formatVideoUrl" :title="item.title" target="_blank" rel="noopener noreferrer">
            <p>{{ item.title }}</p>
          </a>
          <p class="favorite-list__favtime">收藏于：{{ item.fav_time | parseTime('{y}-{m}-{d}') }}</p>
        </el-col>
      </el-row>
    </el-scrollbar>
    <pagination class="pagination" :is-admin="false" :total="total" :page.sync="listQuery.page" :limit="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import Pagination from '#/components/Pagination'

const apiurl = 'https://api.timelessq.com/bilibili'

export default {
  components: {
    Pagination
  },
  filters: {
    formatVideoUrl(bvid) {
      return bvid ? 'https://www.bilibili.com/video/' + bvid : ''
    }
  },
  props: {
    favoriteId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      mediaList: [],
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20
      },
      total: 0
    }
  },
  watch: {
    favoriteId: {
      handler(val) {
        if (!val) return
        this.listQuery.page = 1
        this.fetchList()
      },
      immediate: true
    }
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      this.listQuery.id = this.favoriteId
      await this.$axios.get(apiurl + '/resource', {
        params: this.listQuery
      }).then(res => {
        const { info, medias } = res.data
        this.total = info.media_count || 0
        this.mediaList = medias
      }).catch(() => {})
      this.listLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.favorite{
  height: 100%;
  &-list{
    padding: 20px 10px 0;
    &-scrollbar{
      height: calc(100% - 72px);
    }
    &-item{
      margin-bottom: 20px;
      padding: 0 10px;
    }
    &__cover{
      display: block;
      max-width: 100%;
    }
    &-media{
      overflow: hidden;
      position: relative;
      border-radius: 4px;
      margin-bottom: 5px;
      &-info{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 15px;
        box-sizing: border-box;
        background-color: rgba($color: #000000, $alpha: .4);
        opacity: 0;
        transition: opacity .3s;
      }
      &__param{
        font-size: 14px;
        line-height: 1.7;
        color: #fff;
      }
      &:hover &-info{
        opacity: 1;
      }
    }
    &__title{
      display: block;
      font-size: 14px;
      height: 44px;
      line-height: 22px;
      overflow: hidden;
      color: #303133;
      &:hover{
        color: var(--color-primary);
      }
    }
    &__favtime{
      font-size: 12px;
      color: #606266;
    }
  }
  ::v-deep &-scrollbar-wrapper{
    overflow-x: hidden;
  }
}
</style>
