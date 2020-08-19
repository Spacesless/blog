<template>
  <div class="comment">
    <!-- <h3 class="app-main__title">评论（{{ total }}）</h3> -->
    <!-- <comment-reply :info="info" />
    <div v-loading="fetchLoading" class="comment-list">
      <div v-for="item in commentsList" :key="item.id" class="comment-main">
        <comment-item :info="info" :data="item" :is-reply="isReply" @onreply="handleReply" />
      </div>
    </div>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" /> -->
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination/index'
// import CommentItem from './components/CommentItem'
// import CommentReply from './components/CommentReply'

export default {
  components: {
    // Pagination,
    // CommentItem,
    // CommentReply
  },
  data() {
    return {
      isReply: 0,
      info: {},
      fetchLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      comments: []
    }
  },
  computed: {
    commentsList() {
      return this.convertToTree(this.comments)
    }
  },
  mounted() {
    this.info = {
      page_id: '3-5'
    }
  },
  methods: {
    fetchList() {

    },
    convertToTree(data, parent_id = 0) {
      const tree = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].parent_id === parent_id) {
          const obj = data[i]
          temp = this.convertToTree(data, data[i].id)
          if (temp.length > 0) {
            obj.children = temp
          }
          tree.push(obj)
        }
      }
      return tree
    },
    handleReply(id) {
      this.isReply = id
    }
  }
}
</script>

<style lang="scss">
.comment{
  &-list{
    padding: 15px 0;
  }
  &-tree{
    padding-left: 50px;
  }
  &-main{
    padding: 10px 0;
    border-bottom: 1px solid #e6e6e6;
  }
  &-item{
    padding: 5px 0;
    .comment-reply{
      margin: 10px 0;
    }
  }
  &-avatar{
    overflow: hidden;
    float: left;
    width: 50px;
    height: 50px;
    margin-right: 15px;
    border-radius: 50%;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  &-oparate{
    color: #909399;
    font-size: 14px;
  }
}

.el-dialog__body{
  padding: 10px 20px;
}
</style>
