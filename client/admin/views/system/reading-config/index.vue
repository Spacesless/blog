<template>
  <div class="app-container reading">
    <el-form
      ref="form"
      :model="formData"
      :label-position="device === 'desktop' ? 'left' : 'top'"
      label-width="100px"
      class="form-container is-stick"
    >
      <el-form-item class="form-title">
        缩略图生成
      </el-form-item>
      <el-form-item label="裁剪方式">
        <el-radio-group v-model="formData.image_fit">
          <el-radio label="0">
            填充(保留长宽比,通过裁剪/剪切以确保图像覆盖两个提供的尺寸)
          </el-radio>
          <el-radio label="1">
            包含(保留长宽比,包含两个提供的尺寸)
          </el-radio>
          <el-radio label="2">
            拉伸(忽略输入的宽高比，并拉伸到两个提供的尺寸)
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生成预览">
        <el-image
          class="reading-preview"
          :src="example"
          :fit="fit"
        />
      </el-form-item>
      <el-form-item class="form-title">
        首页
      </el-form-item>
      <el-form-item label="文章数量">
        <el-input-number v-model="formData.home_article_num" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="番剧数量">
        <el-input-number v-model="formData.home_bangumi_num" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item class="form-title">
        文章模块
      </el-form-item>
      <el-form-item label="缩略图宽度">
        <el-input v-model="formData.article_width" class="form-container-input" />
      </el-form-item>
      <el-form-item label="缩略图高度">
        <el-input v-model="formData.article_height" class="form-container-input" />
      </el-form-item>
      <el-form-item label="列表数量">
        <el-input-number v-model="formData.article_num" :min="1" controls-position="right" />
      </el-form-item>

      <el-form-item class="form-title">
        追番模块
      </el-form-item>
      <el-form-item label="缩略图宽度">
        <el-input v-model="formData.bangumi_width" class="form-container-input" />
      </el-form-item>
      <el-form-item label="缩略图高度">
        <el-input v-model="formData.bangumi_height" class="form-container-input" />
      </el-form-item>
      <el-form-item label="列表数量">
        <el-input-number v-model="formData.bangumi_num" :min="1" controls-position="right" />
      </el-form-item>
      <div class="stick-bottom">
        <el-button type="primary" icon="el-icon-check" :loading="confirmLoading" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const example = require('@/assets/example.jpg')

export default {
  name: 'ReadingConfug',
  data () {
    return {
      formData: {},
      confirmLoading: false,
      example
    }
  },
  computed: {
    ...mapGetters(['configs', 'device']),
    fit () {
      const fit = +this.formData.image_fit
      const fitEnum = ['cover', 'contain', 'fill']
      return fitEnum[fit] || 'none'
    }
  },
  watch: {
    configs: {
      handler (data) {
        const {
          image_fit, article_width, article_height, bangumi_width, bangumi_height,
          article_num, bangumi_num, home_article_num, home_bangumi_num
        } = data
        this.formData = {
          image_fit,
          article_width,
          article_height,
          bangumi_width,
          bangumi_height,
          article_num,
          bangumi_num,
          home_article_num,
          home_bangumi_num
        }
      },
      immediate: true
    }
  },
  methods: {
    async handleSubmit () {
      this.confirmLoading = true
      await this.$store.dispatch('config/updateConfigs', this.formData).then(() => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })

        this.$store.dispatch('config/getConfigs')
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
.reading {
  .el-radio {
    display: block;
    padding: 10px 0;
  }

  &-preview {
    width: 200px;
    height: 130px;
  }
}
</style>
