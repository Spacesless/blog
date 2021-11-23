<template>
  <div v-loading="fetchLoading" class="comment">
    <h2 class="comment-title">评论<span class="comment-title__count">({{ total }})</span></h2>
    <comment-reply
      v-if="!replyData.id"
      :form-data.sync="formData"
      :submit-comment="submitComment"
    />
    <div v-if="total === 0" class="comment-none">
      <p class="comment-none__tips">还没有评论，快来抢第一吧</p>
      <img class="comment-none__img" src="@/assets/image/no-data.svg" alt="">
    </div>
    <div v-else class="comment-list">
      <comment-item
        v-for="item in commentList"
        :key="item.id"
        :form-data="formData"
        :comment-data="item"
        :reply-data.sync="replyData"
        :submit-comment="submitComment"
      />
      <pagination
        v-if="total > listQuery.pageSize"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchList"
      />
    </div>
  </div>

</template>

<script>
import Pagination from '#/components/Pagination/index'
import CommentItem from './CommentItem'
import CommentReply from './CommentReply'
import { getLocalStorage, setLocalStorage, convertToTree } from '#/utils'

export default {
  components: {
    Pagination,
    CommentItem,
    CommentReply
  },
  props: {
    topicId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {},
      replyData: {
        topic_id: this.topicId
      },
      fetchLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      commentList: []
    }
  },
  mounted() {
    this.storageInfo = getLocalStorage('comment')
    this.formData = {
      ...this.storageInfo,
      content: ''
    }
    this.fetchList()
  },
  beforeDestroy() {
    delete this.formData.content
    if (JSON.stringify(this.formData) !== JSON.stringify(this.storageInfo)) {
      setLocalStorage('comment', this.formData)
    }
  },
  methods: {
    // 获取评论列表
    async fetchList() {
      this.listQuery.topic_id = this.topicId
      this.fetchLoading = true
      this.$axios.$get('/comment', {
        params: this.listQuery
      }).then(res => {
        const { total, data } = res
        this.total = total
        this.commentList = convertToTree(data)
      }).catch(() => {})
      this.fetchLoading = false
    },
    /**
     * 提交评论
     * @param {String} content 评论信息
     */
    submitComment(content) {
      const { id, topic_id, parent_id, name, type } = this.replyData
      const postData = {
        ...this.formData,
        topic_id,
        reply_name: name,
        parent_id: parent_id || id || 0,
        type: type ? type + 1 : 1,
        topic_url: location.pathname,
        topic_title: document.title,
        content
      }
      return this.$axios.$post('/comment/post', postData).then(res => {
        this.$notify({
          title: '评论成功',
          message: '感谢您留下美好的声音',
          type: 'success',
          offset: 40
        })
        this.formData.content = ''
        this.fetchList()
      }).catch(error => {
        this.$notify.error({
          title: '评论失败',
          message: error,
          offset: 50
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment{
  padding: 15px;
  background: var(--bg-normal);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  &-title{
    margin-bottom: 15px;
    color: var(--color-heading);
    font-size: 24px;
    font-weight: normal;
    line-height: 1em;
    &__count{
      margin-left: 5px;
      font-size: 16px;
    }
  }
  &-list{
    padding: 15px 0;
  }
  &-none{
    &__img{
      display: block;
      width: 300px;
      margin: 0 auto;
    }
    &__tips{
      color: var(--color-secondary);
      text-align: center;
    }
  }
  ::v-deep .emojis{
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
}
</style>
