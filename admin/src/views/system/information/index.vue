<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="网站信息" name="info">
        <info :config="config" />
      </el-tab-pane>
      <el-tab-pane label="邮箱设置" name="email">
        <email :config="config" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Info from './components/Info'
import Email from './components/Email'

export default {
  components: {
    Info,
    Email
  },
  data() {
    return {
      activeName: 'info'
    }
  },
  computed: {
    ...mapGetters([
      'config'
    ])
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  ::v-deep .el-tabs__header{
    margin-bottom: 0;
  }
  ::v-deep .el-tabs__content{
    margin-top: -1px;
  }
}
</style>

