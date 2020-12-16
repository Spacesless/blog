<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-tooltip class="right-menu-item" effect="dark" content="清除缓存" placement="bottom">
        <i class="el-icon-refresh" @click="handleClearCache" />
      </el-tooltip>
      <el-tooltip class="right-menu-item" effect="dark" content="前台预览" placement="bottom">
        <a :href="configs.siteurl" target="_blank">
          <i class="el-icon-monitor" />
        </a>
      </el-tooltip>
      <el-dropdown class="avatar-container" trigger="click">
        <span class="avatar-container-link">
          {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <router-link to="/">首页</router-link>
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
    handleClearCache() {
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
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    padding-top: 4px;
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
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin: 0 15px;
      vertical-align: text-bottom;

      &-link{
        display: block;
        color: #5a5e66;
        cursor: pointer;
      }
    }
  }
}
</style>
