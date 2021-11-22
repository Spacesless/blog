<template>
  <div class="bilibili">
    <div class="container clearfix">
      <div class="bilibili-menu">
        <div class="bilibili-info">
          <img class="bilibili-info__cover" :src="userInfo.face + '@128w_128h_1o.webp'" alt="" referrerpolicy="no-referrer">
          <div class="bilibili-info-text">
            <span v-if="userInfo.level" class="bilibili-info__level">Lv{{ userInfo.level }}</span>
            <span v-if="vipText" class="bilibili-info__vip">{{ vipText }}</span>
            <p class="bilibili-info__name">{{ userInfo.name }}</p>
            <p class="bilibili-info__sign">{{ userInfo.sign }}</p>
          </div>
        </div>
        <el-scrollbar class="bilibili-menu-scrollbar" wrap-class="bilibili-scrollbar-wrapper">
          <el-menu
            :default-active="favoriteId"
          >
            <el-submenu index="1">
              <template slot="title">
                <span class="el-icon-folder-opened" />
                <span>我的收藏</span>
              </template>
              <el-menu-item
                v-for="item in favoriteList"
                :key="item.id"
                :index="item.id.toString()"
                @click="changeFavorite(item.id)"
              >
                <span class="bilibili-menu__title">{{ item.title }}</span>
                <span class="bilibili-menu__desc">({{ item.media_count }})</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="2" @click="handleViewFollow">
              <span class="el-icon-star-off" />
              <span slot="title">我的关注</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="bilibili-main">
        <favorite-list v-if="listType === 'favorite'" :favorite-id="favoriteId" />
        <follow-list v-else />
      </div>
    </div>
  </div>
</template>

<script>
import FavoriteList from './components/-favorite-list'
import FollowList from './components/-follow-list'

const mid = 315883644
const apiurl = 'https://api.timelessq.com/bilibili'

export default {
  layout: 'app',
  components: {
    FavoriteList,
    FollowList
  },
  async asyncData({ app, route, $axios }) {
    const filename = route.path.split('/')
    const { seo } = await $axios.$get('/tool/content', {
      params: {
        path: filename[filename.length - 1] || 'bilibili'
      }
    })
    return {
      seo
    }
  },
  data() {
    return {
      userInfo: {},
      favoriteList: [],
      favoriteId: '0',
      mediaList: [],
      followList: [],
      listType: 'favorite'
    }
  },
  computed: {
    vipText() {
      return this.userInfo.vip?.label?.text
    }
  },
  mounted() {
    this.fetchInfo()
    this.fetchFavoriteList()
  },
  methods: {
    // 获取用户信息
    fetchInfo() {
      this.$axios.get(apiurl + '/info', {
        params: {
          mid
        }
      }).then(res => {
        this.userInfo = res.data
      })
    },
    // 获取收藏列表
    fetchFavoriteList() {
      this.$axios.get(apiurl + '/favorite', {
        params: {
          mid
        }
      }).then(res => {
        const { list } = res.data
        this.favoriteList = list
        this.favoriteId = this.favoriteList[0] ? this.favoriteList[0].id + '' : '0'
      })
    },
    changeFavorite(id) {
      this.listType = 'favorite'
      this.favoriteId = id.toString()
    },
    handleViewFollow() {
      this.listType = 'follow'
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
.bilibili{
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #f4f5f7;
  .container{
    overflow: hidden;
    height: 100%;
    padding: 0;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 2px 0 10px rgba(0,0,0,.1);
  }
  &-info{
    padding: 20px 0;
    text-align: center;
    &__cover{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      vertical-align: middle;
      margin-bottom: 10px;
    }
    &__level{
      display: inline-block;
      padding: 2px 6px;
      margin-right: 5px;
      background-color: var(--color-primary);
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
    }
    &__vip{
      display: inline-block;
      padding: 2px 6px;
      margin-right: 5px;
      background-color: #f45a8d;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
    }
    &__name{
      font-size: 18px;
      color: #303133;
      line-height: 30px;
    }
    &__sign{
      font-size: 12px;
      color: #909399;
    }
  }
  &-menu{
    float: left;
    width: 210px;
    height: 100%;
    border-right: solid 1px #e6e6e6;
    &-scrollbar{
      height: calc(100% - 200px);
    }
    &__desc{
      font-size: 12px;
      margin-left: 3px;
    }
    .el-menu{
      border-right: none;
    }
  }
  &-main{
    overflow: hidden;
    height: 100%;
  }
  ::v-deep &-scrollbar-wrapper{
    overflow-x: hidden;
  }
}
</style>
