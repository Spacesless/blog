<template>
  <div class="app-container">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-button type="danger" :loading="deleteLoading" @click="handleDeleteSelection">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
        <el-button type="primary" plain :loading="restoreLoading" @click="handleRestoreSelection">
          <el-icon><RefreshRight /></el-icon>
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
      v-el-height-adaptive-table="{ bottomOffset: 85 }"
      v-loading="listLoading"
      :data="recycleList"
      height="100px"
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

    <Pagination
      v-model:page="listQuery.page"
      v-model:limit="listQuery.pageSize"
      :total="total"
      @pagination="fetchList"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, RefreshRight } from '@element-plus/icons-vue'

definePageMeta({
  layout: 'default',
  title: '回收站',
})

const api = useApi()
const listStore = useListStore()

interface RecycleRow {
  id: number
  type: string
  title?: string
  updatetime?: string
  deleteLoading?: boolean
  restoreLoading?: boolean
}

const recycleList = ref<RecycleRow[]>([])
const multipleSelection = ref<RecycleRow[]>([])
const listLoading = ref(false)
const listQuery = reactive<{ page: number; pageSize: number; type: string }>({
  page: 1, pageSize: 20, type: 'article',
})
const total = ref(0)
const deleteLoading = ref(false)
const restoreLoading = ref(false)
const multipleTable = ref<any>(null)

async function fetchList() {
  listLoading.value = true
  try {
    const res: any = await api.GetRecycleList(listQuery)
    recycleList.value = res.data?.data || []
    total.value = res.data?.count || 0
  } catch {}
  listLoading.value = false
}

function onSelectionChange(val: RecycleRow[]) {
  multipleSelection.value = val
}

function handleSearch() {
  listQuery.page = 1
  fetchList()
}

function formatCategory(_row: any, _col: any, cellValue: string) {
  const find = listStore.category.find((item: any) => item.type === cellValue)
  return find ? find.name : ''
}

function formatModuleName(_row: any, _col: any, cellValue: string) {
  return ({ article: '文章模块', bangumi: '追番模块', app: '小工具', other: '其它模块' } as Record<string, string>)[cellValue] || ''
}

function calcCurrentPage(count: number) {
  total.value -= count
  if (total.value > 0 && (listQuery.page - 1) * listQuery.pageSize === total.value) {
    listQuery.page -= 1
  }
}

async function deleteMultiple(listCount: number, row?: RecycleRow) {
  const lists = row ? [{ id: row.id, type: row.type }] : multipleSelection.value.map(i => ({ id: i.id, type: i.type }))
  try {
    await api.DeleteRecyleList(lists as any)
    ElMessage.success('删除成功')
    calcCurrentPage(listCount)
    fetchList()
  } catch {
    ElMessage.error('删除失败')
  }
}

function handleDelete(row: RecycleRow) {
  ElMessageBox.confirm('此操作将彻底删除该内容, 是否继续?', '提示', { type: 'warning' })
    .then(async () => {
      row.deleteLoading = true
      await deleteMultiple(1, row)
      row.deleteLoading = false
    }).catch(() => {})
}

function handleDeleteSelection() {
  const listCount = multipleSelection.value.length
  if (!listCount) {
    ElMessage('请先选择数据，再进行操作')
    return
  }
  ElMessageBox.confirm(`确定要彻底删除${listCount}条内容?`, '提示', { type: 'warning' })
    .then(async () => {
      deleteLoading.value = true
      await deleteMultiple(listCount)
      deleteLoading.value = false
    }).catch(() => {})
}

function handleRestore(row: RecycleRow) {
  ElMessageBox.confirm('确定要还原该内容?', '提示', { type: 'success' })
    .then(async () => {
      row.restoreLoading = true
      try {
        await api.RestoreRecycleList([{ id: row.id, type: row.type }] as any)
        ElMessage.success('还原成功')
        calcCurrentPage(1)
        fetchList()
      } catch {
        ElMessage.error('还原失败')
      }
      row.restoreLoading = false
    }).catch(() => {})
}

function handleRestoreSelection() {
  const listCount = multipleSelection.value.length
  if (!listCount) {
    ElMessage('请先选择数据，再进行操作')
    return
  }
  ElMessageBox.confirm(`此操作将还原这${listCount}条内容, 是否继续?`, '提示', { type: 'warning' })
    .then(async () => {
      restoreLoading.value = true
      try {
        const list = multipleSelection.value.map(i => ({ id: i.id, type: i.type }))
        await api.RestoreRecycleList(list as any)
        ElMessage.success('还原成功')
        calcCurrentPage(listCount)
        fetchList()
      } catch {
        ElMessage.error('还原失败')
      }
      restoreLoading.value = false
    }).catch(() => {})
}

onMounted(() => fetchList())
</script>
