<template>
  <el-row class="app-footer">
    <el-col :xs="24" :sm="12">
      <el-cascader
        v-model="targetCategory"
        :options="categoryOptions"
        :props="{ checkStrictly: true, emitPath: false }"
        placeholder="请选择所移动到的栏目"
        clearable
      />
      <el-button type="warning" :loading="moveLoading" @click="handleMove">
        确定
      </el-button>
    </el-col>
    <el-col :xs="24" :sm="12" class="text-right">
      <el-dropdown @command="handleChangeStatus">
        <el-button type="warning" plain :loading="changeLoading">
          状态修改
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="show">
              前台显示
            </el-dropdown-item>
            <el-dropdown-item command="hide">
              前台隐藏
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button type="danger" :loading="deleteLoading" @click="$emit('onDeleteSelection')">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Delete } from '@element-plus/icons-vue'

const props = withDefaults(defineProps<{
  categoryOptions?: any[]
  deleteLoading?: boolean
  multipleSelection?: any[]
}>(), {
  categoryOptions: () => [],
  deleteLoading: false,
  multipleSelection: () => [],
})

const emit = defineEmits<{
  (e: 'onDeleteSelection'): void
  (e: 'onUpdateSelection', list: Array<{ id: number; [k: string]: any }>): Promise<void> | void
}>()

const targetCategory = ref<number | null>(null)
const moveLoading = ref(false)
const changeLoading = ref(false)

async function handleMove() {
  const listCount = props.multipleSelection.length
  if (!listCount) {
    ElMessage('请先选择数据，再进行操作')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要将${listCount}条内容移动到该栏目`, '提示', { type: 'warning' })
    const passData = props.multipleSelection.map(item => ({ id: item.id, category_id: targetCategory.value }))
    moveLoading.value = true
    await (emit('onUpdateSelection', passData) as any)
    moveLoading.value = false
  } catch {}
}

async function handleChangeStatus(command: string) {
  const listCount = props.multipleSelection.length
  if (!listCount) {
    ElMessage('请先选择数据，再进行操作')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要更新${listCount}条内容?`, '提示', { type: 'warning' })
    const passData = props.multipleSelection.map(item => ({ id: item.id, is_show: command === 'hide' ? 0 : 1 }))
    changeLoading.value = true
    await (emit('onUpdateSelection', passData) as any)
    changeLoading.value = false
  } catch {}
}
</script>
