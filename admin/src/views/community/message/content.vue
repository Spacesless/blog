<template>
  <div v-loading="fetchLoading" class="app-container message">
    <el-form ref="form" :disabled="true">
      <el-form-item>
        <el-input v-model="messageData.a" />
      </el-form-item>
    </el-form>
    <div class="message-reply">
      <el-input v-model="replyContent" />
    </div>
  </div>
</template>

<script>
import { GetContent, CreateContent } from '@/api/content'

export default {
  data() {
    return {
      messageData: {},
      fetchLoading: false,
      replyContent: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.fetchLoading = true
      const { id } = this.$route.params
      await GetContent('message', id).then(res => {
        this.messageData = res.data
      }).catch(() => {})
      this.fetchLoading = false
    },
    handleReplyComment() {
      CreateContent('message', this.formData).then(res => {

      })
    }
  }
}
</script>
