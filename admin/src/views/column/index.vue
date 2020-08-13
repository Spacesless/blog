<template>
  <div class="app-container columns">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加栏目</el-button>
        <el-switch
          v-model="expandAll"
          class="expand-ctrl"
          active-text="全部展开"
          inactive-text="全部收缩"
        />
      </el-col>
      <el-col :xs="24" :sm="12" class="text-right">
        <el-button type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="handleDeleteSelection">删除</el-button>
        <el-button type="success" icon="el-icon-check" :loading="saveLoading" @click="handleSave">保存</el-button>
      </el-col>
    </el-row>

    <el-table
      ref="columnTable"
      v-el-height-adaptive-table="{bottomOffset: 15}"
      v-loading="listLoading"
      :data="columnlist"
      :default-expand-all="expandAll"
      row-key="id"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column
        prop="id"
        label="ID"
        width="110"
      />
      <el-table-column align="center" label="排序" min-width="160">
        <template #default="scope">
          <el-input-number v-model.number="scope.row.no_order" controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column label="栏目名称" min-width="220">
        <template #default="scope">
          <el-input v-model="scope.row.name" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="120">
        <template #default="scope">
          <el-select v-model="scope.row.is_nav">
            <el-option label="不显示" value="0" />
            <el-option label="显示" value="1" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="所属模块" min-width="160" formatter="formatModuleName" />
      <el-table-column label="目录" prop="folder_name" min-width="160" />
      <el-table-column label="操作" align="center" width="250">
        <template #default="scope">
          <el-button class="columns-tools-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-dropdown>
            <el-button type="primary" plain :loading="scope.row.deleteLoading">
              更多操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleAddChild(scope.row.id)">添加</el-dropdown-item>
              <el-dropdown-item @click.native="handleMove(scope.row)">移动</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(scope.row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <move-column :visible="dialogVisible" :current-row="currentRow" :columns="columns" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MoveColumn from './components/MoveColumn'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable, listDialog } from '@/mixins'
import { formatColumn } from '@/utils'
import { UpdateList, DeleteList } from '@/api/list'

export default {
  name: 'Column',
  components: {
    MoveColumn
  },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable, listDialog],
  data() {
    return {
      expandAll: true,
      columnlist: [],
      multipleSelection: [],
      currentRow: {},
      saveLoading: false
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
      if (!this.columns.length) {
        await this.$store.dispatch('list/getColumns').catch(() => {})
      }
      const columns = formatColumn(this.columns)
      this.columnlist = JSON.parse(JSON.stringify(columns))
      this.listLoading = false
    },
    handleAdd() {
      this.$router.push({ name: 'ColumnAdd' })
    },
    handleEdit(id) {
      this.$router.push({ name: 'ColumnEdit', params: { id }})
    },
    handleAddChild(id) {
      this.$router.push({ name: 'ColumnAdd', query: { class: id }})
    },
    handleMove(row) {
      this.currentRow = row
      this.dialogVisible = true
    },
    deleteSingle(id) {
      DeleteList('column', [id]).then(response => {
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
      const lists = this.multipleSelection.map(item => item.id)
      DeleteList('column', lists).then(res => {
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
    async handleSave() {
      this.saveLoading = true
      await UpdateList('column', this.columnlist).then(response => {
        this.$message({
          type: 'success',
          message: response.data
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error
        })
      })
      this.saveLoading = false
    },
    /**
     * 格式化模块名称
     * @param {Number [int]} cellValue 当前行所属模块
     */
    formatModuleName(row, column, cellValue) {
      const moduleEnum = ['', '简介模块', '文章模块', '图片模块', '追番模块', 'webapp']
      return moduleEnum[cellValue] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header{
  .expand-ctrl{
    padding-left: 15px;
  }
}
.columns{
  &-tools{
    &-edit{
      margin-right: 15px;
    }
  }
}
</style>
