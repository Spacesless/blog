<template>
  <div v-loading="fetchLoading" class="app-container comment">
    <el-form ref="form" label-width="100px">
      <el-form-item label="所属页面">
        <el-link :underline="false" :href="formData.page_url" target="_blank">{{ formData.page_name }}</el-link>
      </el-form-item>
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
        :form-data.sync="replyData"
        :submit-comment="submitComment"
        :is-admin="true"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      replyData: {},
      replyContent: '',
      fetchLoading: false
    }
  },
  computed: {
    ...mapGetters(['userinfo']),
    topicId() {
      return this.$route.params?.id
    }
  },
  created() {
    this.fetchData()

    const { nickname, email } = this.userinfo
    this.replyData = {
      name: nickname,
      website: 'https://www.timelessq.com',
      content: '',
      email
    }
  },
  methods: {
    async fetchData() {
      this.fetchLoading = true
      await this.$api.content.GetContent('comment', this.topicId).then(res => {
        this.formData = res.data
      }).catch(() => {})
      this.fetchLoading = false
    },
    /**
     * 提交评论
     * @param {String} content 评论信息
     */
    submitComment(content) {
      const { id, parent_id, topic_id, type, name } = this.formData
      const postData = {
        ...this.replyData,
        topic_id,
        reply_name: name,
        parent_id: parent_id || id,
        type: type ? type + 1 : 1,
        content
      }
      return this.$api.content.CreateContent('comment', postData).then(res => {
        this.$message({
          type: 'success',
          message: '回复评论成功'
        })
        this.$store.dispatch('tagsView/delView', this.$route)
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '回复评论失败'
        })
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
