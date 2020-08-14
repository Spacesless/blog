<template>
  <div class="login">
    <el-row>
      <el-col class="login-info hidden-sm-only" :md="12" :lg="14">
        <img src="" alt="">
      </el-col>
      <el-col class="login-wrap" :sm="24" :md="12" :lg="10">
        <el-form
          ref="loginForm"
          size="large"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          label-position="left"
          @submit.native.prevent
        >
          <div class="login-form-title">
            123
          </div>
          <el-form-item prop="username">
            <span class="login-form-label">
              <i class="el-icon-user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              tabindex="1"
              auto-complete="on"
              clearable
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="login-form-label">
              <i class="el-icon-lock" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              tabindex="2"
              auto-complete="on"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-form-item class="login-form-captcha" prop="captcha">
            <span class="login-form-label">
              <i class="el-icon-picture-outline-round" />
            </span>
            <el-input
              ref="captcha"
              v-model="loginForm.captcha"
              placeholder="验证码"
              tabindex="3"
              clearable
              @keyup.enter.native="handleLogin"
            />
            <!-- svg图片验证码 -->
            <div v-loading="captchaLoading" class="login-form-captcha__svg" @click="fetchCaptcha" v-html="svgCaptcha" />
          </el-form-item>
          <!-- session有效期：不记录为1天，记录为15天 -->
          <el-form-item class="login-form-remember">
            <el-checkbox v-model="loginForm.remember">记住登录状态</el-checkbox>
          </el-form-item>
          <el-button class="login-form-submit" :loading="loginLoading" type="primary" size="large" native-type="submit" @click="handleLogin">登录</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetCaptcha } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于8位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        remember: true
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      svgCaptcha: '',
      loginLoading: false,
      captchaLoading: false,
      passwordType: 'password'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.fetchCaptcha()
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 请求接口svg图片验证码
    async fetchCaptcha() {
      this.loginForm.captcha = ''
      // SVG二维码参数
      const svgOptions = {
        width: 150,
        height: 38,
        fontSize: 36
      }
      this.captchaLoading = true
      await GetCaptcha(svgOptions).then(response => {
        this.svgCaptcha = response.data
      }).catch(() => {})
      this.captchaLoading = false
    },
    handleLogin() {
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) {
          this.loginLoading = true
          await this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
          }).catch((error) => {
            if (error === '验证码不正确') { // 验证码不正确自动刷新
              this.fetchCaptcha()
            }
          })
          this.loginLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  &,.el-row,.el-col {
    height: 100%;
  }
  .el-col {
    position: relative;
  }
  &-info {
    background-color: #0f0f0f;
  }
  &-form{
    width: 350px;
    height: 340px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -175px;
    .el-input{
      ::v-deep input{
        padding-left: 40px;
        &:focus{
          border-color: #409EFF;
        }
      }
    }
    &-title{
      height: 50px;
      line-height: 50px;
      margin-bottom: 20px;
    }
    &-label{
      width: 40px;
      text-align: center;
      position: absolute;
      left: 0;
      top: 0;
      font-size: 24px;
      color: #909399;
      z-index: 5;
    }
    &-captcha{
      ::v-deep .el-input{
        &__inner{
          padding-right: 180px;
        }
        &__suffix {
          right: 155px;
        }
      }
      &__svg{
        width: 150px;
        height: 38px;
        position: absolute;
        right: 1px;
        top: 1px;
        border-left: 1px solid #DCDFE6;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        overflow: hidden;
        cursor: pointer;
      }
    }
    &-remember{
      text-align: right;
      ::v-deep .el-form-item__content{
        line-height: 19px;
      }
    }
    &-submit{
      width: 100%;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 16px;
    color: #909399;
    cursor: pointer;
    user-select: none;
  }
}
</style>
