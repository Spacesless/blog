<template>
  <div class="webapp">
    <el-row :gutter="15">
      <el-col :sm="12" :md="8" :xl="6" v-for="item in webappList" :key="item.id">
        <a class="webapp-card" :href="item.filename" :title="item.name" target="_blank">
          <div class="webapp-card__header">{{ item.name }}</div>
          <div class="webapp-card__body">
            <div class="clearfix">
              <img class="webapp-card__logo img-fluid" :src="item.columnimg"/>
              <p class="webapp-card__desc">{{ item.info }}</p>
            </div>
            <p class="webapp-card__version">版本号：{{ item.version }}</p>
          </div>
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  async asyncData({ params, query, $axios }) {
    const { seo, list } = await $axios.$get('/webapp/list')
    return { seo, webappList: list }
  },
  head() {
    return {
      title: this.seo.title,
      meta: [
        { hid: 'description', name: 'description', content: this.seo.description },
        { hid: 'keyword', name: 'keyword', content: this.seo.keyword }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.webapp{
  padding: 15px 0;
  &-card{
    display: block;
    position: relative;
    font-size: 14px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    transition: all 0.6s ease-in;
    &:before,&:after {
      content: '';
      display: block;
      position: absolute;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid transparent;
      width: 0;
      height: 0;
    }
    &:before {
      bottom: 0;
      right: 0;
      transition: border-color 0s ease-in 0.4s,width 0.2s ease-in 0.2s,height 0.2s ease-in;
    }
    &:after {
      top: 0;
      left: 0;
      transition: border-color 0s ease-in 0.8s,width 0.2s ease-in 0.6s,height 0.2s ease-in 0.4s;
    }
    &:hover {
      border-color: $primary;
    }
    &:hover:before,&:hover:after {
      width: 100%;
      height: 100%;
    }
    &:hover:before {
      border-bottom-color: $primary;
      border-left-color: $primary;
      transition: border-color 0s ease-out 0.4s,width 0.2s ease-out 0.4s,height 0.2s ease-out 0.6s;
    }
    &:hover:after {
      border-top-color: $primary;
      border-right-color: $primary;
      transition:width 0.2s ease-out,height 0.2s ease-out 0.2s;
    }
    &__header{
      height: 42px;
      line-height: 42px;
      padding: 0 15px;
      border-bottom: 1px solid #f6f6f6;
      color: #303133;
    }
    &__body{
      padding: 10px 15px;
      line-height: 24px;
    }
    &__logo{
      width: 64px;
      float: left;
    }
    &__desc {
      height: 3em;
      overflow: hidden;
      padding-left: 10px;
      color: #606266;
    }
    &__version{
      color: #909399;
      text-align: right;
    }
  }
}
</style>
