<template>
  <div class="app-container">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-button type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="handleDeleteSelection">删除</el-button>
        <el-dropdown @command="handleChangeStatus">
          <el-button type="warning" plain :loading="changeLoading">
            状态修改<span class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="show">通过</el-dropdown-item>
            <el-dropdown-item command="hide">待审核</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :xs="24" :sm="12" class="text-right">
        <el-input v-model="listQuery.keyword" placeholder="请输入评论内容" clearable @change="onKeywordInput" />
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 90}"
      v-loading="listLoading"
      :data="tableData"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="ID" prop="id" width="65" align="center" />
      <el-table-column label="Reply" prop="parent_id" width="65" align="center" />
      <el-table-column label="评论内容" show-overflow-tooltip>
        <template #default="scope">
          {{ `${scope.row.type === 3 ? '@' + scope.row.reply_name : ''} ${scope.row.content}` }}
        </template>
      </el-table-column>
      <el-table-column label="评论人" prop="name" width="150" align="center" />
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">已通过</el-tag>
          <el-tag v-else type="info">待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间" width="200">
        <template #default="scope">{{ scope.row.addtime }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" @click="handleView(scope.row.id)">查看</el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import Pagination from '#/components/Pagination'
import elHeightAdaptiveTable from '@/directive/el-table'
import { crud } from '@/mixins'

export default {
  name: 'Comment',
  components: { Pagination },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [crud],
  data() {
    return {
      currentType: 'comment',
      changeLoading: false
    }
  },
  methods: {
    handleView(id) {
      this.$router.push({
        name: 'CommentContent',
        params: { id: id }
      })
    },
    handleChangeStatus(command) {
      const listCount = this.multipleSelection.length
      if (!listCount) {
        return this.$message('请先选择数据，再进行操作')
      }
      this.$confirm(`确定要更新${listCount}条内容?`, '提示', {
        type: 'warning'
      }).then(async() => {
        const passData = this.multipleSelection.map(item => {
          const { id } = item
          return { id, is_show: command === 'hide' ? 0 : 1 }
        })
        this.changeLoading = true
        await this.$api.list.UpdateList(this.currentType, passData).then(res => {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.fetchList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '更新失败'
          })
        })
        this.changeLoading = false
      })
    }
  }
}
</script>
