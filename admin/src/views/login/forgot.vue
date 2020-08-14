<template>
  <div class="forgot">
    <div class="forgot-background">
      <ul>
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
    </div>

    <div class="forgot-header">
      <el-row>
        <el-col :span="12">
          <h2 class="forgot-header__title">{{ $t('forgot.retrievePassword') }}</h2>
        </el-col>
        <el-col :span="12" class="text-right">
          <router-link to="/login" class="forgot-header-link">
            <span>返回登录</span>
            <i class="el-icon-right" />
          </router-link>
        </el-col>
      </el-row>
    </div>

    <div class="forgot-form">
      <template v-if="!isVerify">
        <el-form size="medium">
          <!-- 手机号码 -->
          <el-form-item>
            <span class="forgot-form__icon phone el-icon-mobile" />
            <el-input v-model="forgotForm.email" placeholder="" />
          </el-form-item>
          <!-- 图形验证码 -->
          <el-form-item class="forgot-form-captcha">
            <span class="forgot-form__icon">
              <svg-icon icon-class="captcha" />
            </span>
            <el-input v-model="forgotForm.captcha" />
            <div id="captcha" @click="changeCaptcha" />
          </el-form-item>
          <!-- 手机验证码 -->
          <el-form-item class="forgot-form-sms">
            <span class="forgot-form__icon">
              <svg-icon icon-class="captcha" />
            </span>
            <el-input v-model="forgotForm.verifyCode" />
            <el-button type="primary" class="forgot-form-sms__button" plain :loading="captchaLoading" @click="getSMScode">{{ captchaText }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="forgot-form__sumbit" type="primary" @click="checkCaptcha">找回密码</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-else>
        <el-form size="medium" :rules="passwordRules">
          <!-- 新密码 -->
          <el-form-item prop="password">
            <span class="forgot-form__icon password">
              <i class="el-icon-lock" />
            </span>
            <el-input v-model="passwordForm.password" type="password" />
          </el-form-item>
          <!-- 重新输入密码 -->
          <el-form-item prop="againPsw">
            <span class="forgot-form__icon password">
              <i class="el-icon-lock" />
            </span>
            <el-input v-model="passwordForm.againPsw" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button class="forgot-form__sumbit" type="primary" @click="resetPassword">重置密码</el-button>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script>
import { Captcha } from './captcha.js'
import { SendSms, ValidateVerifyCode, ResetPassword } from '@/api/user'
import { validPassword } from '@/utils/validate'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码大于8位'))
      } else {
        callback()
      }
    }
    const validateAgainPsw = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        // 2次输入密码不一致
        callback(new Error('2次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      captcha: null,
      forgotForm: {},
      passwordForm: {},
      captchaText: '获取验证码',
      captchaLoading: false,
      isVerify: false,
      passwordRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        againPsw: [{ required: true, trigger: 'blur', validator: validateAgainPsw }]
      }
    }
  },
  mounted() {
    this.renderCaptcha()
  },
  methods: {
    renderCaptcha() {
      this.captcha = new Captcha({
        id: 'captcha',
        width: 150,
        height: 36,
        fontSize: 36,
        noise: 15,
        ignoreChars: '0o1i' // 忽略难分辨的字符
      })
    },
    changeCaptcha() {
      this.captcha.refresh()
    },
    getSMScode() {
      if (this.captcha.validate(this.forgotForm.captcha)) {
        SendSms().then(res => {
          this.countDown()
        })
        this.countDown()
      } else {
        this.captcha.refresh()
        this.$message({
          message: '验证码出错',
          type: 'warning'
        })
      }
    },
    countDown() {
      let total = 60
      this.captchaText = '60 S'
      this.captchaLoading = true
      const timer = setInterval(() => {
        total--
        if (total < 0) {
          clearInterval(timer)
          this.captchaLoading = false
          this.captchaText = '获取验证码'
          return
        }
        this.captchaText = `${total} S`
      }, 1000)
    },
    checkCaptcha() {
      const { phoneNumber: sendPhone, verifyCode } = this.forgotForm
      ValidateVerifyCode(sendPhone, verifyCode).then(res => {

      })
      this.isVerify = true
    },
    resetPassword() {
      ResetPassword(this.forgotForm.phoneNumber, this.passwordForm.password).then(res => {

      })
      this.isVerify = false
      this.$nextTick(() => {
        this.renderCaptcha()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.forgot{
  height: 100%;
  position: relative;
  &-background{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    li {
      position: absolute;
      list-style: none;
      display: block;
      width: 40px;
      height: 40px;
      background-color: rgba($color: $--color-primary, $alpha: 0.2);
      bottom: -160px;
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
        background-color: rgba($color: $--color-primary, $alpha: 0.3);
      }
      &:nth-child(5) {
        left: 70%;
      }
      &:nth-child(6) {
        left: 80%;
        width: 120px;
        height: 120px;
        animation-delay: 3s;
        background-color: rgba($color: $--color-primary, $alpha: 0.25);
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
        background-color: rgba($color: $--color-primary, $alpha: 0.35);
      }
      &:nth-child(10) {
        left: 90%;
        width: 160px;
        height: 160px;
        animation-delay: 11s;
      }
    }
  }
  &-header{
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    &__title{
      font-size: 30px;
      font-weight: normal;
      color: $--color-primary;
    }
    &-link{
      color: #303133;
      span{
        padding-right: 5px;
      }
      &:hover{
        color: $--color-primary;
      }
    }
  }
  &-form{
    position: absolute;
    width: 420px;
    top: 50%;
    margin-top: -155px;
    left: 50%;
    margin-left: -210px;
    &__icon{
      position: absolute;
      left: 0;
      top: 0;
      z-index: 5;
      line-height: 36px;
      font-size: 22px;
      color: #606266;
      padding: 0 6px;
      &.phone, &.password{
        font-size: 20px;
      }
    }
    .el-input{
      ::v-deep &__inner{
        padding: 0 15px 0 30px;
      }
    }
    &-captcha{
      .el-input{
        width: calc(100% - 160px)
      }
      #captcha{
        width: 150px;
        height: 36px;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 4px;
        overflow: hidden;
        user-select: none;
      }
    }
    &-sms{
      .el-input{
        width: calc(100% - 160px)
      }
      &__button{
        width: 150px;
        position: absolute;
        right: 0;
      }
    }
    &__sumbit{
      width: 100%;
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
