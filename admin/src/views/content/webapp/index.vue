<template>
  <div v-loading="listLoading" class="app-container webapp">
    <el-row :gutter="40" class="webapp-group">
      <el-col
        v-for="item in appList"
        :key="item.id"
        :xs="12"
        :sm="12"
        :lg="6"
        class="webapp-group-col"
      >
        <div class="webapp-group-item" @click="handleEdit(item.id)">
          <div class="webapp-group-img">
            <img :src="item.columnimg">
          </div>
          <div class="webapp-group-description">
            <p class="webapp-group__name">{{ item.name }}</p>
            <p class="webapp-gropu__info">{{ item.info }}</p>
            <p class="webapp-group__version">{{ item.version }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetList } from '@/api/list'

export default {
  data() {
    return {
      currentModule: 'webapp',
      appList: [],
      listLoading: false
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetList(this.currentModule).then(response => {
        const { data } = response
        this.appList = data
      }).catch(() => {})
      this.listLoading = false
    },
    handleEdit(id) {
      this.$router.push({
        name: 'AppContent',
        params: { id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.webapp{
  &-group{
    &-col{
      margin-bottom: 30px;
    }
    &-item{
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #606266;
      background: #fff;
      box-shadow: 0 1px 5px rgba(0, 21, 41, 0.08);
      border-color: 1px solid #EBEEF5;
      border-radius: 5px;
    }
    &-img {
      float: left;
      width: 50%;
      padding: 20px;
      transition: all 0.3s ease-out;
      border-radius: 5px;
      text-align: center;
      img{
        width: 80%;
      }
    }
    &-description {
      float: left;
      width: 50%;
      text-align: center;
      padding: 20px;
    }
    &__name {
      color: #303133;
      font-size: 16px;
      padding: 15px 0 10px;
    }
    &__info{
      color: #606266;
      font-size: 14px;
      padding-bottom: 10px;
    }
    &__version {
      font-size: 14px;
      color: #909399;
    }
  }
}
</style>
