<template>
  <div :class="{ fullscreen: isFullscreen }" class="tinymce-container" :style="{ width: '100%' }">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script setup lang="ts">
import dynamicLoadScript from './dynamicLoadScript'
import plugins from './plugins'
import toolbar from './toolbar'
import codesampleLanguages from './codesampleLanguages'

const tinymceCDN = '/vendor/tinymce/tinymce.min.js'

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

const api = useApi()
const route = useRoute()

const initOptions = computed(() => ({
  selector: `#${tinymceId.value}`,
  language: 'zh_CN',
  language_url: '/vendor/tinymce/zh_CN.js',
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
  images_upload_handler: handleImageUpload,
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

function handleImageUpload(blobInfo: any, success: (url: string) => void, failure: (err: string) => void) {
  const formData = new FormData()
  formData.append('file', blobInfo.blob(), blobInfo.filename())
  formData.append('module', (route.meta as any)?.upload || 'tinymce')
  api.UploadFiles(formData)
    .then((res: any) => {
      success(res.data?.url || res.data)
    })
    .catch((err: any) => {
      failure(err?.message || '上传失败')
    })
}

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
  z-index: 10000;
}

.tinymce-textarea {
  z-index: -1;
  visibility: hidden;
}
</style>
