<template>
  <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" />
    </el-form-item>
    <el-form-item v-if="!currentId" label="密码" prop="password">
      <el-input v-model="formData.password" />
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model="formData.nickname" />
    </el-form-item>
    <el-form-item v-if="currentId" label="最后登录时间">
      <el-date-picker
        v-model="formData.login_time"
        type="datetime"
        readonly
      />
    </el-form-item>
    <el-form-item label="是否激活">
      <el-switch v-model="formData.status" />
    </el-form-item>
  </el-form>
</template>

<script>
import { UpdateAdminInfo } from '@/api/user'

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: {},
      fetchLoading: false,
      rules: {

      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      this.fetchData()
    }
  },
  methods: {
    fetchData() {

    },
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.dialogLoading = true

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
        this.dialogLoading = false
      })
    }
  }
}
</script>
