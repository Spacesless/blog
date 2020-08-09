<template>
  <div class="home-container">
    <div class="home-header">
      <el-row>
        <el-col :xs="24" :md="12">
          <div class="home-avatar">
            <img src="https://www.timelessq.com/static/avatar.jpg" alt="">
          </div>
          <div class="home-hello">
            <h3>嗨多磨，<span class="username">{{ userinfo.nickname }}</span>，祝你开心每一天！</h3>
            <p>做你说过的，说你能做的</p>
          </div>
        </el-col>
        <el-col :xs="24" :md="12">
          <div class="home-community">
            <div class="divider-item">
              <span>用户</span>
              <p>{{ count.member }}</p>
            </div>
            <el-divider direction="vertical" />
            <div class="divider-item">
              <span>留言</span>
              <p>{{ count.message }}</p>
            </div>
            <el-divider direction="vertical" />
            <div class="divider-item">
              <span>评论</span>
              <p>{{ count.comment }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="home-board">
      <el-row :gutter="20">
        <el-col :xs="24" :md="16">
          <panel-group :count="count" />
        </el-col>
        <el-col :xs="24" :md="8">
          <dash-board :version="version" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPanelInfo } from '@/api/home'
import PanelGroup from './components/PanelGroup'
import DashBoard from './components/DashBoard'

export default {
  name: 'Home',
  components: {
    PanelGroup,
    DashBoard
  },
  data() {
    return {
      count: {},
      version: {}
    }
  },
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getPanelInfo().then(response => {
        const { count, version } = response.data
        this.count = count
        this.version = version
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-header{
  padding: 15px 20px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .home-avatar{
    width: 100px;
    height: 100px;
    float: left;
    overflow: hidden;
    border-radius: 50px;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .home-hello{
    float: left;
    padding: 23px 30px;
    h3{
      font-size: 18px;
      line-height: 2em;
      color: #606266;
      font-weight: normal;
    }
    .username{
      color: #303133;
    }
    p{
      font-size: 15px;
      color: #909399;
    }
  }
  .home-community{
    padding: 20px 0;
    text-align: right;
    .divider-item{
      display: inline-block;
      padding: 0 15px;
      vertical-align: middle;
      span{
        margin-bottom: 4px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 22px;
      }
      p{
        color: rgba(0, 0, 0, 0.85);
        font-size: 30px;
        line-height: 38px;
        text-align: center;
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI;
      }
    }
  }
}
.home-board{
  padding: 20px;
}
</style>
