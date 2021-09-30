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
          <el-input
            ref="textarea"
            v-model="info.content"
            class="reply-content-input"
            type="textarea"
            :rows="5"
            resize="none"
            placeholder="What do you want to say..."
          />
          <el-button class="reply-content__submit" type="primary" icon="el-icon-position" :loading="submitLoading" @click="handleSubmit" />
        </el-form-item>
      </el-col>
      <el-col class="reply-toolbar" :span="24">
        <Emojis />
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Emojis from './Emojis'

export default {
  name: 'CommentReply',
  components: {
    Emojis
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    replyData: {
      type: Object,
      default: () => {}
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
      tree: null,
      submitLoading: false,
      rules: {
        name: [{ required: true, trigger: 'blur', message: '你还没告诉我你叫什么呢' }],
        email: [
          { required: true, message: '要不留个邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: ['change', 'blur'] },
          { trigger: 'change', validator: validateEmail }
        ],
        website: [{ type: 'url', message: '噫，这个网址好像不对哦', trigger: 'change' }],
        content: [{ required: true, trigger: 'blur', message: '确定不说点什么?' }]
      }
    }
  },
  mounted() {
    let parent = this.$parent
    while (parent && !parent.isTreeRoot) {
      parent = parent.$parent
    }
    this.tree = parent
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        const { id, topic_id, parent_id, name, type } = this.replyData
        const postData = Object.assign(this.info, {
          topic_id,
          reply_name: name,
          parent_id: parent_id || id || 0,
          type: type ? type + 1 : 1
        })
        this.submitLoading = true
        await this.$axios.$post('/comment/post', postData).then(res => {
          this.$notify({
            title: '评论成功',
            message: '感谢您留下美好的声音',
            type: 'success',
            offset: 50
          })
          this.tree.resetInfo()
          this.tree.fetchList()
        }).catch(error => {
          this.$notify.error({
            title: '评论失败',
            message: error,
            offset: 50
          })
        })
        this.submitLoading = false
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
      padding: 0;
      font-size: 18px;
      line-height: 36px;
      text-align: center;
      border-radius: 50%;
      cursor: pointer;
      ::v-deep .el-icon-position{
        transition: transform .3s;
      }
      &:hover{
        ::v-deep .el-icon-position{
          transform: rotate(45deg);
        }
      }
    }
  }
}
</style>
