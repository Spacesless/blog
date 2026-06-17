<template>
  <div class="app-container blog">
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
      <el-table-column label="图片" width="180" align="center">
        <template #default="scope">
          <el-image :src="scope.row.imgurl" fit="contain" lazy />
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="200">
        <template #default="{ row }">
          <el-link
            v-if="row.is_show"
            :underline="false"
            :href="`${configStore.configs.siteurl}/${currentType}/detail/${row.pathname || row.id}`"
            target="_blank"
          >
            {{ row.title }}
          </el-link>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问量" prop="hits" width="100" align="center" sortable />
      <el-table-column label="字数" prop="word_count" width="100" align="center" />
      <el-table-column label="更新时间" width="200" prop="updatetime" align="center" sortable />
      <el-table-column
        label="前台展示"
        width="100"
        align="center"
        :filters="[{ text: '显示', value: 1 }, { text: '隐藏', value: 0 }]"
        :filter-method="filterShow"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row)">
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
  title: '文章模块',
})

const currentType = ref('article')
const router = useRouter()
const route = useRoute()
const api = useApi()

const listStore = useListStore()
const configStore = useConfigStore()

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

function handleEdit(id: number) {
  router.push({
    path: `/content/edit-${id}`,
    query: { type: currentType.value, ...route.query },
  })
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

function onSortChange({ prop, order }: { prop: string; order: string | null }) {
  if (order) (listQuery as any)[prop] = order === 'descending' ? 'DESC' : 'ASC'
  else (listQuery as any)[prop] = null
  handleSearch()
}

function filterShow(value: number, row: any) {
  return row.is_show === value
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
.blog :deep(.el-image) {
  display: block;
  width: 150px;
  height: 120px;
  margin: 0 auto;
}
</style>
