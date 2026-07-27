<template>
  <div class="app-container general">
    <el-form
      ref="formRef"
      :model="formData"
      :label-position="appStore.device === 'desktop' ? 'left' : 'top'"
      label-width="100px"
      class="form-container is-stick"
    >
      <el-form-item label="网站名称">
        <el-input v-model="formData.sitename" class="!w-full max-w-[600px]" />
      </el-form-item>
      <el-form-item label="网站关键词">
        <div class="flex gap-15px items-center flex-wrap w-full">
          <el-input v-model="formData.keywords" class="!w-full max-w-[600px]" />
          <span>多个关键词请用竖线|隔开，建议3到4个关键词。</span>
        </div>
      </el-form-item>
      <el-form-item label="网站描述">
        <div class="flex gap-15px items-start flex-wrap w-full">
          <el-input v-model="formData.description" type="textarea" :rows="5" class="!w-full max-w-[600px]" />
          <span>网站描述建议80到120个字符。</span>
        </div>
      </el-form-item>
      <el-form-item label="工信备案">
        <el-input v-model="formData.icp_beian" class="!w-full max-w-[600px]" />
      </el-form-item>
      <el-form-item label="公网安备">
        <el-input v-model="formData.police_beian" class="!w-full max-w-[600px]" />
      </el-form-item>
      <el-form-item label="沉寂模式">
        <el-switch v-model="formData.is_silent" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="Live2d模型">
        <el-input v-model="formData.live2d_model" class="!w-full max-w-[600px]" />
      </el-form-item>
      <el-form-item label="Live2d材质">
        <el-input v-model="formData.live2d_texture" class="!w-full max-w-[600px]" />
      </el-form-item>
      <div class="stick-bottom">
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">
          <el-icon><Check /></el-icon>
          保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

definePageMeta({
  layout: 'default',
  title: '常规配置',
  noCache: true,
})

const appStore = useAppStore()
const configStore = useConfigStore()

const formData = reactive<Record<string, any>>({})
const confirmLoading = ref(false)

watch(() => configStore.configs, (data) => {
  const { sitename, keywords, description, icp_beian, police_beian, is_silent, live2d_model, live2d_texture } = data || {}
  Object.assign(formData, {
    sitename,
    keywords,
    description,
    icp_beian,
    police_beian,
    is_silent: +(is_silent || 0),
    live2d_model,
    live2d_texture,
  })
}, { immediate: true, deep: true })

async function handleSubmit() {
  confirmLoading.value = true
  try {
    await configStore.updateConfigs({ ...formData })
    ElMessage.success('更新成功')
    configStore.getConfigs()
  } catch {
    ElMessage.error('更新失败')
  }
  confirmLoading.value = false
}
</script>
