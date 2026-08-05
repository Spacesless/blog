<template>
  <div class="upload">
    <el-button-group class="upload-menus">
      <el-button type="primary" plain @click="handleUpload">
        <el-icon><Check /></el-icon>
      </el-button>
      <el-button type="primary" plain @click="albumVisible = true">
        <el-icon><Picture /></el-icon>
      </el-button>
      <el-button type="primary" plain @click="linksVisible = true">
        <el-icon><Share /></el-icon>
      </el-button>
    </el-button-group>

    <el-upload
      ref="uploadRef"
      v-model:file-list="innerFileList"
      class="upload-file"
      :class="{ 'upload-file-drag': draggable, 'upload-file--disable': isDisableUpload }"
      list-type="picture-card"
      :action="''"
      :accept="accept"
      :multiple="multiple"
      :limit="limit"
      :drag="draggable"
      :auto-upload="false"
      :before-upload="beforeUpload"
      :http-request="handleUploadFile"
      :on-preview="handlePreviewCard"
      :on-exceed="onExceed"
    >
      <template v-if="draggable">
        <el-icon class="upload-drag-icon"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </template>
      <el-icon v-else><Plus /></el-icon>
    </el-upload>

    <el-image-viewer
      v-if="previewVisible"
      :url-list="previewSrcList"
      :initial-index="previewIndex"
      @close="previewVisible = false"
    />

    <UploadPictureAlbum v-model:visible="albumVisible" @on-select-file="onSelectFile" />
    <UploadPictureLinks v-model:visible="linksVisible" :file-list="linkFileList" @on-file-url-change="onFileUrlChange" />
  </div>
</template>

<script setup lang="ts">
import type { UploadFile, UploadInstance, UploadRequestOptions, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus, Picture, Share, Check, UploadFilled } from '@element-plus/icons-vue'
import { getPathName } from '~/utils'

interface FileItem {
  name: string
  url: string
}

/**
 * 单图场景绑定 v-model:url，多图场景绑定 v-model:file-list，两者不要同时绑定
 */
const props = withDefaults(defineProps<{
  url?: string
  fileList?: FileItem[]
  accept?: string
  multiple?: boolean
  limit?: number
  draggable?: boolean
}>(), {
  url: '',
  fileList: () => [],
  accept: 'image/*',
  multiple: false,
  limit: 0,
  draggable: false,
})

const emit = defineEmits<{
  (e: 'update:url', url: string): void
  (e: 'update:fileList', list: FileItem[]): void
}>()

const api = useApi()
const uploadRef = ref<UploadInstance | null>(null)
const albumVisible = ref(false)
const linksVisible = ref(false)
const previewVisible = ref(false)
const previewIndex = ref(0)

const innerFileList = ref<UploadUserFile[]>([])

// 首个已上传完成的地址（未点击上传的文件只有本地 blob 地址，不能对外输出）
const uploadedUrl = computed(() => innerFileList.value.find(f => f.url && !f.url.startsWith('blob:'))?.url || '')

function isSameUrls(a: { url?: string }[], b: { url?: string }[]) {
  return a.length === b.length && a.every((item, i) => item.url === b[i]?.url)
}

watch(() => props.fileList, (list) => {
  if (isSameUrls(list, innerFileList.value)) return
  // 拷一份，避免 Element Plus 往父组件的对象上写 uid / status
  innerFileList.value = list.map(item => ({ ...item })) as UploadUserFile[]
}, { immediate: true })

watch(() => props.url, (url, oldUrl) => {
  if (props.multiple) return
  if (url === uploadedUrl.value) return
  // oldUrl 为 undefined 说明是首次执行，此时空 url 可能只是未绑定，不能去清空 fileList
  if (!url && oldUrl === undefined) return
  innerFileList.value = url ? [{ name: getPathName(url).basename, url }] : []
}, { immediate: true })

// url 和 fileList 同时对外抛出，父组件按需绑定
watch(innerFileList, (list) => {
  emit('update:fileList', list as FileItem[])
  if (uploadedUrl.value !== props.url) emit('update:url', uploadedUrl.value)
})

const isDisableUpload = computed(() => {
  if (props.multiple) {
    return props.limit > 0 && innerFileList.value.length >= props.limit
  }
  return innerFileList.value.length > 0
})

const previewSrcList = computed(() => innerFileList.value.map(f => f.url || ''))

const linkFileList = computed<FileItem[]>(() => innerFileList.value.map(f => ({ name: f.name, url: f.url || '' })))

function handleUpload() {
  uploadRef.value?.submit()
}

function beforeUpload(file: File) {
  if (props.accept.startsWith('image/') && !file.type.includes('image')) {
    ElMessage.error('上传的文件只能是图片格式!')
    return false
  }
  return true
}

/**
 * 覆盖默认的上传行为
 * @param {Object} options 文件信息 { file: 文件对象 }
 */
async function handleUploadFile(options: UploadRequestOptions) {
  const file = options.file
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res: any = await api.UploadFiles(formData)
    const [uploaded] = (res?.data || []) as FileItem[]
    if (!uploaded?.url) throw new Error('上传失败')
    // 用服务端地址替换列表中该项的本地预览地址，并置为已完成，避免再次 submit 时重复上传
    innerFileList.value = innerFileList.value.map<UploadUserFile>(item => (
      item.uid === file.uid ? { ...item, ...uploaded, status: 'success', percentage: 100 } : item
    ))
    ElMessage.success('上传成功')
    return res
  } catch (err) {
    ElMessage.error('上传失败')
    throw err
  }
}

function onExceed() {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

function handlePreviewCard(file: UploadFile) {
  const index = previewSrcList.value.indexOf(file.url || '')
  previewIndex.value = index < 0 ? 0 : index
  previewVisible.value = true
}

function onSelectFile(files: FileItem[]) {
  if (!files?.length) return
  innerFileList.value = (props.multiple ? [...innerFileList.value, ...files] : [files[0]!]) as UploadUserFile[]
}

function onFileUrlChange(files: FileItem[]) {
  innerFileList.value = files as UploadUserFile[]
}
</script>

<style lang="scss" scoped>
.upload {
  &-menus {
    padding-bottom: 15px;
  }

  &-drag-icon {
    font-size: 48px;
    color: var(--el-text-color-placeholder);
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

    &-drag {
      :deep(.el-upload--picture-card) {
        display: inline-block;
        width: 360px;
        height: 180px;
        line-height: 1em;
        border: none;
      }
    }
  }
}
</style>
