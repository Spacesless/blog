<template>
  <div class="app-container media">
    <el-form
      ref="form"
      :model="formData"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item class="form-title">裁剪设置</el-form-item>
      <el-form-item label="生成方式">
        <el-radio-group v-model="formData.thumb_kind">
          <el-radio label="0">填充(保留长宽比,通过裁剪/剪切以确保图像覆盖两个提供的尺寸)</el-radio>
          <el-radio label="1">包含(保留长宽比,包含两个提供的尺寸)</el-radio>
          <el-radio label="2">拉伸(忽略输入的宽高比，并拉伸到两个提供的尺寸)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生成预览">
        <el-image
          class="media-preview"
          src="https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg"
          :fit="fit"
        />
      </el-form-item>
      <el-form-item class="form-title">缩略图大小(像素)</el-form-item>
      <el-form-item label="文章模块">
        <el-row>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_blog_x" placeholder="宽度" />
          </el-col>
          <el-col :xs="2" :md="1" :lg="1" class="text-center">
            <span class="el-icon-close" />
          </el-col>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_blog_y" placeholder="高度" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="图片模块">
        <el-row>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_image_x" placeholder="宽度" />
          </el-col>
          <el-col :xs="2" :md="1" :lg="1" class="text-center">
            <span class="el-icon-close" />
          </el-col>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_image_y" placeholder="高度" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="追番模块">
        <el-row>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_bangumi_x" placeholder="宽度" />
          </el-col>
          <el-col :xs="2" :md="1" :lg="1" class="text-center">
            <span class="el-icon-close" />
          </el-col>
          <el-col :xs="12" :md="5" :lg="3">
            <el-input v-model="formData.thumb_bangumi_y" placeholder="高度" />
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
    ...mapGetters(['configs']),
    fit() {
      const fit = this.formData.thumb_kind
      const fitEnum = ['cover', 'contain', 'fill']
      return fitEnum[fit] || 'none'
    }
  },
  created() {
    const { thumb_blog_x, thumb_blog_y, thumb_image_x, thumb_image_y, thumb_bangumi_x, thumb_bangumi_y } = this.configs
    this.formData = { thumb_blog_x, thumb_blog_y, thumb_image_x, thumb_image_y, thumb_bangumi_x, thumb_bangumi_y }
  },
  methods: {
    async handleSubmit() {
      this.confirmLoading = true
      await this.$store.dispatch('config/updateConfigs', this.formData).then(() => {
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
.media{
  .el-radio {
    display: block;
    padding: 10px 0;
  }
  &-preview {
    width: 120px;
    height: 100px;
  }
}
</style>
