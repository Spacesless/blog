<template>
  <div class="profile app-container">
    <el-form
      ref="formRef"
      class="form-container is-stick"
      :model="formData"
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="用户名" prop="username">
        <el-col :sm="24" :md="12" :lg="8">
          <el-input v-model="formData.username" />
        </el-col>
      </el-form-item>
      <el-form-item label="昵称">
        <el-col :sm="24" :md="12" :lg="8">
          <el-input v-model="formData.nickname" />
        </el-col>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-col :sm="24" :md="12" :lg="8">
          <el-input v-model="formData.email" />
        </el-col>
      </el-form-item>
      <el-form-item label="最后登录时间">
        <el-date-picker
          v-model="formData.login_time"
          type="datetime"
          readonly
        />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-col :sm="24" :md="12" :lg="8">
          <el-input v-model="formData.password" type="password" show-password />
        </el-col>
      </el-form-item>
      <el-form-item label="再次输入密码" prop="againPassword">
        <el-col :sm="24" :md="12" :lg="8">
          <el-input v-model="formData.againPassword" type="password" show-password />
        </el-col>
      </el-form-item>
      <div class="stick-bottom">
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">
          <el-icon><Check /></el-icon>
          保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import md5 from 'md5'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

definePageMeta({
  layout: 'default',
  title: '用户管理',
})

const api = useApi()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance | null>(null)
const confirmLoading = ref(false)
const formData = reactive<Record<string, any>>({
  username: '',
  nickname: '',
  email: '',
  login_time: '',
  password: '',
  againPassword: '',
})

const validatePassword = (_rule: any, value: string, callback: (err?: Error) => void) => {
  if (value && value.length < 6) {
    callback(new Error('密码不能少于6位'))
  } else {
    callback()
  }
}

const validateAgainPassword = (_rule: any, value: string, callback: (err?: Error) => void) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  email: [
    { required: true, trigger: 'blur', message: '请输入邮箱地址' },
    { type: 'email', trigger: 'change', message: '请输入正确的邮箱地址' },
  ],
  password: [{ trigger: ['blur', 'change'], validator: validatePassword }],
  againPassword: [{ trigger: ['blur', 'change'], validator: validateAgainPassword }],
}

watch(
  () => userStore.userinfo,
  (data) => {
    Object.assign(formData, data || {})
    formData.password = ''
    formData.againPassword = ''
  },
  { immediate: true, deep: true },
)

function handleSubmit() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    confirmLoading.value = true
    const postData: Record<string, any> = { ...formData }
    if (postData.password) {
      postData.password = md5(postData.password)
    } else {
      delete postData.password
    }
    delete postData.againPassword
    try {
      await api.UpdateAdmin(postData)
      ElMessage.success('修改成功，请重新登录')
      setTimeout(() => {
        userStore.resetToken()
        router.replace('/login')
      }, 1000)
    } catch {
      ElMessage.error('修改失败')
    }
    confirmLoading.value = false
  })
}
</script>

<style lang="scss" scoped>
.profile {
  padding: 20px;
}
</style>
