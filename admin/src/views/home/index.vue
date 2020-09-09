<template>
  <div v-loading="fetchLoading" class="app-container home">
    <div class="home-welcome">
      123
    </div>
    <div class="home-general">
      <div class="home-card">
        <h2 class="home-card__title">Environment</h2>
        <div class="home-body">
          <!-- <ul>
            <li>Nodejs：{{ version.nodeVersion }}</li>
            <li>V8：{{ version.v8Version }}</li>
            <li>Web Server：{{ version.platform }}</li>
            <li>Thinkjs：{{ version.thinkjsVersion }}</li>
            <li>Mysql：{{ version.mysqlVersion }}</li>
          </ul> -->
        </div>
      </div>
      <div class="home-card" @click="navigateTo('Cloumn')">
        <h2 class="home-card__title">CLOUMN</h2>
        <div class="home-body">
          <strong>{{ count.cloumn }}</strong>
          <p />
        </div>
      </div>
      <div class="home-card" @click="navigateTo('Blog')">
        <h2 class="home-card__title">ARTICLE</h2>
        <div class="home-body">
          <strong>{{ count.article }}</strong>
          <p />
        </div>
      </div>
      <div class="home-card" @click="navigateTo('Bangumi')">
        <h2 class="home-card__title">BANGUMI</h2>
        <div class="home-body">
          <strong>{{ count.bangumi }}</strong>
          <p />
        </div>
      </div>
      <div class="home-card" @click="navigateTo('Comment')">
        <h2 class="home-card__title">COMMENT</h2>
        <div class="home-body">
          <strong>{{ count.comment }}</strong>
          <p />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetGeneral } from '@/api/home'

export default {
  name: 'Home',
  data() {
    return {
      generals: {},
      fetchLoading: false
    }
  },
  computed: {
    ...mapGetters(['userinfo']),
    version() {
      return this.generals.version || {}
    },
    count() {
      return this.generals.count || {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 获取运行环境、统计数据
     */
    async fetchData() {
      this.fetchLoading = true
      await GetGeneral().then(res => {
        this.generals = res.data
      }).catch(() => {})
      this.fetchLoading = false
    },
    /**
     * 跳转到对应名称的路由
     * @param {String} 路由名称
     */
    navigateTo(name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
