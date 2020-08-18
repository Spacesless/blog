<template>
  <div class="app-container customize">
    <el-form
      ref="form"
      :model="formData"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item label="沉寂模式">
        <el-switch v-model="formData.is_silent " />
      </el-form-item>
      <el-form-item label="Live2d模型">
        <el-input v-model="formData.a" />
      </el-form-item>
      <el-form-item label="Live2d材质">
        <el-input v-model="formData.b" />
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    ...mapGetters('configs')
  },
  methods: {
    async handleSubmit() {
      this.confirmLoading = true
      await this.$store.dispatch('config/updateConfigs', this.form).then(() => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '更新失败'
        })
      })
      this.confirmLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.customize{
  .el-input{
    width: 230px;
  }
}
</style>
