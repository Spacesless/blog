<template>
  <div class="form-para">
    <el-form-item label="图片尺寸">
      <el-row>
        <el-col :xs="12" :md="5" :lg="3">
          <el-input v-model="formData.imgwidth" placeholder="宽（像素）" />
        </el-col>
        <el-col :xs="2" :md="1" :lg="1" class="text-center">
          <span class="el-icon-close" />
        </el-col>
        <el-col :xs="12" :md="5" :lg="3">
          <el-input v-model="formData.imgheight" placeholder="高（像素）" />
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    formData() {
      return Object.assign({
        imgwidth: '',
        imgheight: ''
      }, this.options)
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
