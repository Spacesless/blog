import { ElMessage, ElMessageBox } from 'element-plus'
import { scrollTo } from '~/utils'

export interface ListQuery {
  page: number
  pageSize: number
  keyword?: string
  category?: number | null
  [key: string]: any
}

/**
 * 列表 CRUD 通用逻辑
 */
export function useCrud<T extends { id: number; deleteLoading?: boolean }>(currentType: Ref<string> | string) {
  const api = useApi()
  const typeRef = isRef(currentType) ? currentType : ref(currentType)

  const multipleSelection = ref<T[]>([])
  const tableData = ref<T[]>([])
  const listLoading = ref(false)
  const listQuery = reactive<ListQuery>({ page: 1, pageSize: 20 })
  const total = ref(0)
  const deleteLoading = ref(false)
  const multipleTable = ref<any>(null)

  async function fetchList() {
    listLoading.value = true
    try {
      const res: any = await api.GetList(typeRef.value, listQuery)
      const data = res.data || {}
      tableData.value = data.data || []
      total.value = data.count || 0
    } catch {}
    listLoading.value = false
  }

  function onSelectionChange(val: T[]) {
    multipleSelection.value = val
  }

  function calcCurrentPage(listCount: number) {
    total.value -= listCount
    if (total.value > 0 && (listQuery.page - 1) * listQuery.pageSize === total.value) {
      listQuery.page -= 1
    }
  }

  async function deleteMultiple(listCount: number, row?: T) {
    const lists = row ? [row.id] : multipleSelection.value.map(item => item.id)
    try {
      await api.DeleteList(typeRef.value, lists)
      ElMessage.success('删除成功')
      calcCurrentPage(listCount)
      await fetchList()
    } catch {
      ElMessage.error('删除失败')
    }
  }

  function handleDelete(row: T) {
    ElMessageBox.confirm('此操作将删除该内容, 是否继续?', '提示', { type: 'warning' })
      .then(async () => {
        row.deleteLoading = true
        await deleteMultiple(1, row)
        row.deleteLoading = false
      })
      .catch(() => {})
  }

  function handleDeleteSelection() {
    const listCount = multipleSelection.value.length
    if (!listCount) {
      ElMessage('请先选择数据，再进行操作')
      return
    }
    ElMessageBox.confirm(`确定要删除${listCount}条内容?`, '提示', { type: 'warning' })
      .then(async () => {
        deleteLoading.value = true
        await deleteMultiple(listCount)
        deleteLoading.value = false
      })
      .catch(() => {})
  }

  function handleSearch() {
    listQuery.page = 1
    fetchList()
    const bodyWrapper = multipleTable.value?.bodyWrapper
    if (bodyWrapper) scrollTo(0, 200, bodyWrapper)
  }

  function handleSearchTitle(keyword: string) {
    listQuery.keyword = keyword
    handleSearch()
  }

  function handleChangeColumn(payload: { category?: number | null }) {
    Object.assign(listQuery, payload, { page: 1 })
    handleSearch()
  }

  return {
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
  }
}
