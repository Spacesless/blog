<template>
  <div class="app-container category">
    <el-row class="app-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加
      </el-button>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="categoryList"
      default-expand-all
      row-key="id"
      border
    >
      <el-table-column prop="id" label="ID" width="120" />
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
      <el-table-column align="center" label="导航显示" min-width="120">
        <template #default="scope">
          <el-select v-model="scope.row.is_nav">
            <el-option label="不显示" :value="0" />
            <el-option label="显示" :value="1" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="前台显示" min-width="120">
        <template #default="scope">
          <el-select v-model="scope.row.is_show">
            <el-option label="不显示" :value="0" />
            <el-option label="显示" :value="1" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="所属模块" prop="type" min-width="160" :formatter="formatModuleName" />
      <el-table-column label="操作" align="center" width="300">
        <template #default="scope">
          <el-button type="success" :loading="scope.row.updateLoading" plain @click="handleUpdate(scope.row)">
            更新
          </el-button>
          <el-button class="category-tools-edit" type="primary" @click="handleEdit(scope.row.id)">
            编辑
          </el-button>
          <el-dropdown @command="(cmd: string) => handleCommand(cmd, scope.row)">
            <el-button type="primary" plain :loading="scope.row.deleteLoading">
              更多操作
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="add">
                  添加
                </el-dropdown-item>
                <el-dropdown-item command="move">
                  移动
                </el-dropdown-item>
                <el-dropdown-item command="delete">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <CategoryMoveCategory
      :dialog-visible="dialogVisible"
      :current-row="currentRow"
      :categories="listStore.category"
      @on-confirm="onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowDown } from '@element-plus/icons-vue'
import { convertToTree } from '~/utils'
import { typeOptions } from '~/config/modules'

definePageMeta({
  layout: 'default',
  title: '栏目列表',
})

const router = useRouter()
const api = useApi()
const listStore = useListStore()

const listLoading = ref(false)
const dialogVisible = ref(false)
const currentRow = ref<Record<string, any>>({})

const categoryList = computed(() => JSON.parse(JSON.stringify(convertToTree(listStore.category as any))))

async function fetchList() {
  listLoading.value = true
  try {
    await listStore.getCategory()
  } catch {}
  listLoading.value = false
}

function handleAdd() {
  router.push('/category/create')
}
function handleEdit(id: number) {
  router.push(`/category/edit-${id}`)
}
function handleAddChild(row: any) {
  router.push({ path: '/category/create', query: { parentId: row.id, type: row.type } })
}
function handleMove(row: any) {
  currentRow.value = row
  dialogVisible.value = true
}
function handleDeleteRow(row: any) {
  ElMessageBox.confirm('确定要删除该栏目?', '提示', { type: 'warning' })
    .then(async () => {
      row.deleteLoading = true
      try {
        await api.DeleteList('category', [row.id])
        ElMessage.success('删除成功')
        fetchList()
      } catch {
        ElMessage.error('删除失败')
      }
      row.deleteLoading = false
    }).catch(() => {})
}
function handleCommand(cmd: string, row: any) {
  if (cmd === 'add') handleAddChild(row)
  else if (cmd === 'move') handleMove(row)
  else if (cmd === 'delete') handleDeleteRow(row)
}

async function handleUpdate(row: any) {
  const postData = { id: row.id, no_order: row.no_order, name: row.name, is_nav: row.is_nav, is_show: row.is_show }
  row.updateLoading = true
  try {
    await api.UpdateContent('category', postData)
    ElMessage.success('更新成功')
    fetchList()
  } catch {
    ElMessage.error('更新失败')
  }
  row.updateLoading = false
}

function onConfirm(refresh: boolean) {
  dialogVisible.value = false
  if (refresh) fetchList()
}

function formatModuleName(_row: any, _col: any, cellValue: string) {
  return typeOptions[cellValue] || ''
}

watch(() => listStore.updateRoute, (val) => {
  if (val === 'category') {
    fetchList()
    listStore.setUpdateRoute('')
  }
})

onMounted(() => {
  if (!listStore.category.length) fetchList()
})
</script>

<style lang="scss" scoped>
.category {
  &-tools-edit {
    margin-right: 15px;
  }

  :deep(.el-table__expand-icon) {
    margin-right: 8px;
  }
}
</style>
