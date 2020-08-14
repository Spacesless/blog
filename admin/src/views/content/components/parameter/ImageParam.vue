<template>
  <div class="form-para">
    <el-form-item label="图片宽度">
      <el-input v-model.number="params.imgwidth" class="form-container-input" placeholder="宽（像素）" />
    </el-form-item>
    <el-form-item label="图片高度">
      <el-input v-model.number="params.imgheight" class="form-container-input" placeholder="高（像素）" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    fileList(data) {
      const [file] = data
      if (file) {
        const tempImage = new Image()
        tempImage.onload = () => {
          this.$emit('update:params', {
            ...this.params, ...{ imgwidth: tempImage.width, imgheight: tempImage.height }
          })
        }
        tempImage.src = file.src
      }
    }
  }
}
</script>
