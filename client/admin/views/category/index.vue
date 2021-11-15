<template>
  <div class="app-container category">
    <el-row class="app-header">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="handleDeleteSelection">删除</el-button>
    </el-row>

    <el-table
      ref="columnTable"
      v-el-height-adaptive-table="{bottomOffset: 20}"
      v-loading="listLoading"
      :data="categoryList"
      default-expand-all
      row-key="id"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column prop="id" label="ID" width="110" />
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
            <el-option label="不显示" :value="0" />
            <el-option label="显示" :value="1" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="所属模块" prop="type" min-width="160" :formatter="formatModuleName" />
      <el-table-column label="操作" align="center" width="300">
        <template #default="scope">
          <el-button type="success" :loading="scope.row.updateLoading" plain @click="handleUpdate(scope.row)">更新</el-button>
          <el-button class="category-tools-edit" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-dropdown>
            <el-button type="primary" plain :loading="scope.row.deleteLoading">
              更多操作<span class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleAddChild(scope.row)">添加</el-dropdown-item>
              <el-dropdown-item @click.native="handleMove(scope.row)">移动</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(scope.row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 移动栏目 -->
    <move-category :dialog-visible="dialogVisible" :current-row="currentRow" :categorys="categorys" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MoveCategory from './components/MoveCategory'
import elHeightAdaptiveTable from '#/directive/el-table'
import { crud, listDialog } from '@/mixins'
import { formatCategory } from '@/utils'
import typeOptions from './modules'

export default {
  name: 'Category',
  components: {
    MoveCategory
  },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [crud, listDialog],
  data() {
    return {
      currentType: 'category',
      categoryList: [],
      multipleSelection: [],
      currentRow: {}
    }
  },
  computed: {
    ...mapGetters(['categorys', 'updateRoute'])
  },
  watch: {
    async updateRoute(val) {
      if (val === this.currentType) {
        this.fetchList()
        this.$store.commit('list/SET_UPDATELIST', '')
      }
    }
  },
  created() {
    if (!this.categorys.length) {
      this.fetchList()
    }
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await this.$store.dispatch('list/getCategory').catch(() => {})
      const category = formatCategory(this.categorys)
      this.categoryList = JSON.parse(JSON.stringify(category))
      this.listLoading = false
    },
    handleAdd() {
      this.$router.push({ name: 'CategoryCreate' })
    },
    handleEdit(id) {
      this.$router.push({
        name: 'CategoryEdit',
        params: { id }
      })
    },
    /**
     * 添加子栏目
     * @param {Number} id 父栏目ID
     */
    handleAddChild({ id, type }) {
      this.$router.push({
        name: 'CategoryCreate',
        query: { parentId: id, type }
      })
    },
    handleMove(row) {
      this.currentRow = row
      this.dialogVisible = true
    },
    async handleUpdate(row) {
      const { id, no_order, name, is_nav } = row
      this.$set(row, 'updateLoading', true)
      await this.$api.content.UpdateContent(this.currentType, { id, no_order, name, is_nav }).then(res => {
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
      this.$set(row, 'updateLoading', false)
    },
    /**
     * 格式化模块名称
     * @param {Number [int]} cellValue 当前行所属模块
     */
    formatModuleName(row, column, cellValue) {
      return typeOptions[cellValue] || ''
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
.category{
  &-tools{
    &-edit{
      margin-right: 15px;
    }
  }
}
</style>
