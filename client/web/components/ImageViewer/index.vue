<template>
  <el-image ref="preview" class="app-preview" :src="previewSrc" :preview-src-list="previewSrcList" />
</template>

<script>
export default {
  data() {
    return {
      previewSrc: '',
      previewSrcList: []
    }
  },
  mounted() {
    this.initViewer()
  },
  methods: {
    initViewer() {
      const previews = document.querySelectorAll('.Tinymce img')
      this.previewSrcList = Array.from(previews).map(item => item.src)
      previews.forEach(item => {
        item.addEventListener('click', e => {
          this.handlePreview(e.target.src)
        })
      })
    },
    /**
     * 预览图片
     * @param {String} src 图片地址
     */
    handlePreview(src) {
      if (!src) {
        return
      }
      this.previewSrc = src
      this.$refs.preview?.clickHandler()
    }
  }
}
</script>
