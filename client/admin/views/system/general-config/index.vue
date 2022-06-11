<template>
  <div class="app-container general">
    <el-form
      ref="form"
      :model="formData"
      :label-position="device === 'desktop' ? 'left' : 'top'"
      label-width="100px"
      class="form-container is-stick"
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
            <span style="margin-left: 15px;">多个关键词请用竖线|隔开，建议3到4个关键词。</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.description" type="textarea" :rows="5" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left: 15px;">网站描述建议80到120个字符。</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="工信备案">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.icp_beian" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="公网安备">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.police_beian" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="沉寂模式">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-switch v-model="formData.is_silent" :active-value="1" :inactive-value="0" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="Live2d模型">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.live2d_model" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="Live2d材质">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.live2d_texture" />
          </el-col>
        </el-row>
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

export default {
  name: 'GeneralConfig',
  data () {
    return {
      formData: {},
      confirmLoading: false
    }
  },
  computed: {
    ...mapGetters(['configs', 'device'])
  },
  watch: {
    configs: {
      handler (data) {
        const {
          sitename, keywords, description, icp_beian, police_beian,
          is_silent, live2d_model, live2d_texture
        } = data
        this.formData = {
          sitename,
          keywords,
          description,
          icp_beian,
          police_beian,
          is_silent: +is_silent,
          live2d_model,
          live2d_texture
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
