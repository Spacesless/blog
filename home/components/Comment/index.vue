<template>
  <div v-loading="fetchLoading" class="comment">
    <comment-reply :info="info" />
    <div class="comment-list">
      <comment-item
        v-for="item in commentsList"
        :key="item.id"
        :info="info"
        :data="item"
        :reply-id.sync="replyId"
      />
    </div>
    <pagination v-show="total > listQuery.pageSize" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
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
      replyId: 0,
      info: {},
      fetchLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      commentsList: [{
        id: 1,
        nickname: '测试',
        email: '804093032@qq.com',
        content: '测试',
        webSite: '/',
        addTime: '2020-11-16 10:00:00',
        children: [{
          id: 1,
          nickname: '子节点',
          email: '18878554196@163.com',
          content: '测试',
          webSite: '/',
          addTime: '2020-11-16 15:00:00'
        }]
      }]
    }
  },
  mounted() {
    // this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listQuery.id = this.topicId
      this.fetchLoading = true
      this.$axios.$get('/comment', {
        params: this.listQuery
      }).then(res => {
        const { total, data } = res
        this.total = total
        this.commentsList = data
      }).catch(() => {})
      this.fetchLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.comment{
  &-list{
    padding: 15px 0;
  }
}

.el-dialog__body{
  padding: 10px 20px;
}
</style>
