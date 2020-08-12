<template>
  <el-dialog
    :title="dialogTitle"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    width="640px"
    @open="onOpen"
    @close="handleCancel"
    @closed="onClosed"
  >

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

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="dialogLoading" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dialogForm } from '@/mixins'
import { UpdateAdminInfo } from '@/api/user'

export default {
  mixins: [dialogForm],
  props: {
    currentRow: {
      type: Object,
      default: () => {}
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
    this.fetchData()
  },
  methods: {
    onOpen() {
      this.currentId && this.fetchData()
    },
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.dialogLoading = true

        await UpdateAdminInfo(this.formData).then(res => {

        }).catch(() => {

        })
        this.dialogLoading = false
      })
    }
  }
}
</script>
