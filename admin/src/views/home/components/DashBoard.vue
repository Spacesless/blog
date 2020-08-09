<template>
  <div class="dash-board">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>面板</span>
      </div>
      <div class="box-body">
        <img src="@/assets/home/centos.png" alt="">
        <span>系统型号：{{ version.platform }}</span>
        <el-divider />
        <img src="@/assets/home/nginx.png" alt="">
        <span>运行环境：{{ version.v8Version }}</span>
        <el-divider />
        <img src="@/assets/home/nodejs.png" alt="">
        <span>Nodejs版本：{{ version.nodeVersion }}</span>
        <el-divider />
        <img src="@/assets/home/thinkjs.png" alt="">
        <span>Thinkjs版本：{{ version.thinkjsVersion }}</span>
        <el-divider />
        <img src="@/assets/home/mysql.png" alt="">
        <span>Mysql版本：{{ version.mysqlVersion }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  props: {
    version: {
      type: Object,
      default: () => {}
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dash-board{
  ::v-deep .el-card__body{
    padding: 14px 20px;
  }
  img{
    vertical-align: middle;
    width: 32px;
  }
  span{
    font-size: 14px;
    margin-left: 5px;
    color: #909399;
  }
  .el-divider--horizontal{
    margin: 10px 0;
  }
}
</style>
