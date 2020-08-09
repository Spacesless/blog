<template>
  <div v-loading="fetchLoading" class="app-container comment">
    <div class="comment-list">
      1
    </div>
    <div class="">
      <Tinymce ref="editor" v-model="replyContent" :height="500" />
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { GetContent, CreateContent } from '@/api/content'

export default {
  name: 'CommentContent',
  components: {
    Tinymce
  },
  data() {
    return {
      commentList: [],
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
      await GetContent('comment', id).then(res => {
        this.commentList = res.data
      }).catch(() => {})
      this.fetchLoading = false
    },
    handleReplyComment() {
      CreateContent('comment', this.formData).then(res => {
        this.fetchData()
      })
    }
  }
}
</script>
