<template>
  <div class="profile app-container">
    <el-form
      ref="form"
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
          <el-input v-model="formData.password" />
        </el-col>
      </el-form-item>
      <el-form-item label="再次输入密码" prop="againPassword">
        <el-col :sm="24" :md="12" :lg="8">
          <el-input v-model="formData.againPassword" />
        </el-col>
      </el-form-item>
      <div class="stick-bottom">
        <el-button type="primary" icon="el-icon-check" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { UpdateAdminInfo } from '@/api/user'

export default {
  name: 'OptionsProfile',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value && value.length < 6) {
        callback(new Error('密码不能少于8位'))
      } else {
        callback()
      }
    }
    const validateAgainPassword = (rule, value, callback) => {
      if (value !== this.formData.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      formData: {},
      confirmLoading: false,
      rules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        email: [
          { required: true, trigger: 'blur', message: '请输入邮箱地址' },
          { type: 'email', trigger: 'change', message: '请输入正确的邮箱地址' }
        ],
        password: [{ trigger: ['blur', 'change'], validator: validatePassword }],
        againPassword: [{ trigger: ['blur', 'change'], validator: validateAgainPassword }]
      }
    }
  },
  computed: {
    ...mapGetters(['userinfo'])
  },
  watch: {
    userinfo: {
      handler(data) {
        this.formData = { ...data }
      },
      immediate: true
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true

        await UpdateAdminInfo(this.formData).then(res => {
          this.$message({
            type: 'success',
            message: this.isEdit ? '更新成功' : '添加成功'
          })
          this.$emit('onConfirm', true)
        }).catch(() => {
          this.$message({
            type: 'error',
            message: this.isEdit ? '更新失败' : '添加失败'
          })
        })
        this.confirmLoading = false
      })
    }
  }
}
</script>
