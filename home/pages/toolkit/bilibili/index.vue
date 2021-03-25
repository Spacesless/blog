<template>
  <div class="bilibili">
    <div class="container">
      <div class="bilibili-info" :style="{'background-image': 'url(' + userInfo.top_photo + '@2200w_400h_1o.webp)'}">
        <div class="bilibili-info-wrap">
          <img class="bilibili-info__cover" :src="userInfo.face + '@128w_128h_1o.webp'" alt="">
          <div class="bilibili-info-text">
            <p class="bilibili-info__name">{{ userInfo.name }}</p>
            <p class="bilibili-info__sign">{{ userInfo.sign }}</p>
          </div>
        </div>
      </div>
      <div class="clearfix">
        <div class="bilibili-menu">
          <el-menu
            :default-active="favoriteId"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-folder-opened" />
                <span>我的收藏</span>
              </template>
              <el-menu-item
                v-for="item in favoriteList"
                :key="item.id"
                :index="item.id.toString()"
                @click="changeFavorite(item.id)"
              >{{ item.title }}</el-menu-item>
            </el-submenu>
            <el-menu-item index="2" @click="handleViewFollow">
              <i class="el-icon-star-off" />
              <span slot="title">我的关注</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="bilibili-main">
          <favorite-list v-if="listType === 'favorite'" :favorite-id="favoriteId" />
          <follow-list v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    const { seo } = await $axios.$get('/toolkit/content', {
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
    ...mapGetters(['isSupportWebp'])
  },
  mounted() {
    this.fetchInfo()
    this.fetchFavoriteList()
  },
  methods: {
    fetchInfo() {
      this.$axios.get(apiurl + '/info', {
        params: {
          mid
        }
      }).then(res => {
        this.userInfo = res.data
      })
    },
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
  background-color: #f4f5f7;
  &-info{
    position: relative;
    height: 185px;
    margin-bottom: 15px;
    background-size: cover;
    border-radius: 4px;
    box-shadow: 2px 0 10px rgba(0,0,0,.1);
    padding-bottom: 15px;
    &-wrap{
      position: absolute;
      left: 20px;
      bottom: 20px;
    }
    &__cover{
      display: inline-block;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 10px;
    }
    &-text{
      display: inline-block;
      vertical-align: middle;
    }
    &__name{
      font-size: 18px;
      color: #fff;
      text-shadow: 0 1px 5px rgba(0,0,0,.6);
    }
    &__sign{
      font-size: 12px;
      color: #e7e7e7;
    }
  }
  &-menu{
    float: left;
    width: 200px;
    margin-right: 15px;
  }
  &-main{
    overflow: hidden;
  }
}
</style>
