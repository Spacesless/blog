<template>
  <div v-loading="fetchLoading" class="comment">
    <h2 class="app-main__title">评论<span class="comment__count">({{ total }})</span></h2>
    <comment-reply v-if="!replyData.id" :info="info" :reply-data="replyData" />
    <div v-if="total === 0" class="comment-none">
      <p class="comment-none__tips">还没有评论，快来抢第一吧</p>
      <img class="comment-none__img" src="@/assets/image/no-data.svg" alt="">
    </div>
    <div v-else class="comment-list">
      <comment-item
        v-for="item in commentsList"
        :key="item.id"
        :info="info"
        :data="item"
        :reply-data="replyData"
      />
      <pagination v-if="total > listQuery.pageSize" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
    </div>
  </div>

</template>

<script>
import Pagination from '@/components/Pagination/index'
import CommentItem from './components/CommentItem'
import CommentReply from './components/CommentReply'

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
      info: {},
      replyData: {
        topic_id: this.topicId
      },
      isTreeRoot: true,
      fetchLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      commentsList: []
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listQuery.topic_id = this.topicId
      this.fetchLoading = true
      this.$axios.$get('/comment', {
        params: this.listQuery
      }).then(res => {
        const { total, data } = res
        this.total = total
        this.commentsList = data
      }).catch(() => {})
      this.fetchLoading = false
    },
    /**
     * 更新要回复的评论数据
     * @param {Object} data
     */
    updateReplyData(data) {
      this.replyData = data
    },
    // 重置要回复的评论数据
    resetReplyData() {
      this.replyData = {
        topic_id: this.topicId
      }
    },
    resetInfo() {
      this.info.content = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.comment{
  &__count{
    margin-left: 5px;
    font-size: 16px;
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
}

.el-dialog__body{
  padding: 10px 20px;
}
</style>
