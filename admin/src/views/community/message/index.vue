<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 142}"
      v-loading="listLoading"
      :data="messageList"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="留言内容">
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="留言类型" width="150" align="center">
        <template #default="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.is_read" type="success">已查看</el-tag>
          <el-tag v-else type="info">未查看</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="留言时间" width="200">
        <template #default="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" @click="handleView(scope.row.id)">查看</el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="app-footer-menu">
      <el-row>
        <el-col :xs="24" class="text-right">
          <el-button type="danger" icon="el-icon-delete" @click="handleDeleteSelection">删除选中</el-button>
        </el-col>
      </el-row>
    </div>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable } from '@/mixins'
import { GetList, DeleteList } from '@/api/list'

export default {
  name: 'Message',
  components: { Pagination },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable],
  data() {
    return {
      messageList: []
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetList('message', this.listQuery).then(res => {
        const { data, count } = res.data
        this.messageList = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    },
    handleView(id) {
      this.$router.push({ name: 'MessageDetail', params: { id: id }})
    },
    deleteSingle(id) {
      DeleteList('message', [id]).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.calcCurrentPage(1)
        this.fetchList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      })
    },
    deleteSelection(listCount) {
      const lists = this.multipleSelection.map(item => {
        return item.id
      })
      DeleteList('message', lists).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.calcCurrentPage(listCount)
        this.fetchList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      })
    }
  }
}
</script>
