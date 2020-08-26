<template>
  <el-card class="panel-group" shadow="hover">
    <div slot="header" class="clearfix">
      <span>进行中的项目</span>
    </div>
    <div class="box-body">
      <el-row class="panel-group">
        <el-col :xs="12" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">栏目</div>
              <span class="card-panel-num">{{ count.column }}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">博客</div>
              <span class="card-panel-num">{{ count.blog }}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">图片</div>
              <span class="card-panel-num">{{ count.image }}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">番剧</div>
              <span class="card-panel-num">{{ count.bangumi }}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">webapp</div>
              <span class="card-panel-num">{{ count.webapp }}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">视频</div>
              <span class="card-panel-num">{{ count.video }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    count: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  ::v-deep .el-card__body{
    padding: 0;
  }
  .card-panel {
    overflow: hidden;
    position: relative;
    background: #fff;
    color: #606266;
    font-size: 12px;
    box-shadow: 0 1px 5px rgba(0, 21, 41, 0.08);
    cursor: pointer;
    &:hover{
      position: relative;
      z-index: 1;
      box-shadow: 0 2px 8px rgba(0,0,0,.15);
    }
    .card-panel-icon-wrapper {
      float: left;
      width: 50%;
      padding: 15px;
      transition: all 0.3s ease-out;
      border-radius: 5px;
      text-align: center;
    }
    .card-panel-description {
      float: left;
      width: 50%;
      text-align: center;
      padding: 40px 15px;
      .card-panel-text {
        line-height: 18px;
        color: #909399;
        font-size: 16px;
        margin-bottom: 15px;
      }
      .card-panel-num {
        font-size: 20px;
        color: #303133;
      }
    }
  }
}
</style>
