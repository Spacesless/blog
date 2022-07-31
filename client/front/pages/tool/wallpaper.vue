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
      :with-header="false"
      :modal="false"
      size="50%"
      class="wallpaper-drawer"
    >
      <div class="wallpaper-header">
        <el-radio-group v-model="listAlbum" @change="onListAlbumChange">
          <el-radio-button v-for="item in albumList" :key="item.key" :label="item.key">
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </div>

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
              @click="changePicture(item, true, index)"
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
      <li class="wallpaper-menu-item wallpaper-menu-item--album">
        <span>{{ albumName }}</span>
        <ul class="wallpaper-menu-dropdown">
          <li v-for="item in albumList" :key="item.key" @click="changeAlbum(item.key)">
            {{ item.name }}
          </li>
        </ul>
      </li>
      <li class="wallpaper-menu-item" @click="handleRandom">
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

const bing = {
  key: 'bing',
  name: '必应'
}

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
      albumList: [bing],
      loading: false,
      drawerShow: false,
      listAlbum: 'bing',
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
    albumName () {
      const findAlbum = this.albumList.find(item => item.key === this.activeAlbum)
      return findAlbum?.name || this.activeAlbum
    },
    pictureSize () {
      const { imageWidth, imageHeight } = this.pictureData

      return imageWidth ? imageWidth + 'x' + imageHeight : ''
    }
  },
  created () {
    this.fetchBing()
    this.fetchAblumList()
  },
  methods: {
    onPictureLoaded () {
      this.loading = false

      this.pictureList.forEach((item, index) => {
        this.$set(this.pictureList[index], 'loading', false)
      })
    },
    /**
     * 切换图册
     * @param {Any} type
     */
    changeAlbum (type) {
      if (type !== this.activeAlbum) {
        this.activeAlbum = type
        this.handleRandom()
      }
    },
    /**
     * 更改预览图片
     * @param {Object} data 图片信息
     * @param {Boolean} isList 是否列表选择
     */
    changePicture (data, isList, index) {
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

      if (isList) {
        this.activeAlbum = this.listAlbum
      }

      this.loading = true
      this.$set(this.pictureList[index], 'loading', true)
    },
    handleDownload () {
      const { url, urlbase } = this.pictureData
      if (!url) {
        return
      }
      let filename = null
      if (url.includes('bing.com')) {
        filename = urlbase ? urlbase.split('=').pop() + '.jpg' : null
      } else {
        filename = url.split('/').pop()
      }
      saveAs(url, filename)
    },
    // 随机切换
    handleRandom () {
      if (this.activeAlbum === 'bing') {
        this.fetchBingRandom()
      } else {
        this.fetchWallpaperRandom()
      }
    },
    showDrawer () {
      this.drawerShow = true
      if (!this.pictureList.length) {
        this.fetchList()
      }
    },
    // 切换列表页图册
    onListAlbumChange () {
      const findAlbum = this.albumList.find(item => item.key === this.listAlbum)
      this.listQuery = {
        page: 1,
        pageSize: 20,
        album: findAlbum?.name || ''
      }
      this.fetchList()
    },
    async fetchList () {
      if (this.listAlbum === 'bing') {
        await this.fetchBingList()
      } else {
        await this.fetchWallpaperList()
      }

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
    fetchAblumList () {
      this.GetWallpaper('wallpaper/album').then((res) => {
        const data = (res.data || []).map((item) => {
          return {
            key: item.album_id,
            name: item.album_name
          }
        })
        this.albumList = [
          bing,
          ...data
        ]
      })
    },
    fetchWallpaperRandom () {
      this.GetWallpaper('wallpaper', {
        album: this.albumName,
        format: 'json'
      }, true).then((res) => {
        this.changePicture(res.data)
      })
    },
    async fetchWallpaperList () {
      this.listLoading = true
      await this.GetWallpaper('wallpaper/list', this.listQuery).then((res) => {
        const { count, data } = res.data
        this.total = count
        data.forEach((item) => {
          const urlSplit = item.url.split('.')
          urlSplit.splice(-1, 0, 'md')
          const thumb = urlSplit.join('.')
          item.thumb = thumb
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

      &--album {
        &:hover .wallpaper-menu-dropdown {
          opacity: 1;
        }
      }

      &--desc {
        cursor: default;
      }
    }

    &__link {
      visibility: hidden;
    }

    &-dropdown {
      position: absolute;
      right: 0;
      bottom: 100%;
      overflow: hidden;
      border-radius: 4px;
      opacity: 0;
      transition: all .3s;

      li {
        padding: 8px 16px;
        color: rgba($color: #FFFFFF, $alpha: .85);
        white-space: nowrap;
        background-color: rgba(0, 0, 0, .45);
        border-bottom: 1px solid rgba($color: #FFFFFF, $alpha: .45);

        &:hover {
          color: #FFFFFF;
          background-color: rgba(0, 0, 0, .65);
        }
      }
    }
  }

  &-header {
    padding: 16px;
  }

  &-list {
    padding: 0 16px;

    &-scrollbar {
      height: calc(100% - 64px - 56px);
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
