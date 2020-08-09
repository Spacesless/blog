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
        缩略图设置
      </el-form-item>
      <el-form-item label="生成方式">
        <el-radio-group v-model="formData.thumb_kind">
          <el-radio label="1">填充</el-radio>
          <el-radio label="2">拉伸</el-radio>
          <el-radio label="3">留白</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文章模块">
        <el-row>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_blog_x" placeholder="宽（像素）" />
          </el-col>
          <el-col :xs="2" :md="1" :lg="1" class="text-center">
            <span class="el-icon-close" />
          </el-col>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_blog_y" placeholder="高（像素）" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="图片模块">
        <el-row>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_image_x" placeholder="宽（像素）" />
          </el-col>
          <el-col :xs="2" :md="1" :lg="1" class="text-center">
            <span class="el-icon-close" />
          </el-col>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_image_y" placeholder="高（像素）" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="追番模块">
        <el-row>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_bangumi_x" placeholder="宽（像素）" />
          </el-col>
          <el-col :xs="2" :md="1" :lg="1" class="text-center">
            <span class="el-icon-close" />
          </el-col>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_bangumi_y" placeholder="高（像素）" />
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
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      formData: {},
      confirmLoading: false
    }
  },
  computed: {
    ...mapGetters(['config'])
  },
  created() {
    const { thumb_blog_x, thumb_blog_y, thumb_image_x, thumb_image_y, thumb_bangumi_x, thumb_bangumi_y } = this.config
    this.formData = { thumb_blog_x, thumb_blog_y, thumb_image_x, thumb_image_y, thumb_bangumi_x, thumb_bangumi_y }
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
.line{
  text-align: center;
}
</style>
