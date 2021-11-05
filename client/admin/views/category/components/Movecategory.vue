<template>
  <el-dialog
    title="移动栏目"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    width="640px"
    @close="handleCancel"
    @closed="onClosed"
  >
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item label="移动到" prop="category">
        <el-cascader
          v-model="formData.category"
          :options="categoryOptions"
          :props="{
            checkStrictly: true,
            emitPath: false
          }"
          placeholder="请选择栏目"
          clearable
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="dialogLoading" @click="handleConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dialogForm } from '@/mixins'
import { getCategoryByType } from '@/utils'

export default {
  mixins: [dialogForm],
  props: {
    currentRow: {
      type: Object,
      default: () => {}
    },
    categorys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {},
      rules: {
        category: [{ required: true, message: '请选择栏目', trigger: 'change' }]
      }
    }
  },
  computed: {
    categoryOptions() {
      const { type } = this.currentRow
      return getCategoryByType(this.categorys, type)
    }
  },
  methods: {
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        const postData = {
          id: this.currentRow.id,
          parent_id: this.formData.category
        }
        this.dialogLoading = true
        await this.$api.content.UpdateContent('category', postData).then(res => {
          this.$message({
            type: 'success',
            message: '移动栏目成功'
          })
          this.$emit('onConfirm', true)
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '移动栏目失败'
          })
        })
        this.dialogLoading = false
      })
    }
  }
}
</script>
