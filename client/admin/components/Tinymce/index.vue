<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <picture-ablum :visible.sync="ablumVisible" @onSelectFile="onSelectFile" />
  </div>
</template>

<script>
import PictureAblum from '@/components/Upload/components/PictureAblum'
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import codesampleLanguages from './codesampleLanguages'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = process.env.NODE_ENV === 'production'
  ? '/nuxt-admin/vendor/tinymce/tinymce.min.js'
  : '/vendor/tinymce/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: {
    PictureAblum
  },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit view insert format table tools'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      ablumVisible: false
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: 'zh_CN',
        height: this.height,
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 650,
        code_dialog_width: 1200,
        codesample_languages: codesampleLanguages,
        default_link_target: '_blank',
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;',
        init_instance_callback: editor => {
          if (this.value) {
            editor.setContent(this.value)
          }
          this.hasInit = true
          editor.on('Change KeyUp SetContent', (e) => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        relative_urls: false,
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            this.fullscreen = e.state
          })
        },
        file_picker_types: 'image',
        file_picker_callback: (...arg) => this.handlerPickerFile(...arg),
        images_upload_handler: (...arg) => this.uploadImages(...arg),
        gallery_click_handler: () => {
          this.ablumVisible = true
        }
      })
    },
    /**
     * 在图片、媒体、链接对话框中加入上传文件功能
     * @param {Function} callback 上传成功后执行的回调函数
     * @param {*} value 当前受影响的字段值
     * @param {Object} meta 包含指定对话框中其它字段值的对象
     */
    handlerPickerFile(callback, value, meta) {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')

      /*
        Note: In modern browsers input[type="file"] is functional without
        even adding it to the DOM, but that might not be the case in some older
        or quirky browsers like IE, so you might want to add it to the DOM
        just in case, and visually hide it. And do not forget do remove it
        once you do not need it anymore.
      */

      input.onchange = e => {
        const file = e.target.files[0]
        if (!file) return
        const formData = new FormData()
        formData.append('file', file)
        this.$api.common.UploadFiles(formData).then(res => {
          const fileList = res.data
          const { url, name } = fileList[0] || {}
          callback(url, { alt: name })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '图片上传失败.'
          })
        })
      }
      input.click()
    },
    /**
     * 使用自定义函数代替TinyMCE来处理上传操作
     * @param {Object} blobInfo 文件信息
     * @param {Function} success 成功回调
     * @param {Function} failure 失败回调
     */
    uploadImages(blobInfo, success, failure) {
      const formData = new FormData()
      formData.append('file', blobInfo.blob())
      this.$api.common.UploadFiles(formData).then(res => {
        const fileList = res.data
        const { url } = fileList[0] || {}
        success(url)
      }).catch(() => {
        failure('图片上传失败.')
      })
    },
    onSelectFile(arr) {
      arr.forEach(v => this.insertContent(`<img src="${v.url}" width="${v.width || ''}" height="${v.height || ''}" >`))
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    insertContent(value) {
      window.tinymce.get(this.tinymceId).insertContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    getWordCount() {
      return window.tinymce.get(this.tinymceId).plugins.wordcount.getCount()
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
