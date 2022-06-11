<template>
  <el-card class="comment">
    <div slot="header">
      新的留言
    </div>
    <el-table
      v-loading="listLoading"
      height="375"
      :data="commentList"
    >
      <el-table-column label="评论内容" prop="content" show-overflow-tooltip />
      <el-table-column align="center" label="发布时间" width="200">
        <template #default="scope">
          {{ scope.row.addtime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" @click="handleView(scope.row.id)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      commentList: [],
      listLoading: false
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    async fetchList () {
      this.listLoading = true
      await this.$api.home.GetNewComments().then((res) => {
        this.commentList = res.data.data
      }).catch(() => {})
      this.listLoading = false
    },
    handleView (id) {
      this.$router.push({
        name: 'CommentContent',
        params: { id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  ::v-deep .el-card__body {
    padding: 0;
  }
}
</style>
