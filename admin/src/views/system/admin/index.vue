<template>
  <div class="app-container">
    <div class="app-top-menu">
      <el-row>
        <el-col :xs="24">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加管理员</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      v-el-height-adaptive-table="{bottomOffset: 62}"
      :data="list"
      height="233"
      border
    >
      <el-table-column align="center" label="用户名">
        <template #default="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称">
        <template #default="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" width="200">
        <template #default="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.register_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后登录" width="200">
        <template #default="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.login_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status" type="success">已激活</el-tag>
          <el-tag v-else type="info">未激活</el-tag></el-tag>
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

    <admin-form :dialog-visible="dialogVisible" :current-id="currentId" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AdminForm from './components/AdminForm'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable, listDialog } from '@/mixins'
import { GetAdminList } from '@/api/user'

export default {
  name: 'Admin',
  components: {
    Pagination,
    AdminForm
  },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable, listDialog],
  data() {
    return {
      searchName: '',
      adminList: []
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetAdminList(this.listQuery).then(res => {
        const { data, count } = res.data
        this.adminList = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    }
  }
}
</script>
