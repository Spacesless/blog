<template>
  <div class="form-para">
    <el-form-item label="副标题">
      <el-row>
        <el-col :xs="24" :md="12" :lg="5">
          <el-input v-model="options.subtitle" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="typing">
      <el-row>
        <el-col :xs="24" :md="12">
          <el-input v-model="options.typing" type="textarea" placeholder="‘ 、 ’ 分隔开" :rows="3" />
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
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
