<template>
  <div class="navbar">
    <LayoutHamburger :is-active="appStore.sidebar.opened" class="hamburger-container" @toggle-click="toggleSideBar" />

    <LayoutBreadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-tooltip effect="dark" content="刷新页面" placement="bottom">
        <span class="right-menu-item hover-effect" @click="handleRefresh"><i class="el-icon-refresh" /></span>
      </el-tooltip>
      <el-dropdown trigger="click" placement="bottom">
        <span class="right-menu-item hover-effect"><i class="el-icon-brush" /></span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleClearCache">清除缓存</el-dropdown-item>
            <el-dropdown-item @click="handleClearThumbnail">删除缩略图</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tooltip effect="dark" content="前台预览" placement="bottom">
        <a class="right-menu-item hover-effect" :href="siteUrl" target="_blank">
          <i class="el-icon-monitor" />
        </a>
      </el-tooltip>
      <el-dropdown class="avatar-container" trigger="click">
        <span class="avatar-container-link">
          {{ userStore.userinfo.nickname || userStore.userinfo.username || '管理员' }}
          <i class="el-icon-arrow-down" />
        </span>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <el-dropdown-item>
              <NuxtLink to="/">首页</NuxtLink>
            </el-dropdown-item>
            <el-dropdown-item>
              <NuxtLink to="/profile">个人资料</NuxtLink>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout">注销</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'

const appStore = useAppStore()
const userStore = useUserStore()
const listStore = useListStore()
const configStore = useConfigStore()
const route = useRoute()
const router = useRouter()
const api = useApi()

const siteUrl = computed(() => (configStore.configs?.siteurl as string) || '/')

function toggleSideBar() {
  appStore.toggleSideBar()
}

async function logout() {
  await userStore.logout()
  await router.push(`/login?redirect=${route.fullPath}`)
}

function handleClearCache() {
  ElMessageBox.confirm('此操作将清除后台缓存, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await api.RefreshCache()
        ElMessage.success('清除缓存成功')
        await listStore.getCategory()
        await configStore.getConfigs()
      } catch {
        ElMessage.error('清除缓存失败')
      }
    })
    .catch(() => {})
}

function handleClearThumbnail() {
  ElMessageBox.confirm('此操作将清除缩略图, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await api.ClearThumbnail()
        ElMessage.success('清除缩略图成功')
      } catch {
        ElMessage.error('清除缩略图失败')
      }
    })
    .catch(() => {})
}

async function handleRefresh() {
  await router.replace({ path: route.fullPath, query: { _r: Date.now().toString() } })
}
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  z-index: 5;
  height: 50px;
  overflow: hidden;
  background-color: #FFFFFF;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 46px;
    cursor: pointer;
    transition: background .3s;

    &:hover {
      background: rgba(0, 0, 0, .06);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 10px;
      font-size: 18px;
      color: #5A5E66;
      vertical-align: middle;
      cursor: pointer;

      &.hover-effect:hover {
        background: rgba(0, 0, 0, .06);
      }
    }

    .avatar-container {
      margin: 0 15px 0 8px;
      line-height: 22px;
      vertical-align: middle;

      &-link {
        display: block;
        color: #5A5E66;
        cursor: pointer;
      }
    }
  }
}
</style>
