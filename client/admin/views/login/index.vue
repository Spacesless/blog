<template>
  <div class="login">
    <ul class="login-background">
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
    </ul>

    <el-form
      ref="loginForm"
      size="large"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
      @submit.native.prevent
    >
      <div class="login-header">
        <img class="login-header__logo" src="@/assets/logo.jpg" alt="logo">
        <h1 class="login-header__title">Welcome Home</h1>
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
      <el-button
        class="login-form-submit"
        :loading="loginLoading"
        type="primary"
        size="large"
        @click="handleLogin"
      >{{ loginLoading ? '登录中' : '登录' }}</el-button>
    </el-form>

    <div class="login-footer">
      <p class="login-footer__tips">希望我们都是会哭的孩子，更是坚强的大人</p>
      <p class="login-footer__copyright">Copyright © 2018 - 2021 Timeless. All rights reserved. </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  layout: 'index',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 20) {
        callback(new Error('请输入6-20位密码'))
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
        fontSize: 50,
        background: '#ecf5ff'
      }
      this.captchaLoading = true
      await this.$api.common.GetCaptcha(svgOptions).then(response => {
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
          }).catch(() => {})
          this.loginLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url(~@/assets/login-background.jpg) no-repeat center;
  background-size: cover;
  &-header{
    margin-bottom: 24px;
    text-align: center;
    &__logo{
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    &__title{
      color: transparent;
      font: normal 32px/50px eafont,Hiragino Sans GB,Hiragino Sans GB W3,Microsoft YaHei;
      background: linear-gradient(to right, #ff4d4f, #597ef7);
      background-clip: text;
    }
  }
  &-form{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 360px;
    margin-top: -260px;
    margin-left: -180px;
    @media (max-width: 576px){
      width: 100%;
      padding: 0 20px;
      left: 0;
      margin-left: 0;
    }
    .el-input{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      ::v-deep input{
        padding-left: 40px;
        &:focus{
          border-color: #409EFF;
        }
      }
    }
    &-label{
      position: absolute;
      left: 0;
      top: 0;
      z-index: 5;
      width: 40px;
      color: #909399;
      font-size: 24px;
      text-align: center;
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
        overflow: hidden;
        position: absolute;
        right: 1px;
        top: 1px;
        width: 150px;
        height: 38px;
        border-left: 1px solid #DCDFE6;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        cursor: pointer;
      }
    }
    &-remember{
      position: relative;
      ::v-deep .el-form-item__content{
        line-height: 19px;
      }
    }
    &-submit{
      width: 100%;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    color: #909399;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }

  &-footer{
    position: fixed;
    bottom: 16px;
    width: 100%;
    text-align: center;
    &__tips{
      margin-bottom: 6px;
      color: rgba(0,0,0,.65);
      font-size: 14px;
    }
    &__copyright{
      color: rgba(0,0,0,.45);
      font-size: 13px;
    }
  }

  &-background{
    overflow: hidden;
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    li {
      display: block;
      position: absolute;
      bottom: -160px;
      width: 40px;
      height: 40px;
      background-color: rgba($color: #409EFF, $alpha: 0.2);
      list-style: none;
      animation: square 25s infinite;
      transition-timing-function: linear;
      &:nth-child(1) {
        left: 10%;
      }
      &:nth-child(2) {
        left: 20%;
        width: 80px;
        height: 80px;
        animation-delay: 2s;
        animation-duration: 17s;
      }
      &:nth-child(3) {
        left: 25%;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-duration: 22s;
        background-color: rgba($color: #409EFF, $alpha: 0.3);
      }
      &:nth-child(5) {
        left: 70%;
      }
      &:nth-child(6) {
        left: 80%;
        width: 120px;
        height: 120px;
        animation-delay: 3s;
        background-color: rgba($color: #409EFF, $alpha: 0.25);
      }
      &:nth-child(7) {
        left: 32%;
        width: 160px;
        height: 160px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 55%;
        width: 20px;
        height: 20px;
        animation-delay: 15s;
        animation-duration: 40s;
      }
      &:nth-child(9) {
        left: 25%;
        width: 10px;
        height: 10px;
        animation-delay: 2s;
        animation-duration: 40s;
        background-color: rgba($color: #409EFF, $alpha: 0.35);
      }
      &:nth-child(10) {
        left: 90%;
        width: 160px;
        height: 160px;
        animation-delay: 11s;
      }
    }
  }
}
@keyframes square {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-800px) rotate(600deg);
    opacity: 0;
  }
}
</style>
