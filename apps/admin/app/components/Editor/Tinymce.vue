<template>
  <div :class="{ fullscreen: isFullscreen }" class="tinymce-container" :style="{ width: '100%' }">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <PictureAlbum v-model:visible="albumVisible" @on-select-file="onSelectFile" />
  </div>
</template>

<script setup lang="ts">
import dynamicLoadScript from './dynamicLoadScript'
import plugins from './plugins'
import toolbar from './toolbar'
import codesampleLanguages from './codesampleLanguages'
import PictureAlbum from '../Upload/PictureAlbum.vue'

const runtimeConfig = useRuntimeConfig()
const base = runtimeConfig.app.baseURL
const tinymceCDN = `${base}vendor/tinymce/tinymce.min.js`

const props = withDefaults(defineProps<{
  modelValue: string
  id?: string
  height?: number | string
  menubar?: string
}>(), {
  modelValue: '',
  id: () => 'vue-tinymce-' + (+new Date()) + ((Math.random() * 1000).toFixed(0) + ''),
  height: 360,
  menubar: 'file edit insert view format table',
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'onInit'): void
}>()

const tinymceId = ref(props.id)
const isFullscreen = ref(false)
const hasChange = ref(false)
const hasInit = ref(false)
const albumVisible = ref(false)

const api = useApi()

const initOptions = computed(() => ({
  selector: `#${tinymceId.value}`,
  language: 'zh_CN',
  language_url: `${base}vendor/tinymce/langs/zh_CN.js`,
  height: props.height,
  body_class: 'panel-body',
  object_resizing: false,
  plugins,
  toolbar,
  menubar: props.menubar,
  branding: false,
  default_link_target: '_blank',
  codesample_languages: codesampleLanguages,
  end_container_on_empty_block: true,
  powerpaste_word_import: 'clean',
  code_dialog_height: 450,
  code_dialog_width: 1000,
  advlist_bullet_styles: 'square',
  advlist_number_styles: 'default',
  imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
  default_link_protocol: 'https',
  relative_urls: false,
  nonbreaking_force_tab: true,
  fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;',
  images_upload_handler: handleImageUpload,
  file_picker_types: 'image',
  file_picker_callback: handlePickerFile,
  gallery_click_handler: () => {
    albumVisible.value = true
  },
  init_instance_callback: (editor: any) => {
    if (props.modelValue) editor.setContent(props.modelValue)
    hasInit.value = true
    editor.on('NodeChange Change KeyUp SetContent', () => {
      hasChange.value = true
      emit('update:modelValue', editor.getContent())
    })
  },
  setup(editor: any) {
    editor.on('FullscreenStateChanged', (e: any) => {
      isFullscreen.value = e.state
    })
  },
}))

/**
 * 使用自定义函数代替TinyMCE来处理上传操作
 * @param {Object} blobInfo 文件信息
 * @param {Function} success 成功回调
 * @param {Function} failure 失败回调
 */
function handleImageUpload(blobInfo: any, success: (url: string) => void, failure: (err: string) => void) {
  const formData = new FormData()
  formData.append('file', blobInfo.blob())
  api.UploadFiles(formData)
    .then((res: any) => {
      const fileList = res.data
      const { url } = fileList[0] || {}
      success(url)
    })
    .catch((err: any) => {
      failure(err?.message || '上传失败')
    })
}

// 在图片、媒体、链接对话框中加入上传文件功能
function handlePickerFile(callback: (url: string, meta?: any) => void) {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.onchange = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    api.UploadFiles(formData)
      .then((res: any) => {
        const fileList = res.data
        const { url, name } = fileList[0] || {}
        callback(url, { alt: name })
      })
      .catch(() => {})
  }
  input.click()
}

// 图片库选择后插入图片
function onSelectFile(list: { name: string; url: string }[]) {
  const tinymce = (window as any).tinymce
  const editor = tinymce?.get(tinymceId.value)
  if (!editor) return
  list.forEach(v => editor.insertContent(`<img src="${v.url}" >`))
}

// 获取字数统计
function getWordCount(): number {
  const tinymce = (window as any).tinymce
  return tinymce?.get(tinymceId.value)?.plugins?.wordcount?.getCount() || 0
}

defineExpose({
  getWordCount,
})

function initTinymce() {
  const tinymce = (window as any).tinymce
  if (!tinymce) return
  tinymce.init(initOptions.value)
}

function destroyTinymce() {
  const tinymce = (window as any).tinymce
  if (!tinymce) return
  const editor = tinymce.get(tinymceId.value)
  if (isFullscreen.value && editor) editor.execCommand('mceFullScreen')
  if (editor) editor.destroy()
}

watch(() => props.modelValue, (val) => {
  if (!hasChange.value && hasInit.value) {
    nextTick(() => {
      const tinymce = (window as any).tinymce
      tinymce?.get(tinymceId.value)?.setContent(val || '')
    })
  }
  hasChange.value = false
})

onMounted(() => {
  dynamicLoadScript(tinymceCDN, (err) => {
    if (err) {
      console.error(err)
      return
    }
    initTinymce()
  })
})

onBeforeUnmount(() => {
  destroyTinymce()
})

onDeactivated(() => {
  destroyTinymce()
})
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container.fullscreen {
  z-index: 1200;
}

.tinymce-textarea {
  z-index: -1;
  visibility: hidden;
}
</style>
