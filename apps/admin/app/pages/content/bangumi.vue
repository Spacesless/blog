<template>
  <div class="app-container bangumi">
    <ContentHeaderMenu
      :category-options="categoryOptions"
      :current-type="currentType"
      @on-search-keyword="handleSearchTitle"
      @on-column-change="handleChangeColumn"
    />

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="tableData"
      border
      @sort-change="onSortChange"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="图片" width="150" align="center">
        <template #default="scope">
          <el-image :src="scope.row.imgurl" fit="contain" lazy />
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="200">
        <template #default="{ row }">
          <el-link
            v-if="row.is_show"
            :underline="false"
            :href="`${configStore.configs.siteurl}/${currentType}/detail/${row.id}`"
            target="_blank"
          >
            {{ row.title }}
          </el-link>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总集数" width="150" align="center">
        <template #default="scope">
          <el-input-number v-model="scope.row.total" controls-position="right" :min="0" />
        </template>
      </el-table-column>
      <el-table-column label="进度" width="150" align="center">
        <template #default="scope">
          <el-input-number v-model="scope.row.current" controls-position="right" :min="0" :max="scope.row.total" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150" align="center" :filters="statusFilters" :filter-method="filterStatus">
        <template #default="scope">
          <el-select v-model="scope.row.status" placeholder="请选择状态">
            <el-option label="未上映" :value="0" />
            <el-option label="连载中" :value="1" />
            <el-option label="已完结" :value="2" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="推荐指数" width="150" align="center" prop="ratings" sortable>
        <template #default="scope">
          <el-input-number v-model="scope.row.ratings" controls-position="right" :min="5" :max="10" :step="0.1" />
        </template>
      </el-table-column>
      <el-table-column label="前台显示" width="100" align="center" :filters="showFilters" :filter-method="filterShow">
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button type="success" :loading="scope.row.updateLoading" plain @click="handleUpdate(scope.row)">
            更新
          </el-button>
          <el-button type="primary" @click="handleEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button type="danger" :loading="scope.row.deleteLoading" plain @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <ContentFooterMenu
      :category-options="categoryOptions"
      :delete-loading="deleteLoading"
      :multiple-selection="multipleSelection"
      @on-delete-selection="handleDeleteSelection"
      @on-update-selection="handleUpdateSelection"
    />

    <Pagination
      v-model:page="listQuery.page"
      v-model:limit="listQuery.pageSize"
      :total="total"
      @pagination="fetchList"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { getCategoryByType } from '~/utils'

definePageMeta({
  layout: 'default',
  title: '番剧模块',
})

const currentType = ref('bangumi')
const router = useRouter()
const api = useApi()
const listStore = useListStore()
const configStore = useConfigStore()

const statusFilters = [
  { text: '未上映', value: 0 },
  { text: '连载中', value: 1 },
  { text: '已完结', value: 2 },
]
const showFilters = [
  { text: '显示', value: 1 },
  { text: '隐藏', value: 0 },
]

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
  handleSearchTitle,
  handleChangeColumn,
} = useCrud<any>(currentType)

const categoryOptions = computed(() => getCategoryByType(listStore.category as any, currentType.value))

async function handleUpdate(row: any) {
  row.updateLoading = true
  try {
    const { id, total, current, status, ratings } = row
    await api.UpdateContent(currentType.value, { id, total, current, status, ratings })
    ElMessage.success('更新成功')
    fetchList()
  } catch {
    ElMessage.error('更新失败')
  }
  row.updateLoading = false
}

function handleEdit(id: number) {
  router.push({ path: `/content/edit-${id}`, query: { type: currentType.value } })
}

function onSortChange({ prop, order }: { prop: string; order: string | null }) {
  if (order) (listQuery as any)[prop] = order === 'descending' ? 'DESC' : 'ASC'
  else (listQuery as any)[prop] = null
  handleSearch()
}

function filterStatus(value: number, row: any) {
  return row.status === value
}
function filterShow(value: number, row: any) {
  return row.is_show === value
}

async function handleUpdateSelection(data: any[]) {
  try {
    await api.UpdateList(currentType.value, data)
    ElMessage.success('更新成功')
    fetchList()
  } catch {
    ElMessage.error('更新失败')
  }
}

watch(() => listStore.updateRoute, (val) => {
  if (val === currentType.value) {
    fetchList()
    listStore.setUpdateRoute('')
  }
})

onMounted(() => {
  fetchList()
})
</script>

<style lang="scss" scoped>
.bangumi :deep(.el-image) {
  display: block;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}
</style>
