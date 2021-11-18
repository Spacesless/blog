<template>
  <div v-loading="fetchLoading" class="home">
    <div class="home-welcome">
      <h2 class="home-welcome__hello">{{ helloText }}</h2>
      <p class="home-welcome__text">我们一日日度过的所谓的日常，实际上可能是接连不断的奇迹</p>
    </div>

    <el-row class="home-general" :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="home-general-item category" @click="navigateTo('Category')">
          <div class="home-general-icon">
            <svg-icon icon-class="category" />
          </div>
          <div class="home-general-info">
            <p class="home-general__desc">Category</p>
            <p class="home-general__count">{{ count.category }}</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="home-general-item article" @click="navigateTo('Article')">
          <div class="home-general-icon">
            <svg-icon icon-class="content" />
          </div>
          <div class="home-general-info">
            <p class="home-general__desc">Article</p>
            <p class="home-general__count">{{ count.article }}</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="home-general-item bangumi" @click="navigateTo('Bangumi')">
          <div class="home-general-icon">
            <svg-icon icon-class="bangumi" />
          </div>
          <div class="home-general-info">
            <p class="home-general__desc">Bangumi</p>
            <p class="home-general__count">{{ count.bangumi }}</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="home-general-item comment" @click="navigateTo('Comment')">
          <div class="home-general-icon">
            <svg-icon icon-class="community" />
          </div>
          <div class="home-general-info">
            <p class="home-general__desc">Comment</p>
            <p class="home-general__count">{{ count.comment }}</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row class="home-info" :gutter="20">
      <el-col :xs="24" :sm="12">
        <comment-list />
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <todo-list />
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card>
          <div slot="header">运行环境</div>
          <ul class="home-info-env">
            <li>
              <img class="home-env__icon" src="@/assets/home/nodejs.png" alt="">
              <span class="home-env__desc">Node.js：{{ version.nodeVersion }}</span>
            </li>
            <li>
              <img class="home-env__icon" src="@/assets/home/nginx.png" alt="">
              <span class="home-env__desc">Web Server：{{ version.v8Version }}</span>
            </li>
            <li>
              <img class="home-env__icon" src="@/assets/home/centos.png" alt="">
              <span class="home-env__desc">System：{{ version.platform }}</span>
            </li>
            <li>
              <img class="home-env__icon" src="@/assets/home/thinkjs.png" alt="">
              <span class="home-env__desc">Think.js：{{ version.thinkjsVersion }}</span>
            </li>
            <li>
              <img class="home-env__icon" src="@/assets/home/mysql.png" alt="">
              <span class="home-env__desc">Mysql：{{ version.mysqlVersion }}</span>
            </li>
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
        return `${this.userinfo.nickname}你是夜猫子呀？这么晚还不睡觉，明天起的来嘛`
      } else if (now > 5 && now <= 7) {
        return `早上好！${this.userinfo.nickname}，一日之计在于晨，美好的一天就要开始了`
      } else if (now > 7 && now <= 11) {
        return `上午好！${this.userinfo.nickname}，工作顺利嘛，不要久坐，多起来走动走动哦！`
      } else if (now > 11 && now <= 14) {
        return '中午了，工作了一个上午，现在是午餐时间！'
      } else if (now > 14 && now <= 17) {
        return '午后很容易犯困呢，今天的运动目标完成了吗？'
      } else if (now > 17 && now <= 19) {
        return '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~'
      } else if (now > 19 && now <= 21) {
        return `晚上好，${this.userinfo.nickname}，今天过得怎么样？`
      } else if (now > 21 && now <= 23) {
        return '已经这么晚了呀，早点休息吧，晚安~'
      } else {
        return `Hello ${this.userinfo.nickname}，祝你开心每一天`
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
      await this.$api.home.GetGeneral().then(res => {
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
  &-welcome{
    margin-bottom: 20px;
    padding: 30px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    &__hello{
      font-weight: normal;
      margin-bottom: 15px;
    }
    &__text{
      font-size: 14px;
      color: #606266;
    }
  }

  &-general{
    padding: 0 20px;
    &-item{
      height: 110px;
      margin-bottom: 20px;
      border-radius: 6px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      cursor: pointer;
    }
    &-icon{
      float: left;
      width: 120px;
      color: #fff;
      line-height: 110px;
      text-align: center;
      .svg-icon{
        width: 50px;
        height: 50px;
      }
    }
    &-info{
      overflow: hidden;
    }
    &__desc{
      padding: 25px 0 6px;
      color: #efefef;
      font-size: 22px;
    }
    &__count{
      color: #fff;
      font-size: 30px;
    }
    .category{
      background-image: linear-gradient(to right, #ff4d4f , #ffa940);
    }
    .article{
      background-image: linear-gradient(to right, #ffc53d , #bae637);
    }
    .bangumi{
      background-image: linear-gradient(to right, #73d13d , #40a9ff);
    }
    .comment{
      background-image: linear-gradient(to right, #597ef7 , #f759ab);
    }
  }

  &-info{
    padding: 0 20px;
    .el-col{
      margin-bottom: 20px;
    }
    ::v-deep .todoapp{
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
       .main{
        min-height: 330px;
      }
    }
    &-env{
      min-height: 335px;
      li{
        margin-bottom: 15px;
      }
    }
  }
  &-env{
    &__icon{
      display: inline-block;
      width: 32px;
      margin-right: 10px;
      vertical-align: middle;
    }
    &__desc{
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
