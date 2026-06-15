<template>
  <div class="app-container banners">
    <el-row class="app-header">
      <el-col :xs="24">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加banner
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="bannerList" border>
      <el-table-column label="图片" width="200" align="center">
        <template #default="scope">
          <el-image :src="scope.row.imgurl" fit="contain" lazy />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" />
      <el-table-column label="前台展示" width="120" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="sort" width="100" />
      <el-table-column align="center" label="操作" width="230">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" :loading="scope.row.deleteLoading" plain @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <SystemBannerForm :dialog-visible="dialogVisible" :current-id="currentId" @on-confirm="onConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

definePageMeta({
  layout: 'default',
  title: 'Banner管理',
})

const api = useApi()
const listLoading = ref(false)
const bannerList = ref<Array<{ id: number; deleteLoading?: boolean; [k: string]: any }>>([])
const dialogVisible = ref(false)
const currentId = ref(0)

async function fetchList() {
  listLoading.value = true
  try {
    const res: any = await api.GetList('banner')
    bannerList.value = res.data || []
  } catch {}
  listLoading.value = false
}

function handleAdd() {
  currentId.value = 0
  dialogVisible.value = true
}

function handleEdit(id: number) {
  currentId.value = id
  dialogVisible.value = true
}

function handleDelete(row: { id: number; deleteLoading?: boolean }) {
  ElMessageBox.confirm('确定删除该 Banner?', '提示', { type: 'warning' })
    .then(async () => {
      row.deleteLoading = true
      try {
        await api.DeleteList('banner', [row.id])
        ElMessage.success('删除成功')
        fetchList()
      } catch {
        ElMessage.error('删除失败')
      }
      row.deleteLoading = false
    }).catch(() => {})
}

function onConfirm(refresh: boolean) {
  dialogVisible.value = false
  if (refresh) fetchList()
}

onMounted(() => fetchList())
</script>
