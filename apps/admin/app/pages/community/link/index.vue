<template>
  <div class="app-container links">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加
        </el-button>
        <el-button type="danger" :loading="deleteLoading" @click="handleDeleteSelection">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
        <el-dropdown @command="handleChangeStatus">
          <el-button type="warning" plain :loading="changeLoading">
            状态修改
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="show">前台显示</el-dropdown-item>
              <el-dropdown-item command="hide">前台隐藏</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :xs="24" :sm="12" class="text-right">
        <el-input v-model="listQuery.keyword" placeholder="请输入网站标题、地址" clearable @change="onKeywordInput" />
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{ bottomOffset: 85 }"
      v-loading="listLoading"
      :data="tableData"
      height="100px"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="Logo" width="100" align="center">
        <template #default="scope">
          <el-image class="links-list-logo" :src="scope.row.logo" lazy />
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
          <el-tag v-if="scope.row.is_show">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" prop="addtime" width="200" />
      <el-table-column align="center" label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:page="listQuery.page"
      v-model:limit="listQuery.pageSize"
      :total="total"
      @pagination="fetchList"
    />

    <CommunityLinksForm
      :dialog-visible="dialogVisible"
      :current-id="currentId"
      @on-confirm="onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, ArrowDown } from '@element-plus/icons-vue'
import { debounce } from '~/utils'

definePageMeta({
  layout: 'default',
  title: '友情链接',
})

const currentType = ref('link')
const api = useApi()

const {
  multipleSelection,
  tableData,
  listLoading,
  listQuery,
  total,
  deleteLoading,
  multipleTable,
  fetchList,
  onSelectionChange,
  handleDelete,
  handleDeleteSelection,
  handleSearch,
} = useCrud<any>(currentType)

const dialogVisible = ref(false)
const currentId = ref(0)
const changeLoading = ref(false)

const onKeywordInput = debounce(() => handleSearch(), 500)

function handleAdd() {
  currentId.value = 0
  dialogVisible.value = true
}

function handleEdit(id: number) {
  currentId.value = id
  dialogVisible.value = true
}

function onConfirm(refresh: boolean) {
  dialogVisible.value = false
  if (refresh) fetchList()
}

async function handleChangeStatus(command: string) {
  const listCount = multipleSelection.value.length
  if (!listCount) {
    ElMessage('请先选择数据，再进行操作')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要更新${listCount}条内容?`, '提示', { type: 'warning' })
    const passData = multipleSelection.value.map(item => ({ id: item.id, is_show: command === 'hide' ? 0 : 1 }))
    changeLoading.value = true
    try {
      await api.UpdateList(currentType.value, passData)
      ElMessage.success('更新成功')
      fetchList()
    } catch {
      ElMessage.error('更新失败')
    }
    changeLoading.value = false
  } catch {}
}

onMounted(() => fetchList())
</script>

<style lang="scss" scoped>
.links-list-logo {
  display: block;
  width: 60px;
  height: 60px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 30px;
}
</style>
