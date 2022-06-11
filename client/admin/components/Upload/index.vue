<template>
  <div class="upload">
    <el-button-group class="upload-menus">
      <el-button type="primary" icon="el-icon-check" @click="handleUpload" />
      <el-button type="primary" icon="el-icon-picture-outline" @click="ablumVisible = true" />
      <el-button type="primary" icon="el-icon-share" @click="linksVisible = true" />
    </el-button-group>

    <el-upload
      ref="upload"
      class="upload-file"
      :class="{'upload-file-drag': draggable,'upload-file--disable': isDisableUpload}"
      list-type="picture-card"
      action=""
      accept="image/*"
      :multiple="multiple"
      :drag="draggable"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :http-request="handleUploadFile"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="handlePreviewCard"
      :auto-upload="false"
    >
      <template v-if="draggable">
        <span class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </template>
      <template v-else>
        <span class="el-icon-plus" />
      </template>
    </el-upload>

    <el-image ref="preview" class="app-preview" :src="previewSrc" :preview-src-list="previewSrcList" :z-index="3000" />
    <!-- 图片库 -->
    <picture-ablum :visible.sync="ablumVisible" @onSelectFile="onSelectFile" />
    <!-- 网络图片 -->
    <picture-links :visible.sync="linksVisible" :file-list="fileList" @onFileUrlChange="onFileUrlChange" />
  </div>
</template>

<script>
import PictureAblum from './components/PictureAblum'
import PictureLinks from './components/PictureLinks'

export default {
  name: 'UploadImage',
  components: {
    PictureAblum,
    PictureLinks
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      ablumVisible: false,
      linksVisible: false,
      previewSrc: '',
      previewSrcList: []
    }
  },
  computed: {
    isDisableUpload () {
      if (this.multiple) {
        return false
      } else {
        return this.fileList.length > 0
      }
    }
  },
  methods: {
    handleUpload () {
      this.$refs.upload.submit()
    },
    beforeUpload (file) {
      const isImage = file.type.includes('image')
      if (!isImage) { this.$message.error('上传的文件只能是图片格式!') }
    },
    handlePreviewCard (file) {
      const previewImage = file.url
      this.previewSrc = previewImage
      this.previewSrcList = [previewImage]

      this.$nextTick(() => {
        this.$refs.preview && this.$refs.preview.clickHandler()
      })
    },
    onChange (file, fileList) {
      this.$emit('update:fileList', fileList)
    },
    /**
     * 删除list-card里面的图片
     */
    onRemove (file, fileList) {
      const result = fileList.map((item) => {
        const data = item.response ? item.response.data : item
        const { name, url } = data
        return { name, url }
      })
      this.$emit('update:fileList', result)
    },
    /**
     * 覆盖默认的上传行为
     * @param {Object} param 文件信息 { file: 文件对象 }
     */
    handleUploadFile (param) {
      const files = param.file
      const formData = new FormData()
      formData.append('file', files)
      this.$api.common.UploadFiles(formData).then((res) => {
        const fileList = res.data
        this.$emit('update:fileList', fileList)
      })
    },
    onSelectFile (files) {
      const result = [...this.fileList, ...files]
      this.$emit('update:fileList', result)
    },
    onFileUrlChange (files) {
      this.$emit('update:fileList', files)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  &-menus {
    padding-bottom: 15px;
  }

  &-file {
    ::v-deep .el-upload--picture-card {
      width: 180px;
      height: 180px;
      line-height: 180px;
    }

    ::v-deep .el-upload-list--picture-card {
      .el-upload-list__item {
        width: 180px;
        height: 180px;

        &-thumbnail {
          object-fit: contain;
        }
      }
    }

    &--disable {
      ::v-deep .el-upload--picture-card {
        display: none;
      }
    }

    &-drag {
      ::v-deep .el-upload {
        &--picture-card {
          display: inline-block;
          width: 360px;
          height: 180px;
          line-height: 1em;
          border: none;
        }
      }
    }
  }
}
</style>
