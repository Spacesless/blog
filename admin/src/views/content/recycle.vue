<template>
  <div class="app-container">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-select v-model="listQuery.type" clearable placeholder="请选择模块" @change="handleSelect">
          <el-option label="文章模块" value="blog" />
          <el-option label="追番模块" value="bangumi" />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="12" class="text-right">
        <el-button type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="handleDeleteSelection">删除</el-button>
        <el-button type="success" icon="el-icon-refresh-right" :loading="restoreLoading" @click="handleRestoreSelection">还原</el-button>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 80}"
      v-loading="listLoading"
      :data="recycleList"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="标题" prop="title" />
      <el-table-column label="所属栏目" width="200" align="center">
        <template #default="scope">
          <span>{{ getClassName(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="删除时间" width="200">
        <template #default="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updatetime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" :loading="scope.row.restoreLoading" @click="handleRestore(scope.row)">还原</el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable } from '@/mixins'
import { GetRecycleList, RestoreRecycleList, DeleteRecyleList } from '@/api/list'

export default {
  name: 'Recycle',
  components: { Pagination },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable],
  data() {
    return {
      recycleList: [],
      restoreLoading: false
    }
  },
  computed: {
    ...mapGetters(['columns'])
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetRecycleList(this.listQuery).then(res => {
        const { count, data } = res.data
        this.recycleList = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    },
    getClassName(row) {
      const { class1, class2, class3 } = row
      const id = class2 ? (class3 || class2) : class1
      const findColumn = this.columns.find(item => item.id === id)
      return findColumn ? findColumn.name : ''
    },
    handleSelect() {
      this.listQuery.page = 1
      this.fetchList()
    },
    handleRestore(row) {
      const { id, type } = row
      this.$confirm('确定要还原该内容?', '提示', {
        type: 'success'
      }).then(async() => {
        this.$set(row, 'restoreLoading', true)
        await RestoreRecycleList([{ id, type }]).then(response => {
          this.$message({
            type: 'success',
            message: '还原成功'
          })
          this.calcCurrentPage(1)
          this.fetchList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '还原失败'
          })
        })
        this.$set(row, 'restoreLoading', false)
      })
    },
    deleteSingle(row) {
      const { id, type } = row
      return DeleteRecyleList([{ id, type }]).then(res => {
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
        const { id, type } = item
        return { id, type }
      })
      return DeleteRecyleList(lists).then(res => {
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
    },
    handleRestoreSelection() {
      const listCount = this.multipleSelection.length
      this.$confirm(`此操作将还原这${listCount}条内容, 是否继续?`, '提示', {
        type: 'warning'
      }).then(async() => {
        const list = this.multipleSelection.map(item => {
          const { id, type } = item
          return { id, type }
        })
        this.restoreLoading = true
        await RestoreRecycleList(list).then(response => {
          this.$message({
            type: 'success',
            message: '还原成功'
          })
          this.calcCurrentPage(listCount)
          this.fetchList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '还原失败'
          })
        })
        this.restoreLoading = false
      })
    }
  }
}
</script>
