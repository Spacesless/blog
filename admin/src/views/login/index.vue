<template>
  <div class="login">
    <el-row>
      <el-col class="hidden-sm-only" :md="12" :lg="14">
        <img src="" alt="">
      </el-col>
      <el-col :sm="24" :md="12" :lg="10">
        <el-form
          ref="loginForm"
          size="large"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          label-position="left"
          @submit.native.prevent
        >
          <div class="title-container">
            <img src="@/assets/logo.png" alt="">
          </div>
          <el-form-item prop="username">
            <span class="form-label">
              <i class="el-icon-user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="form-label">
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
          <el-form-item class="form-captcha mb5" prop="captcha">
            <span class="form-label">
              <i class="el-icon-picture-outline-round" />
            </span>
            <el-input ref="captcha" v-model="loginForm.captcha" placeholder="验证码" tabindex="3" @keyup.enter.native="handleLogin" />
            <div class="svg-captcha" @click="getCaptcha" v-html="svgCaptcha" />
          </el-form-item>
          <el-form-item class="text-right mb5">
            <el-checkbox v-model="loginForm.remember">自动登录</el-checkbox>
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" native-type="submit" @click="handleLogin">登录</el-button>
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
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        remember: true
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      svgCaptcha: false,
      loading: false,
      passwordType: 'password',
      redirect: undefined
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
    this.getCaptcha()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getCaptcha() {
      // SVG二维码参数
      const svgOptions = {
        width: 150,
        height: 38,
        fontSize: 36
      }
      GetCaptcha(svgOptions).then(response => {
        this.svgCaptcha = response.data
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {})
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray: #889aa4;
.login{
	&,.el-row,.el-col{
		height: 100%;
	}
	.el-col{
		position: relative;
	}
	.title-container{
		padding: 15px 0;
		text-align: center;
		.title{
			margin: 0;
			font-weight: normal;
			font-size: 30px;
			line-height: 2em;
		}
	}
	.login-form{
		width: 100%;
		padding: 50px 30px;
		position: absolute;
		top: 50%;
		margin-top: -240px;
		.mb5{
			margin-bottom: 10px;
		}
		.el-input{
			::v-deep input{
				padding-left: 40px;
				&:focus{
					border-color: #409EFF;
				}
			}
		}
	}
	.form-label{
		width: 40px;
		text-align: center;
		position: absolute;
		left: 0;
		top: 0;
		font-size: 24px;
		color: $dark_gray;
		z-index: 5;
	}
	.show-pwd {
		position: absolute;
		right: 10px;
		top: 0;
		font-size: 16px;
		color: $dark_gray;
		cursor: pointer;
		user-select: none;
	}
  .form-captcha{
    ::v-deep .el-input__inner{
      padding-right: 160px;
    }
  }
	.svg-captcha{
    width: 150px;
    height: 38px;
    position: absolute;
    right: 1px;
    top: 1px;
    border-left: 1px solid #DCDFE6;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    overflow: hidden;
    cursor: pointer;
	}
}
</style>
