<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="formData"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item class="form-title">
        第三方代码
      </el-form-item>
      <el-form-item label="头部设置">
        <el-row>
          <el-col :xs="24">
            <el-input v-model="formData.topcode" type="textarea" :rows="6" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="底部设置">
        <el-row>
          <el-col :xs="24">
            <el-input v-model="formData.bottomcode" type="textarea" :rows="6" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="form-title">
        参数设置
      </el-form-item>
      <el-form-item label="标题格式">
        <el-radio-group v-model="formData.seo_title_type">
          <div class="radio-item">
            <el-radio label="1">内容标题</el-radio>
          </div>
          <div class="radio-item">
            <el-radio label="2">内容标题 + 网站关键词</el-radio>
          </div>
          <div class="radio-item">
            <el-radio label="3">内容标题 + 网站名称</el-radio>
          </div>
          <div class="radio-item">
            <el-radio label="4">内容标题 + 网站关键词 + 网站名称</el-radio>
          </div>
        </el-radio-group>
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
      formData: {},
      confirmLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'config'
    ])
  },
  created() {
    const { topcode, bottomcode, seo_title_type } = this.config
    this.formData = { topcode, bottomcode, seo_title_type }
  },
  methods: {
    async handleSubmit() {
      this.confirmLoading = true
      await this.$store.dispatch('config/updateConfig', this.formData).then(() => {
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
.form-container{
  .radio-item{
    padding: 5px 0;
  }
}
.line{
  text-align: center;
}
</style>
