<template>
  <div class="login">
    <ul class="login-background">
      <li v-for="i in 10" :key="i" />
    </ul>

    <el-form
      ref="loginFormRef"
      size="large"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
      @submit.prevent
    >
      <div class="login-header">
        <img class="login-header__logo" src="~/assets/logo.jpg" alt="logo" />
        <h1 class="login-header__title">Welcome Home</h1>
      </div>

      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User" tabindex="1" clearable />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          prefix-icon="Lock"
          tabindex="2"
          show-password
        />
      </el-form-item>
      <el-form-item class="login-form-captcha" prop="captcha">
        <el-input
          v-model="loginForm.captcha"
          placeholder="验证码"
          prefix-icon="PictureFilled"
          tabindex="3"
          clearable
          @keyup.enter="handleLogin"
        />
        <div
          v-loading="captchaLoading"
          class="login-form-captcha__svg"
          v-html="svgCaptcha"
          @click="fetchCaptcha"
        />
      </el-form-item>
      <el-form-item class="login-form-remember">
        <el-checkbox v-model="loginForm.remember">记住登录状态</el-checkbox>
      </el-form-item>
      <el-button
        class="login-form-submit"
        :loading="loginLoading"
        type="primary"
        size="large"
        @click="handleLogin"
      >
        {{ loginLoading ? '登录中' : '登录' }}
      </el-button>
    </el-form>

    <div class="login-footer">
      <p class="login-footer__tips">希望我们都是会哭的孩子，更是坚强的大人</p>
      <p class="login-footer__copyright">Copyright © 2018 - {{ year }} Timeless. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

definePageMeta({ layout: 'blank' })

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const api = useApi()

const loginFormRef = ref<FormInstance>()
const loginForm = reactive({ username: '', password: '', captcha: '', remember: false })
const svgCaptcha = ref('')
const loginLoading = ref(false)
const captchaLoading = ref(false)
const passwordType = ref<'password' | 'text'>('password')
const redirect = ref<string | undefined>(undefined)
const year = new Date().getFullYear()

const validatePassword = (_rule: any, value: string, callback: any) => {
  if (value.length < 6 || value.length > 20) callback(new Error('请输入6-20位密码'))
  else callback()
}

const loginRules: FormRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }],
  captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
}

watch(
  () => route.query,
  (q) => { redirect.value = q?.redirect as string | undefined },
  { immediate: true },
)

async function fetchCaptcha() {
  loginForm.captcha = ''
  captchaLoading.value = true
  try {
    const res: any = await api.GetCaptcha({ width: 150, height: 38, fontSize: 42 })
    svgCaptcha.value = res.data || ''
  } catch (e) { /* noop */ }
  captchaLoading.value = false
}

async function handleLogin() {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    loginLoading.value = true
    try {
      await userStore.login(loginForm)
      ElMessage.success('登录成功')
      await router.push({ path: redirect.value || '/' })
    } catch (e) { /* noop */ } finally {
      loginLoading.value = false
    }
  })
}

onMounted(() => { fetchCaptcha() })
</script>

<style lang="scss" scoped>
.login {
  position: fixed;
  inset: 0;
  background: url('~/assets/login-background.jpg') no-repeat center;
  background-size: cover;

  &-header {
    margin-bottom: 24px;
    text-align: center;

    &__logo { width: 80px; height: 80px; border-radius: 50%; }
    &__title {
      font: normal 32px/50px 'Hiragino Sans GB','Microsoft YaHei',sans-serif;
      color: transparent;
      background: linear-gradient(to right, #FF4D4F, #597EF7);
      -webkit-background-clip: text;
    }
  }

  &-form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 360px;
    margin-top: -260px;
    margin-left: -180px;

    @media (max-width: 576px) {
      left: 0;
      width: 100%;
      padding: 0 20px;
      margin-left: 0;
    }

    &-captcha {
      :deep(.el-input__wrapper) { padding-right: 160px; }
      &__svg {
        position: absolute;
        top: 1px;
        right: 1px;
        width: 150px;
        height: 38px;
        overflow: hidden;
        cursor: pointer;
        border-left: 1px solid #DCDFE6;
      }
    }

    &-submit { width: 100%; }
  }

  &-footer {
    position: fixed;
    bottom: 16px;
    width: 100%;
    text-align: center;
    color: rgba(255,255,255,.85);

    &__tips { margin-bottom: 6px; font-size: 14px; }
    &__copyright { font-size: 13px; }
  }

  &-background {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    li {
      position: absolute;
      bottom: -160px;
      display: block;
      width: 40px;
      height: 40px;
      background-color: rgba(64,158,255,.2);
      animation: square 25s infinite linear;

      &:nth-child(1) { left: 10%; }
      &:nth-child(2) { left: 20%; width: 80px; height: 80px; animation-duration: 17s; animation-delay: 2s; }
      &:nth-child(3) { left: 25%; animation-delay: 4s; }
      &:nth-child(4) { left: 40%; width: 60px; height: 60px; background-color: rgba(64,158,255,.3); animation-duration: 22s; }
      &:nth-child(5) { left: 70%; }
      &:nth-child(6) { left: 80%; width: 120px; height: 120px; background-color: rgba(64,158,255,.25); animation-delay: 3s; }
      &:nth-child(7) { left: 32%; width: 160px; height: 160px; animation-delay: 7s; }
      &:nth-child(8) { left: 55%; width: 20px; height: 20px; animation-duration: 40s; animation-delay: 15s; }
      &:nth-child(9) { left: 25%; width: 10px; height: 10px; background-color: rgba(64,158,255,.35); animation-duration: 40s; animation-delay: 2s; }
      &:nth-child(10) { left: 90%; width: 160px; height: 160px; animation-delay: 11s; }
    }
  }
}

@keyframes square {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-800px) rotate(600deg); }
}
</style>
