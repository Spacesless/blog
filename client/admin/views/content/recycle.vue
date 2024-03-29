<template>
  <div class="app-container">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-button type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="handleDeleteSelection">
          删除
        </el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh-right"
          :loading="restoreLoading"
          @click="handleRestoreSelection"
        >
          还原
        </el-button>
      </el-col>
      <el-col :xs="24" :sm="12" class="text-right">
        <el-select v-model="listQuery.type" placeholder="请选择模块" @change="handleSearch">
          <el-option label="文章模块" value="article" />
          <el-option label="追番模块" value="bangumi" />
        </el-select>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 83}"
      v-loading="listLoading"
      :data="recycleList"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column label="标题" prop="title" />
      <el-table-column align="center" label="所属栏目" prop="type" width="160" :formatter="formatCategory" />
      <el-table-column align="center" label="所属模块" prop="type" width="160" :formatter="formatModuleName" />
      <el-table-column align="center" label="删除时间" prop="updatetime" width="200" />
      <el-table-column align="center" label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" :loading="scope.row.restoreLoading" @click="handleRestore(scope.row)">
            还原
          </el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '#/components/Pagination'
import { crud } from '@/mixins'

export default {
  name: 'RecycleList',
  components: { Pagination },
  mixins: [crud],
  data () {
    return {
      autoFetchList: false,
      recycleList: [],
      restoreLoading: false
    }
  },
  computed: {
    ...mapGetters(['categories'])
  },
  created () {
    this.listQuery.type = 'article'
    this.fetchList()
  },
  methods: {
    async fetchList () {
      this.listLoading = true
      await this.$api.list.GetRecycleList(this.listQuery).then((res) => {
        const { count, data } = res.data
        this.recycleList = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    },
    formatCategory (row, column, cellValue) {
      const findColumn = this.categories.find(item => item.type === cellValue)
      return findColumn ? findColumn.name : ''
    },
    /**
     * 格式化模块名称
     * @param {Number [int]} cellValue 当前行所属模块
     */
    formatModuleName (row, column, cellValue) {
      const typeEnum = {
        article: '文章模块',
        bangumi: '追番模块',
        app: '小工具',
        other: '其它模块'
      }
      return typeEnum[cellValue] || ''
    },
    handleRestore (row) {
      const { id, type } = row
      this.$confirm('确定要还原该内容?', '提示', {
        type: 'success'
      }).then(async () => {
        this.$set(row, 'restoreLoading', true)
        await this.$api.list.RestoreRecycleList([{ id, type }]).then((response) => {
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
    /**
     * 删除一个或多个
     * @param {Number} listCount 删除数目
     * @param {Object} row 当前行
     */
    deleteMultiple (listCount, row) {
      const lists = row
        ? [{ id: row.id, type: row.type }]
        : this.multipleSelection.map((item) => {
          const { id, type } = item
          return { id, type }
        })
      return this.$api.list.DeleteRecyleList(lists).then((res) => {
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
    handleRestoreSelection () {
      const listCount = this.multipleSelection.length
      if (!listCount) {
        return this.$message('请先选择数据，再进行操作')
      }

      this.$confirm(`此操作将还原这${listCount}条内容, 是否继续?`, '提示', {
        type: 'warning'
      }).then(async () => {
        const list = this.multipleSelection.map((item) => {
          const { id, type } = item
          return { id, type }
        })
        this.restoreLoading = true
        await this.$api.list.RestoreRecycleList(list).then((response) => {
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
