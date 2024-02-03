<template>
  <div v-loading="loading" class="wallpaper" element-loading-background="rgba(0, 0, 0, 0.65)">
    <img
      class="wallpaper__picture"
      :src="pictureData.url"
      :alt="pictureData.title"
      @load="onPictureLoaded"
      @error="onPictureLoaded"
    >

    <el-drawer
      :visible.sync="drawerShow"
      title="壁纸列表"
      :modal="false"
      size="50%"
      class="wallpaper-drawer"
    >
      <el-scrollbar ref="scrollbar" v-loading="listLoading" class="wallpaper-list-scrollbar">
        <el-row class="wallpaper-list">
          <el-col
            v-for="(item, index) in pictureList"
            :key="index"
            v-loading="item.loading"
            element-loading-background="rgba(0, 0, 0, 0.65)"
            :sm="24"
            :md="12"
            class="wallpaper-list-item"
          >
            <el-image
              class="wallpaper-list__thumb"
              :class="{'wallpaper-list__thumb--active': item.url === pictureData.url}"
              :src="item.thumb"
              fit="cover"
              lazy
              @click="changePicture(item, index)"
            />
            <p v-if="item.title || item.descriptionz" class="wallpaper-list__desc">
              <span>{{ item.title || item.descriptionz }}</span>
              <span>{{ item.time }}</span>
            </p>
          </el-col>
        </el-row>
      </el-scrollbar>

      <pagination
        class="pagination"
        :is-admin="true"
        :total="total"
        :pager-count="5"
        :page.sync="listQuery.page"
        :limit="listQuery.pageSize"
        @pagination="fetchList"
      />
    </el-drawer>

    <ul class="wallpaper-menu">
      <li v-if="pictureData.title" class="wallpaper-menu-item wallpaper-menu-item--desc">
        {{ pictureData.title }}
      </li>
      <li class="wallpaper-menu-item" @click="handleDownload">
        <i class="el-icon-download" />
        <span>{{ pictureSize }}</span>
      </li>
      <li class="wallpaper-menu-item" @click="fetchBingRandom">
        <i class="el-icon-refresh" />
      </li>
      <li class="wallpaper-menu-item" @click="showDrawer">
        <i class="el-icon-arrow-left" />
      </li>
    </ul>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import Pagination from '#/components/Pagination'
import { pageMeta } from '@/mixins'

export default {
  name: 'DaliyWallpaper',
  components: {
    Pagination
  },
  mixins: [pageMeta],
  layout: 'app',
  data () {
    return {
      pictureData: {},
      activeAlbum: 'bing',
      loading: false,
      drawerShow: false,
      pictureList: [],
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20
      },
      total: 0
    }
  },
  computed: {
    pictureSize () {
      const { imageWidth, imageHeight } = this.pictureData

      return imageWidth ? imageWidth + 'x' + imageHeight : ''
    }
  },
  created () {
    this.fetchBing()
  },
  methods: {
    onPictureLoaded () {
      this.loading = false

      this.pictureList.forEach((item, index) => {
        this.$set(this.pictureList[index], 'loading', false)
      })
    },
    /**
     * 更改预览图片
     * @param {Object} data 图片信息
     */
    changePicture (data, index) {
      const { url, urlbase, copyright, imageWidth, imageHeight, descriptionz } = data || {}

      let match = []
      if (!imageWidth) {
        match = url.match(/_(\d+)x(\d+)./) || []
      }

      this.pictureData = {
        url,
        urlbase,
        imageWidth: imageWidth || match[1] || '',
        imageHeight: imageHeight || match[2] || '',
        title: copyright || descriptionz
      }

      this.loading = true
      if (this.pictureList[index]) {
        this.$set(this.pictureList[index], 'loading', true)
      }
    },
    handleDownload () {
      const { url, urlbase } = this.pictureData
      if (!url) {
        return
      }
      const filename = urlbase ? urlbase.split('=').pop() + '.jpg' : null
      saveAs(url, filename)
    },
    showDrawer () {
      this.drawerShow = true
      if (!this.pictureList.length) {
        this.fetchList()
      }
    },
    async fetchList () {
      await this.fetchBingList()

      await this.$nextTick()
      if (this.$refs?.scrollbar.$refs.wrap) {
        this.$refs.scrollbar.$refs.wrap.scrollTop = 0
      }
    },
    // 获取必应每日图片
    fetchBing () {
      this.GetWallpaper('bing', {
        format: 'json'
      }, true).then((res) => {
        this.changePicture(res.data)
      })
    },
    fetchBingRandom () {
      this.GetWallpaper('bing/random', {
        format: 'json'
      }, true).then((res) => {
        this.changePicture(res.data)
      })
    },
    async fetchBingList () {
      this.listLoading = true
      await this.GetWallpaper('bing/list', this.listQuery).then((res) => {
        const { count, data } = res.data
        this.total = count
        data.forEach((item) => {
          item.thumb = `https://cn.bing.com${item.urlbase}_400x240.jpg`
        })
        this.pictureList = data
      }).catch(() => {})
      this.listLoading = false
    },
    GetWallpaper (url, params, isShowLoading) {
      this.loading = isShowLoading
      return this.$axios({
        url: 'https://api.timelessq.com/' + url,
        method: 'get',
        params
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wallpaper {
  position: fixed;
  width: 100%;
  height: 100%;

  &__picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &-menu {
    position: fixed;
    right: 10px;
    bottom: 10px;

    &-item {
      position: relative;
      float: left;
      padding: 8px 16px;
      margin-left: 8px;
      font-size: 14px;
      color: rgba($color: #FFFFFF, $alpha: .85);
      cursor: pointer;
      background-color: rgba(0, 0, 0, .45);
      border-radius: 4px;

      &:hover {
        color: #FFFFFF;
        background-color: rgba(0, 0, 0, .65);
      }

      &--desc {
        cursor: default;
      }
    }

    &__link {
      visibility: hidden;
    }
  }

  &-list {
    padding: 0 16px;

    &-scrollbar {
      height: calc(100% - 56px);
      margin-bottom: 8px;
    }

    &-item {
      position: relative;
    }

    &__thumb {
      box-sizing: border-box;
      display: block;
      width: 100%;
      height: calc((100vh - 64px - 64px) / 3);
      cursor: pointer;
      border: 1px solid transparent;

      &--active {
        border-color: $--color-primary;
      }
    }

    &__desc {
      position: absolute;
      right: 1px;
      bottom: 0;
      left: 1px;
      padding: 0 16px;
      overflow: hidden;
      font-size: 14px;
      line-height: 30px;
      color: rgba($color: #FFFFFF, $alpha: .85);
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: rgba(0, 0, 0, .45);

      span {
        margin-right: 8px;
      }
    }
  }
}
</style>

<style lang="scss">
.wallpaper-drawer {
  .pagination {
    padding: 0 16px;
  }
}
</style>
