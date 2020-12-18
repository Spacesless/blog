<template>
  <div v-loading="fetchLoading" class="app-container home">
    <div class="home-welcome">
      <h2 class="home-welcome-hello">{{ helloText }}</h2>
      <p class="home-welcome-text">我们一日日度过的所谓的日常，实际上可能是接连不断的奇迹</p>
    </div>

    <el-row class="home-general" :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="home-general-item">
          <div class="home-general-icon">
            svg
          </div>
          <div class="home-general-info">
            <p class="home-gernal-desc">Category</p>
            <p class="home-gernal-count">{{ count.category }}</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="home-general-item">
          <div class="home-general-icon">
            svg
          </div>
          <div class="home-general-info">
            <p class="home-gernal-desc">Article</p>
            <p class="home-gernal-count">{{ count.article }}</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="home-general-item">
          <div class="home-general-icon">
            svg
          </div>
          <div class="home-general-info">
            <p class="home-gernal-desc">Bangumi</p>
            <p class="home-gernal-count">{{ count.bangumi }}</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="home-general-item">
          <div class="home-general-icon">
            svg
          </div>
          <div class="home-general-info">
            <p class="home-gernal-desc">Comment</p>
            <p class="home-gernal-count">{{ count.comment }}</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="24" :lg="12">
        <comment-list />
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <todo-list />
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card>
          <div slot="header">运行环境</div>
          <ul>
            <li>{{ version.nodeVersion }}</li>
            <li>{{ version.v8Version }}</li>
            <li>{{ version.platform }}</li>
            <li>{{ version.thinkjsVersion }}</li>
            <li>{{ version.mysqlVersion }}</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentList from './components/CommentList'
import TodoList from './components/TodoList'
import { GetGeneral } from '@/api/home'

export default {
  name: 'Home',
  components: {
    CommentList,
    TodoList
  },
  data() {
    return {
      generals: {},
      fetchLoading: false
    }
  },
  computed: {
    ...mapGetters(['userinfo']),
    helloText() {
      const now = new Date().getHours()
      if (now > 23 || now <= 5) {
        return `${this.userinfo.name}你是夜猫子呀？这么晚还不睡觉，明天起的来嘛`
      } else if (now > 5 && now <= 7) {
        return `早上好！${this.userinfo.name}，一日之计在于晨，美好的一天就要开始了`
      } else if (now > 7 && now <= 11) {
        return `上午好！${this.userinfo.name}，工作顺利嘛，不要久坐，多起来走动走动哦！`
      } else if (now > 11 && now <= 14) {
        return '中午了，工作了一个上午，现在是午餐时间！'
      } else if (now > 14 && now <= 17) {
        return '午后很容易犯困呢，今天的运动目标完成了吗？'
      } else if (now > 17 && now <= 19) {
        return '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~'
      } else if (now > 19 && now <= 21) {
        return `晚上好，${this.userinfo.name}，今天过得怎么样？`
      } else if (now > 21 && now <= 23) {
        return '已经这么晚了呀，早点休息吧，晚安~'
      } else {
        return `Hello ${this.userinfo.name}，祝你开心每一天`
      }
    },
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
.home{

}
</style>
