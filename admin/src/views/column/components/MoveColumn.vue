<template>
  <el-dialog
    title="移动栏目"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    width="640px"
    @open="onOpen"
    @close="handleCancel"
    @closed="onClosed"
  >
    <el-form ref="form" :model="formData">
      <el-form-item label="移动到">
        <el-cascader
          v-model="selectedColumn"
          :options="columnOptions"
          :props="{ checkStrictly: true }"
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
import { getColumnByModule } from '@/utils'
import { UpdateContent } from '@/api/content'

export default {
  mixins: [dialogForm],
  props: {
    currentRow: {
      type: Object,
      default: () => {}
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedColumn: []
    }
  },
  computed: {
    columnOptions() {
      const { module } = this.currentRow
      return getColumnByModule(this.columns, module)
    }
  },
  methods: {
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.dialogLoading = true
        const [class1, class2, class3] = this.selectedColumn
        const postData = {
          id: this.currentRow.id,
          class1, class2, class3
        }
        await UpdateContent('column', postData).then(res => {

        }).catch(() => {

        })
        this.dialogLoading = false
      })
    }
  }
}
</script>
