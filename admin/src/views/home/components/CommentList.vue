<template>
  <el-card>
    <div slot="header">新的留言</div>
    <el-table
      v-loading="listLoading"
      :data="commentList"
    >
      <el-table-column label="评论内容" prop="content" show-overflow-tooltip />
      <el-table-column align="center" label="发布时间" width="200">
        <template #default="scope">{{ scope.row.addtime }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" @click="handleView(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      commentList: [],
      listLoading: false
    }
  },
  methods: {
    fetchList() {

    },
    handleView() {

    }
  }
}
</script>
