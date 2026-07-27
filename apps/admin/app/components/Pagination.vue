<template>
  <div class="pagination-container">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      :background="background"
      @update:current-page="updateCurrentPage"
      @update:page-size="updatePageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  total: number
  page?: number
  limit?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
}>(), {
  page: 1,
  limit: 20,
  pageSizes: () => [10, 20, 30, 50],
  layout: 'total, sizes, ->, prev, pager, next, jumper',
  background: true,
})

const emit = defineEmits<{
  (e: 'update:page', v: number): void
  (e: 'update:limit', v: number): void
  (e: 'pagination', payload: { page: number; limit: number }): void
}>()

const currentPage = computed(() => props.page)
const pageSize = computed(() => props.limit)

function updateCurrentPage(v: number) {
  emit('update:page', v)
}

function updatePageSize(v: number) {
  emit('update:limit', v)
}

function handleSizeChange(v: number) {
  emit('update:limit', v)
  emit('pagination', { page: props.page, limit: v })
}

function handleCurrentChange(v: number) {
  emit('update:page', v)
  emit('pagination', { page: v, limit: props.limit })
}
</script>

<style lang="scss" scoped>
.pagination-container {
  padding: 16px;
  text-align: right;
}
</style>
