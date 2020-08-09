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
      123
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="dialogLoading" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dialogForm } from '@/mixins'
import { GetContent, CreateContent, UpdateContent } from '@/api/content'

export default {
  mixins: [dialogForm],
  props: {
    currentId: {
      type: Number,
      default: 0
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
    async fetchData() {
      this.fetchLoading = true
      await GetContent('links', this.currentId).then(res => {
        this.formData = res.data
      }).catch(() => {})
      this.fetchLoading = false
    },
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.dialogLoading = true

        const SubmitHandler = this.currentId ? UpdateContent : CreateContent
        await SubmitHandler(this.formData).then(res => {

        }).catch(() => {

        })
        this.dialogLoading = false
      })
    }
  }
}
</script>
