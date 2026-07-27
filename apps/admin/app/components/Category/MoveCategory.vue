<template>
  <el-dialog
    v-model="visible"
    title="移动栏目"
    :close-on-click-modal="false"
    width="640px"
    @closed="onClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="rules">
      <el-form-item label="移动到" prop="category">
        <el-cascader
          v-model="formData.category"
          :options="categoryOptions"
          :props="{ checkStrictly: true, emitPath: false }"
          placeholder="请选择栏目"
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getCategoryByType } from '~/utils'

const props = withDefaults(defineProps<{
  dialogVisible?: boolean
  currentRow?: Record<string, any>
  categories?: any[]
}>(), {
  dialogVisible: false,
  currentRow: () => ({}),
  categories: () => [],
})

const emit = defineEmits<{
  (e: 'onConfirm', refresh: boolean): void
}>()

const visible = computed({
  get: () => props.dialogVisible,
  set: (v: boolean) => {
    if (!v) emit('onConfirm', false)
  },
})

const formRef = ref<FormInstance | null>(null)
const formData = reactive<{ category?: number }>({})
const dialogLoading = ref(false)

const rules: FormRules = {
  category: [{ required: true, message: '请选择栏目', trigger: 'change' }],
}

const categoryOptions = computed(() => getCategoryByType(props.categories as any, props.currentRow.type))

const api = useApi()

function handleConfirm() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    dialogLoading.value = true
    try {
      await api.UpdateContent('category', { id: props.currentRow.id, parent_id: formData.category })
      ElMessage.success('移动栏目成功')
      emit('onConfirm', true)
    } catch {
      ElMessage.error('移动栏目失败')
    }
    dialogLoading.value = false
  })
}

function handleCancel() {
  emit('onConfirm', false)
}

function onClosed() {
  formRef.value?.resetFields()
  Object.keys(formData).forEach(k => delete (formData as any)[k])
}
</script>
