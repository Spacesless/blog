<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-tooltip class="right-menu-item hover-effect" effect="dark" content="刷新页面" placement="bottom">
        <span @click="handleRefresh"><i class="el-icon-refresh-right" /></span>
      </el-tooltip>
      <el-tooltip class="right-menu-item hover-effect" effect="dark" content="清除缓存" placement="bottom">
        <span @click="handleClearCache"><i class="el-icon-brush" /></span>
      </el-tooltip>
      <el-tooltip class="right-menu-item hover-effect" effect="dark" content="前台预览" placement="bottom">
        <a :href="configs.siteurl" target="_blank">
          <span class="el-icon-monitor" />
        </a>
      </el-tooltip>
      <el-dropdown class="avatar-container" trigger="click">
        <span class="avatar-container-link">
          {{ userinfo.nickname }}<span class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <router-link to="/">首页</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/system/options-profile">个人资料</router-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { RefreshCache } from '@/api/common'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userinfo',
      'configs'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 清除thinkjs缓存
    handleClearCache() {
      this.$confirm('此操作将清除后台缓存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        RefreshCache().then(res => {
          this.$message({
            type: 'success',
            message: '清除缓存成功'
          })
          this.$store.dispatch('list/getCategory')
          this.$store.dispatch('config/getConfigs')
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '清除缓存失败'
          })
        })
      })
    },
    // 刷新当前页
    handleRefresh() {
      const view = this.$route
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + view.fullPath
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  overflow: hidden;
  position: relative;
  z-index: 5;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 46px;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .06)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 8px;
      color: #5a5e66;
      font-size: 18px;
      vertical-align: middle;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .06)
        }
      }
    }

    .avatar-container {
      margin: 0 15px;
      line-height: 22px;
      vertical-align: middle;

      &-link{
        display: block;
        color: #5a5e66;
        cursor: pointer;
      }
    }
  }
}
</style>
