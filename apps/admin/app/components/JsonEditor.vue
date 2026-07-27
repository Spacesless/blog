<template>
  <el-input
    v-model="text"
    type="textarea"
    :autosize="{ minRows: 5 }"
    class="json-editor"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const props = withDefaults(defineProps<{
  modelValue?: any
}>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void
}>()

const text = ref('')

watch(() => props.modelValue, (val) => {
  try {
    text.value = JSON.stringify(val, null, 2)
  } catch {
    text.value = String(val)
  }
}, { immediate: true })

function onBlur() {
  try {
    const data = JSON.parse(text.value)
    emit('update:modelValue', data)
  } catch {
    ElMessage.error('JSON 格式有误')
  }
}
</script>

<style lang="scss" scoped>
.json-editor :deep(textarea) {
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
}
</style>
