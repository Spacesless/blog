<template>
  <el-row class="app-header">
    <el-col :xs="24" :sm="12">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加
      </el-button>
    </el-col>
    <el-col :xs="24" :sm="12" class="text-right">
      <el-cascader
        v-model="selectedCategory"
        class="app-header-select"
        :options="categoryOptions"
        :props="{ checkStrictly: true, emitPath: false }"
        placeholder="请选择栏目"
        clearable
        @change="onColumnChange"
      />
      <el-input
        v-model="keyword"
        placeholder="请输入关键字"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Plus, Search } from '@element-plus/icons-vue'
import { debounce } from '~/utils'

const props = defineProps<{
  categoryOptions?: any[]
  currentType?: string
}>()

const emit = defineEmits<{
  (e: 'onColumnChange', payload: { category: number | null }): void
  (e: 'onSearchKeyword', keyword: string): void
}>()

const router = useRouter()

const keyword = ref('')
const selectedCategory = ref<number | null>(null)

function handleAdd() {
  router.push({
    path: '/content/create',
    query: {
      type: props.currentType || '',
      category: selectedCategory.value ?? undefined,
    } as any,
  })
}

function onColumnChange() {
  emit('onColumnChange', { category: selectedCategory.value })
}

const handleSearch = debounce(() => {
  emit('onSearchKeyword', keyword.value)
}, 500)
</script>
