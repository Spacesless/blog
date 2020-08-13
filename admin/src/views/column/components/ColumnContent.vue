<template>
  <div class="app-container">
    <el-form
      ref="postForm"
      v-loading="fetchLoading"
      :model="form"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item class="form-title">
        基本信息
      </el-form-item>
      <el-form-item label="栏目名称">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.name" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="同级栏目排序">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.no_order" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">数值越小越靠前</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="导航栏显示">
        <el-radio-group v-model="formData.is_nav">
          <el-radio :label="1">不显示</el-radio>
          <el-radio :label="2">显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="列表排序">
        <el-select v-model="formData.list_order" placeholder="请选择">
          <el-option label="更新时间" value="1" />
          <el-option label="发布时间" value="2" />
          <el-option label="点击次数" value="3" />
          <el-option label="ID倒序" value="4" />
          <el-option label="ID顺序" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="前台显示">
        <el-radio-group v-model="formData.is_show">
          <el-radio :label="0">不显示</el-radio>
          <el-radio :label="1">显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="form-title">
        SEO信息
      </el-form-item>
      <el-form-item label="栏目标题">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.title" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">为空则使用SEO参数设置中设置的title构成方式</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="关键词">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.keywords" type="textarea" :rows="3" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">多个关键词请用"|"隔开</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="简短描述">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.description" type="textarea" :rows="5" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">描述一般不超过120个字</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="form-title">
        其它设置
      </el-form-item>
      <el-form-item label="栏目修饰名称">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.mark_name" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="栏目图标">
        <el-input v-model="formData.icon" />
      </el-form-item>
      <el-form-item label="栏目内容">
        <Tinymce ref="editor" v-model="formData.content" :height="350" />
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" plain @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { GetContent, CreateContent, UpdateContent } from '@/api/content'

export default {
  components: {
    Tinymce
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        is_show: 1,
        is_nav: 1,
        list_order: 1
      },
      fetchLoading: false,
      confirmLoading: false
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
      this.formData.id = id
    }
  },
  methods: {
    async fetchData(id) {
      this.fetchLoading = true
      await GetContent('column', id).then(response => {
        const { data } = response
        this.formData = data
      }).catch(() => {})
      this.fetchLoading = false
    },
    handleSubmit() {
      this.$refs.postformData.validate(async(valid) => {
        if (valid) {
          this.confirmLoading = true
          if (this.isEdit) {
            await UpdateContent('column', this.formData).then(res => {
              this.$message({
                type: 'success',
                message: '更新栏目成功'
              })
              this.handleCancel(true)
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '更新栏目失败'
              })
            })
          } else {
            await CreateContent('column', this.formData).then(res => {
              this.$message({
                type: 'success',
                message: '发布栏目成功'
              })
              this.handleCancel(true)
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '发布栏目失败'
              })
            })
          }
          this.confirmLoading = false
        }
      })
    },
    /**
     * 返回列表页
     * @param {Boolean} 是否刷新列表页
     */
    handleCancel(isRefresh = false) {
      const { path } = this.$route
      this.$store.dispatch('tagsView/delView', { path }).then(() => {
        this.$router.push({ name: '', query: { isRefresh }})
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container{
  border: 1px solid #EBEEF5;
  .el-form-item{
    padding: 20px;
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 0;
  }
  .form-title{
    padding: 5px 20px;
    color: #409EFF;
    ::v-deep .el-form-item__content{
      margin-left: 0 !important;
    }
  }
}
.avatar-uploader{
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
  }
  &-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
}
</style>
