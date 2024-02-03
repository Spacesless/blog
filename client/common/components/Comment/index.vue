<template>
  <div v-loading="fetchLoading" class="comment tl-card">
    <h2 class="comment-title tl-card__title">
      评论区
      <span class="comment-title__count">({{ total }})</span>
    </h2>
    <comment-reply
      v-if="!replyData.id"
      :form-data.sync="formData"
      :submit-comment="submitComment"
    />
    <div v-if="total === 0" class="comment-none">
      <p class="comment-none__tips">
        还没有评论，快来抢第一吧
      </p>
      <img v-if="isDark" class="comment-none__img" src="@/assets/image/no-data-dark.svg" alt="">
      <img v-else class="comment-none__img" src="@/assets/image/no-data.svg" alt="">
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
import CommentItem from './CommentItem'
import CommentReply from './CommentReply'
import Pagination from '#/components/Pagination/index'
import { getLocalStorage, setLocalStorage, convertToTree } from '#/utils'

export default {
  name: 'CommentIndex',
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
  data () {
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
  computed: {
    isDark () {
      return this.$colorMode.preference === 'dark'
    }
  },
  mounted () {
    this.storageInfo = getLocalStorage('comment')
    this.formData = {
      ...this.storageInfo,
      content: ''
    }
    this.fetchList()
  },
  beforeDestroy () {
    delete this.formData.content
    if (JSON.stringify(this.formData) !== JSON.stringify(this.storageInfo)) {
      setLocalStorage('comment', this.formData)
    }
  },
  methods: {
    // 获取评论列表
    async fetchList () {
      this.listQuery.topic_id = this.topicId
      this.fetchLoading = true
      await this.$axios.$get('/comment', {
        params: this.listQuery
      }).then((res) => {
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
    submitComment (content) {
      const { id, topic_id: topicId, parent_id: parentId, name, type } = this.replyData
      const postData = {
        ...this.formData,
        topic_id: topicId,
        reply_name: name,
        parent_id: parentId || id || 0,
        type: type ? type + 1 : 1,
        topic_url: location.pathname,
        topic_title: document.title,
        content
      }
      return this.$axios.$post('/comment/post', postData).then((res) => {
        this.$notify({
          title: '评论成功',
          message: '收到收到over',
          type: 'success',
          offset: 40
        })
        this.formData.content = ''
        this.replyData.id = 0
        this.fetchList()
      }).catch((error) => {
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
.comment {
  padding: $grid-space;

  &-title {
    &__count {
      font-size: 16px;
      vertical-align: bottom;
    }
  }

  &-list {
    padding: $grid-space 0;
  }

  &-none {
    &__img {
      display: block;
      width: 300px;
      margin: 0 auto;
    }

    &__tips {
      color: var(--color-secondary);
      text-align: center;
    }
  }

  ::v-deep .emojis {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
}
</style>
