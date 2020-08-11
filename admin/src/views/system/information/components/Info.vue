<template>
  <div class="web-info">
    <el-form
      ref="form"
      :model="formData"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item label="网站名称">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.sitename" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="网站关键词">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.keywords" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">多个关键词请用竖线|隔开，建议3到4个关键词。</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.description" type="textarea" :rows="5" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">网站描述建议80到120个字符。</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="网站logo">
        <upload-image :file-list="formData.weblogo" />
      </el-form-item>
      <el-form-item label="默哀模式">
        <el-switch v-model="formData.isSilent " />
      </el-form-item>
      <el-form-item class="form-title">
        底部信息设置
      </el-form-item>
      <el-form-item label="ICP备案号">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.icp_beian" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">工信部ICP备案号</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="公网安备">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.police_beian" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">公安部网络安全备案号</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadImage from '@/components/Upload/index'

export default {
  components: {
    UploadImage
  },
  props: {
    configs: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {},
      confirmLoading: false
    }
  },
  created() {
    const { sitename, siteurl, keywords, description, logo, icp_beian, police_beian } = this.config
    this.formData = { sitename, siteurl, keywords, description, logo, icp_beian, police_beian }
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
.avatar-uploader{
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
  }
  &-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
}
</style>
