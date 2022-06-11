<template>
  <div class="app-container links">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
          添加
        </el-button>
        <el-button type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="handleDeleteSelection">
          删除
        </el-button>
        <el-dropdown @command="handleChangeStatus">
          <el-button type="warning" plain :loading="changeLoading">
            状态修改<span class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="show">
              前台显示
            </el-dropdown-item>
            <el-dropdown-item command="hide">
              前台隐藏
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :xs="24" :sm="12" class="text-right">
        <el-input v-model="listQuery.keyword" placeholder="请输入网站标题、地址" clearable @change="onKeywordInput" />
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      v-el-height-adaptive-table="{bottomOffset: 90}"
      :data="tableData"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="Logo" width="100" align="center">
        <template #default="scope">
          <el-image class="links-list-logo" :src="scope.row.logo" lazy>
            <div slot="error" class="image-slot">
              <span class="el-icon-picture-outline-round" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="网站标题" prop="name" />
      <el-table-column label="网站地址">
        <template #default="scope">
          <el-link :underline="false" :href="scope.row.website" target="_blank">
            {{ scope.row.website }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="no_order" width="60" />
      <el-table-column label="前台显示" width="120" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">
            显示
          </el-tag>
          <el-tag v-else type="info">
            隐藏
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" prop="addtime" width="200" />
      <el-table-column align="center" label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button type="danger" plain @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />

    <links-form :dialog-visible="dialogVisible" :current-id="currentId" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import LinksForm from './components/LinksForm'
import Pagination from '#/components/Pagination'
import { crud, listDialog } from '@/mixins'

export default {
  name: 'LinkList',
  components: {
    Pagination,
    LinksForm
  },
  mixins: [crud, listDialog],
  data () {
    return {
      currentType: 'link',
      changeLoading: false
    }
  },
  methods: {
    handleChangeStatus (command) {
      const listCount = this.multipleSelection.length
      if (!listCount) {
        return this.$message('请先选择数据，再进行操作')
      }
      this.$confirm(`确定要更新${listCount}条内容?`, '提示', {
        type: 'warning'
      }).then(async () => {
        const passData = this.multipleSelection.map((item) => {
          const { id } = item
          return { id, is_show: command === 'hide' ? 0 : 1 }
        })
        this.changeLoading = true
        await this.$api.list.UpdateList(this.currentType, passData).then((res) => {
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

<style lang="scss" scoped>
.links {
  &-list-logo {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 30px;
  }
}
</style>
