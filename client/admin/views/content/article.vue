<template>
  <div class="app-container blog">
    <header-menu
      :category-options="categoryOptions"
      :current-type="currentType"
      @onSearchKeyword="handleSearchTitle"
      @onColumnChange="handleChangeColumn"
    />

    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 152}"
      v-loading="listLoading"
      :data="tableData"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="图片" width="180" align="center">
        <template #default="scope">
          <el-image :src="scope.row.imgurl" fit="contain" lazy scroll-container=".el-table__body-wrapper">
            <div slot="error" class="image-slot">
              <span class="el-icon-picture-outline-round" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" />
      <el-table-column label="访问量" prop="hits" width="100" align="center" />
      <el-table-column class-name="status-col" label="前台展示" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="200" prop="updatetime" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <footer-menu
      :category-options="categoryOptions"
      :delete-loading="deleteLoading"
      :multiple-selection="multipleSelection"
      @onDelateSelection="handleDeleteSelection"
    />

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderMenu from './components/HeaderMenu'
import FooterMenu from './components/FooterMenu'
import Pagination from '@/components/Pagination'
import { multipleTable } from '@/mixins'
import { getCategoryByType } from '@/utils'

export default {
  name: 'Article',
  components: {
    HeaderMenu,
    FooterMenu,
    Pagination
  },
  mixins: [multipleTable],
  data() {
    return {
      currentType: 'article',
      updateLoading: false
    }
  },
  computed: {
    ...mapGetters(['categorys', 'updateRoute']),
    categoryOptions() {
      const result = getCategoryByType(this.categorys, this.currentType)
      return result
    }
  },
  watch: {
    async updateRoute(val) {
      if (val === this.currentType) {
        await this.fetchList()
        this.$store.commit('list/SET_UPDATELIST', '')
      }
    }
  },
  activated() {
    this.$refs.multipleTable && this.$refs.multipleTable.doLayout()
  },
  methods: {
    handleEdit(id) {
      this.$router.push({
        name: 'ContentEdit',
        params: { id: id },
        query: { type: this.currentType }
      })
    },
    handleUpdateSelection(data) {
      return this.$api.list.UpdateList(this.currentType, data).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.blog{
  .el-image{
    display: block;
    width: 150px;
    height: 120px;
    margin: 0 auto;
  }
}
</style>
