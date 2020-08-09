<template>
  <div class="feedback">
    <h1 class="feedback__title">在线反馈</h1>
    <el-row>
      <el-col :sm="24" :md="18" :lg="16">
        <el-form class="feedback-form" ref="form" :model="formData" :rules="rules" label-width="80px" size="medium">
          <h2 class="feedback-form__title">选择、填写反馈内容</h2>
          <el-form-item label="反馈分类" prop="type">
            <el-select v-model="formData.type" placeholder="请选择反馈分类" filterable allow-create>
              <el-option label="BUG提交" :value="1"></el-option>
              <el-option label="修改建议" :value="2"></el-option>
              <el-option label="友链提交" :value="3"></el-option>
              <el-option label="版权问题" :value="4"></el-option>
              <el-option label="其他" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="反馈内容" prop="content">
            <el-input
              v-model="formData.content"
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="相关页面">
            <el-input v-model="formData.pageUrl" placeholder="请输入相关页面"></el-input>
          </el-form-item>
          <h2 class="feedback-form__title">填写联系方式</h2>
          <el-form-item label="呢称">
            <el-input v-model="formData.nickname" placeholder="怎么称呼呢"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱地址"></el-input>
          </el-form-item>
          <el-form-item class="form-captcha" label="验证码" prop="captcha">
            <el-input
              ref="captcha"
              v-model="formData.captcha"
              placeholder="请输入验证码"
              name="captcha"
              type="text"
              tabindex="3"
            ></el-input>
            <div class="svg-captcha" @click="renderCaptcha" v-html="svgCaptcha"></div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="postLoading" @click="handleSumbit">立即提交</el-button>
            <el-button type="warning" @click="handleReset" plain>重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// 在线反馈
export default {
  data() {
    return {
      formData: {},
      svgCaptcha: '',
      rules: {
        type: [{ required: true, trigger: 'change', message: '请选择反馈类型' }],
        content: [{ required: true, trigger: 'blur', message: '请输入反馈内容' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      postLoading: false
    }
  },
  computed: {
    ...mapGetters(['configs'])
  },
  head() {
    const { sitename, keywords, description } = this.configs
    return {
      title: `在线反馈 - ${sitename}`,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'keyword', name: 'keyword', content: keywords }
      ]
    }
  },
  mounted() {
    this.renderCaptcha()
  },
  methods: {
    async renderCaptcha() {
      // SVG二维码参数
      const svgOptions = {
        width: 130,
        height: 34,
        fontSize: 28
      }

      this.svgCaptcha = await this.$axios.$get('/feedback/captcha', {
        params: svgOptions
      })
      this.formData.captcha = ''
    },
    handleSumbit() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.postLoading = true
        await this.$axios.post('/feedback', this.formData).then(res => {
          this.$notify({
            title: '提交成功',
            message: '反馈处理结果，请留意邮件通知',
            type: 'success'
          })
          this.handleReset()
        }).catch(error => {
          if (error) {
            this.$notify.error({
              title: '提交失败',
              message: error
            })
            if (error === '验证码不正确') this.renderCaptcha()
          }
        })
        this.postLoading = false
      })
    },
    handleReset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.feedback{
  &__title{
    font-size: 32px;
    font-weight: normal;
    line-height: 1.5;
    margin: 30px 0 15px;
  }
  &-form{
    &__title{
      position: relative;
      font-weight: normal;
      line-height: 1em;
      padding-left: 15px;
      color: #303133;
      margin: 15px 0;
      &:before{
        content: '';
        display: block;
        position: absolute;
        width: 3px;
        height: 100%;
        left: 0;
        top: 0;
        background-color: $primary;
      }
    }
  }
  .form-captcha{
    position: relative;
    .el-input{
      width: 291px;
      .el-input__inner{
        padding-right: 140px;
      }
    }
    .svg-captcha{
      position: absolute;
      top: 1px;
      left: 160px;
      cursor: pointer;
      border-radius: 4px;
    }
  }
}
</style>
