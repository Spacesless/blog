<template>
  <div class="app-container">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-input v-model="listQuery.keyword" placeholder="请输入网站标题、地址" clearable @change="onKeywordInput" />
      </el-col>
      <el-col :xs="24" :sm="12" class="text-right">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加友链</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteSelection">删除选中</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      class="links-list"
      :data="linkList"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="网站Logo" width="100" align="center">
        <template #default="scope">
          <el-image :src="scope.row.weblogo" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline-round" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="网站标题">
        <template #default="scope">
          {{ scope.row.webname }}
        </template>
      </el-table-column>
      <el-table-column label="网站地址">
        <template #default="scope">
          <el-link :underline="false" :href="scope.row.weburl" target="_blank">{{ scope.row.weburl }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="no_order" label="排序" width="50" align="center" />
      <el-table-column align="center" label="添加时间" width="200">
        <template #default="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" plain @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />

    <links-form :dialog-visible="dialogVisible" :current-id="currentId" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import LinksForm from './components/LinksForm'
import { multipleTable, listDialog } from '@/mixins'
import { GetList, DeleteList } from '@/api/list'

export default {
  name: 'Links',
  components: {
    Pagination,
    LinksForm
  },
  mixins: [multipleTable, listDialog],
  data() {
    return {
      linkList: []
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetList('links', this.listQuery).then(res => {
        const { data, count } = res.data
        this.linkList = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    },
    handleEdit(id) {
      this.$router.push({ name: 'EditLinks', params: { id: id }})
    },
    deleteSingle(id) {
      DeleteList('links', [id]).then(res => {
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
      const list = this.multipleSelection.map(item => {
        return item.id
      })
      DeleteList('bangumi', list).then(res => {
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

<style lang="scss" scoped>
.links-list{
  .el-image{
    width: 60px;
    height: 60px;
    border-radius: 30px;
    overflow: hidden;
  }
}
</style>
