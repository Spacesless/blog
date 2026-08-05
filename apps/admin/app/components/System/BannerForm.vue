<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    :close-on-click-modal="false"
    width="640px"
    @open="onOpen"
    @closed="onClosed"
  >
    <el-form ref="formRef" v-loading="fetchLoading" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="图片" prop="imgurl">
        <Upload v-model:url="formData.imgurl" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item label="状态修改">
        <el-select v-model="formData.is_show">
          <el-option label="前台隐藏" :value="0" />
          <el-option label="前台显示" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="formData.sort" controls-position="right" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const props = withDefaults(defineProps<{
  dialogVisible?: boolean
  currentId?: number
}>(), {
  dialogVisible: false,
  currentId: 0,
})

const emit = defineEmits<{
  (e: 'onConfirm', refresh: boolean): void
}>()

const visible = computed({
  get: () => props.dialogVisible,
  set: (v: boolean) => { if (!v) emit('onConfirm', false) },
})

const api = useApi()
const formRef = ref<FormInstance | null>(null)
const formData = reactive<Record<string, any>>({ is_show: 1 })
const dialogTitle = ref('')
const fetchLoading = ref(false)
const dialogLoading = ref(false)

const rules: FormRules = {
  imgurl: [{ required: true, message: '请选择图片', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
}

function onOpen() {
  Object.keys(formData).forEach(k => delete (formData as any)[k])
  formData.is_show = 1
  if (props.currentId) {
    dialogTitle.value = '修改Banner'
    fetchData()
  } else {
    dialogTitle.value = '添加Banner'
  }
}

async function fetchData() {
  fetchLoading.value = true
  try {
    const res: any = await api.GetContent('banner', props.currentId)
    Object.assign(formData, res.data)
  } catch {}
  fetchLoading.value = false
}

function handleConfirm() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    dialogLoading.value = true
    const submitHandler = props.currentId ? api.UpdateContent : api.CreateContent
    try {
      await submitHandler('banner', { ...formData })
      ElMessage.success(props.currentId ? '更新成功' : '添加成功')
      emit('onConfirm', true)
    } catch {
      ElMessage.error(props.currentId ? '更新失败' : '添加失败')
    }
    dialogLoading.value = false
  })
}

function handleCancel() {
  emit('onConfirm', false)
}

function onClosed() {
  formRef.value?.resetFields()
}
</script>
