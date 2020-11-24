<template>
  <el-form ref="form" class="reply" :model="info" :rules="rules">
    <el-row :gutter="10">
      <el-col :sm="24" :md="8">
        <el-form-item prop="name">
          <el-input v-model="info.name" placeholder="Name" clearable />
        </el-form-item>
      </el-col>
      <el-col :sm="24" :md="8">
        <el-form-item prop="email">
          <el-input v-model="info.email" placeholder="Email" clearable />
        </el-form-item>
      </el-col>
      <el-col :sm="24" :md="8">
        <el-form-item prop="website">
          <el-input v-model="info.website" placeholder="Website" clearable />
        </el-form-item>
      </el-col>
      <el-col class="reply-content" :span="24">
        <el-form-item prop="content">
          <el-input ref="textarea" v-model="info.content" class="reply-content-input" type="textarea" :rows="5" resize="none" placeholder="What do you want to say..." />
          <span class="reply-content__submit" @click="handleSubmit">
            <i class="el-icon-position" />
          </span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'CommentReply',
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    parentid: {
      type: Number,
      default: 0
    }
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value === '804093032@qq.com') {
        callback(new Error('请不要拿站长的破邮箱来充数哦'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [{ required: true, trigger: 'blur', message: '你还没告诉我你叫什么呢' }],
        email: [
          { required: true, message: '要不留个邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'change' },
          { trigger: 'change', validator: validateEmail }
        ],
        website: [{ type: 'url', message: '噫，这个网址好像不对哦', trigger: 'change' }],
        content: [{ required: true, trigger: 'blur', message: '确定不说点什么?' }]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        const postData = Object.assign(this.info, {
          parent_id: this.parentid
        })
        this.$axios.$post('/comment/post', postData).then(response => {

        }).catch(error => {
          console.log(error)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.reply{
  &-content{
    ::v-deep .el-textarea__inner{
      padding-right: 66px;
      font-family: Quicksand,"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
    &__submit{
      position: absolute;
      right: 15px;
      top: 50%;
      width: 36px;
      height: 36px;
      margin-top: -18px;
      background-color: #409EFF;
      color: #fff;
      font-size: 18px;
      line-height: 36px;
      text-align: center;
      border-radius: 50%;
      cursor: pointer;
      .el-icon-position{
        transition: transform .3s;
      }
      &:hover{
        .el-icon-position{
          transform: rotate(45deg);
        }
      }
    }
  }
}
</style>
