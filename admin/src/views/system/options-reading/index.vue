<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="formData"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item label="label">
        <el-select v-model="formData.model" placeholder="">
          <el-option label="最新文章" value="updatetime" />
          <el-option label="最热文章" value="hots" />
        </el-select>
      </el-form-item>
      <el-form-item label="label">
        <el-input-number v-model="formData.a" :min="1" controls-position="right" />
      </el-form-item>
      <el-form-item label="label">
        <el-input-number v-model="formData.b" :min="1" controls-position="right" />
      </el-form-item>
      <el-form-item label="label">
        <el-input-number v-model="formData.c" :min="1" controls-position="right" />
      </el-form-item>

      <el-form-item class="text-right">
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      formData: {},
      confirmLoading: false
    }
  },
  computed: {
    ...mapGetters(['configs'])
  },
  created() {

  },
  methods: {
    async handleSubmit() {
      this.confirmLoading = true
      await this.$store.dispatch('config/updateConfigs', this.formData).then(() => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '更新失败'
        })
      })
      this.confirmLoading = false
    }
  }
}
</script>
