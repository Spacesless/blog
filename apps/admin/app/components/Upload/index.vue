<template>
  <div class="upload">
    <el-upload
      ref="uploadRef"
      class="upload-file"
      :class="{ 'upload-file--disable': isDisableUpload }"
      list-type="picture-card"
      :action="''"
      :accept="accept"
      :multiple="multiple"
      :limit="limit"
      :file-list="innerFileList"
      :before-upload="beforeUpload"
      :http-request="handleUploadFile"
      :on-remove="onRemove"
      :on-preview="handlePreviewCard"
      :on-exceed="onExceed"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-button-group v-if="enableExtra" class="upload-menus">
      <el-button type="primary" plain @click="albumVisible = true">
        <el-icon><Picture /></el-icon>
        图片库
      </el-button>
      <el-button type="primary" plain @click="linksVisible = true">
        <el-icon><Share /></el-icon>
        网络图片
      </el-button>
    </el-button-group>

    <el-image-viewer
      v-if="previewVisible"
      :url-list="previewSrcList"
      :initial-index="previewIndex"
      @close="previewVisible = false"
    />

    <UploadPictureAlbum v-model:visible="albumVisible" @on-select-file="onSelectFile" />
    <UploadPictureLinks v-model:visible="linksVisible" :file-list="innerFileList" @on-file-url-change="onFileUrlChange" />
  </div>
</template>

<script setup lang="ts">
import type { UploadFile, UploadInstance, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus, Picture, Share } from '@element-plus/icons-vue'

interface FileItem {
  name?: string
  url: string
}

const props = withDefaults(defineProps<{
  modelValue?: string | string[] | FileItem[]
  module?: string
  accept?: string
  multiple?: boolean
  limit?: number
  enableExtra?: boolean
}>(), {
  modelValue: '',
  module: 'common',
  accept: 'image/*',
  multiple: false,
  limit: 0,
  enableExtra: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | string[] | FileItem[]): void
  (e: 'change', v: string | string[] | FileItem[]): void
}>()

const api = useApi()
const uploadRef = ref<UploadInstance | null>(null)
const albumVisible = ref(false)
const linksVisible = ref(false)
const previewVisible = ref(false)
const previewIndex = ref(0)

const isString = computed(() => typeof props.modelValue === 'string')

const innerFileList = ref<UploadUserFile[]>([])

watch(() => props.modelValue, (val) => {
  innerFileList.value = normalizeToFileList(val)
}, { immediate: true })

function normalizeToFileList(val: string | string[] | FileItem[] | undefined): UploadUserFile[] {
  if (!val) return []
  if (typeof val === 'string') {
    return val ? [{ name: getNameFromUrl(val), url: val }] as UploadUserFile[] : []
  }
  if (Array.isArray(val)) {
    return val.map((item: any) => {
      if (typeof item === 'string') return { name: getNameFromUrl(item), url: item }
      return { name: item.name || getNameFromUrl(item.url), url: item.url }
    }) as UploadUserFile[]
  }
  return []
}

function getNameFromUrl(url: string): string {
  if (!url) return ''
  const parts = url.split('/')
  return parts[parts.length - 1] || url
}

const isDisableUpload = computed(() => {
  if (props.multiple) {
    return props.limit > 0 && innerFileList.value.length >= props.limit
  }
  return innerFileList.value.length > 0
})

const previewSrcList = computed(() => innerFileList.value.map(f => (f.url || '')))

function emitChange() {
  if (isString.value) {
    const first = innerFileList.value[0]
    const url = first?.url || ''
    emit('update:modelValue', url)
    emit('change', url)
  } else if (Array.isArray(props.modelValue) && props.modelValue.every(x => typeof x === 'string')) {
    const urls = innerFileList.value.map(f => f.url || '')
    emit('update:modelValue', urls as string[])
    emit('change', urls as string[])
  } else {
    const list = innerFileList.value.map(f => ({ name: f.name || '', url: f.url || '' }))
    emit('update:modelValue', list)
    emit('change', list)
  }
}

function beforeUpload(file: File) {
  if (props.accept.startsWith('image/') && !file.type.includes('image')) {
    ElMessage.error('上传的文件只能是图片格式!')
    return false
  }
  return true
}

async function handleUploadFile(param: any) {
  const file: File = param.file
  const formData = new FormData()
  formData.append('file', file)
  if (props.module) formData.append('module', props.module)
  try {
    const res: any = await api.UploadFiles(formData)
    const data = res?.data
    let url = ''
    let name = file.name
    if (Array.isArray(data) && data.length) {
      url = data[0].url || data[0]
      name = data[0].name || name
    } else if (data?.url) {
      url = data.url
      name = data.name || name
    } else if (typeof data === 'string') {
      url = data
    }
    if (!url) {
      ElMessage.error('上传失败')
      return
    }
    if (!props.multiple) {
      innerFileList.value = [{ name, url } as UploadUserFile]
    } else {
      innerFileList.value.push({ name, url } as UploadUserFile)
    }
    emitChange()
    ElMessage.success('上传成功')
  } catch {
    ElMessage.error('上传失败')
  }
}

function onRemove(file: UploadFile, list: UploadUserFile[]) {
  innerFileList.value = list.map((item: any) => {
    const data = item.response ? (item.response.data || item) : item
    return { name: data.name, url: data.url || item.url }
  }) as UploadUserFile[]
  emitChange()
}

function onExceed() {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

function handlePreviewCard(file: UploadFile) {
  const url = file.url || ''
  previewIndex.value = previewSrcList.value.indexOf(url)
  if (previewIndex.value < 0) previewIndex.value = 0
  previewVisible.value = true
}

function onSelectFile(files: FileItem[]) {
  if (!files?.length) return
  if (props.multiple) {
    const merged = [...innerFileList.value, ...files] as UploadUserFile[]
    innerFileList.value = merged
  } else {
    innerFileList.value = [files[0]] as UploadUserFile[]
  }
  emitChange()
}

function onFileUrlChange(files: FileItem[]) {
  innerFileList.value = files as UploadUserFile[]
  emitChange()
}
</script>

<style lang="scss" scoped>
.upload {
  &-menus {
    padding-top: 10px;
  }

  &-file {
    :deep(.el-upload--picture-card) {
      width: 180px;
      height: 180px;
      line-height: 180px;
    }

    :deep(.el-upload-list--picture-card) {
      .el-upload-list__item {
        width: 180px;
        height: 180px;
      }

      .el-upload-list__item-thumbnail {
        object-fit: contain;
      }
    }

    &--disable {
      :deep(.el-upload--picture-card) {
        display: none;
      }
    }
  }
}
</style>
