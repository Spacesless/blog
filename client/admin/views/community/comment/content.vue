<template>
  <div v-loading="fetchLoading" class="app-container comment">
    <el-form ref="form" label-width="100px">
      <el-form-item label="昵称">
        <el-input v-model="formData.name" readonly />
      </el-form-item>
      <el-form-item label="IP地址">
        <el-input v-model="formData.ip" readonly />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formData.email" readonly />
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="formData.addtime" type="datetime" readonly />
      </el-form-item>
      <el-form-item v-if="formData.replyData" label="回复内容">
        <div class="comment-preview" v-html="formData.replyData.content" />
        <router-link :to="'/comment/' + formData.parent_id">查看评论</router-link>
      </el-form-item>
      <el-form-item label="评论内容">
        <div class="comment-preview" v-html="formData.content" />
      </el-form-item>
    </el-form>
    <div class="comment-reply">
      <comment-reply
        :form-data.sync="formData"
        :submit-comment="submitComment"
      />
    </div>
  </div>
</template>

<script>
import CommentReply from '#/components/Comment/CommentReply'

export default {
  name: 'CommentContent',
  components: {
    CommentReply
  },
  data() {
    return {
      formData: {
        content: ''
      },
      replyData: {
        topic_id: this.topicId
      },
      replyContent: '',
      fetchLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.fetchLoading = true
      const { id } = this.$route.params
      await this.$api.content.GetContent('comment', id).then(res => {
        this.formData = res.data
      }).catch(() => {})
      this.fetchLoading = false
    },
    /**
     * 提交评论
     * @param {String} content 评论信息
     */
    submitComment(content) {
      const postData = {
        content
      }
      this.$api.content.CreateContent('comment', postData).then(res => {
        this.fetchData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment{
  &-preview{
    white-space: pre-line;
    line-height: 1.5;
    ::v-deep .emojis{
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }
  }
}
</style>
