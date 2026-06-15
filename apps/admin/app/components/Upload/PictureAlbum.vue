<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    class="album"
    width="90%"
    @close="handleCancel"
  >
    <div class="file-header">
      <el-row>
        <el-col :sm="24" :md="12">
          <el-breadcrumb>
            <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
              <span v-if="index === breadcrumbs.length - 1">{{ item.name }}</span>
              <span v-else class="redirect" @click="changePath(item.path, index)">{{ item.name }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :sm="24" :md="{ span: 6, offset: 6 }">
          <el-input
            v-model="listQuery.keyword"
            clearable
            placeholder="请输入关键字"
            @input="onKeywordInput"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <el-scrollbar class="album-scroll">
      <el-row v-loading="listLoading" class="file-grid">
        <el-col
          v-for="(item, index) in fileList"
          :key="index"
          :xs="12"
          :sm="8"
          :md="6"
          :xl="4"
        >
          <div
            v-if="item.type === 1"
            class="grid-item folder"
            @click="enterDirectory(item.url)"
          >
            <el-icon><Folder /></el-icon>
            <p>{{ item.name }}</p>
          </div>
          <div
            v-else-if="item.type === 2"
            class="grid-item image"
            :class="{ active: item.checked }"
            @click="toggleSelect(item)"
          >
            <el-image :src="item.url" fit="contain">
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="file-info">
              <p class="file-name">{{ item.name }}</p>
              <p class="file-time">{{ formatTime(item.mtime) }}</p>
              <p class="file-size">{{ formatSize(item.size) }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>

    <div class="file-footer">
      <Pagination
        v-model:page="listQuery.page"
        v-model:limit="listQuery.limit"
        :total="total"
        @pagination="fetchList"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button plain @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Folder, Picture, Search } from '@element-plus/icons-vue'
import { parseTime, debounce } from '~/utils'

interface FileNode {
  type: number
  name: string
  url: string
  size?: number
  mtime?: string | number | Date
  checked?: boolean
}

const props = withDefaults(defineProps<{
  visible?: boolean
}>(), {
  visible: false,
})

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'onSelectFile', list: { name: string; url: string }[]): void
}>()

const api = useApi()

const dialogVisible = computed({
  get: () => props.visible,
  set: (v: boolean) => emit('update:visible', v),
})

const total = ref(0)
const listLoading = ref(false)
const listQuery = reactive<{ keyword: string; page: number; limit: number; path?: string }>({
  keyword: '',
  page: 1,
  limit: 20,
})
const path = ref('')
const breadcrumbs = ref<{ name: string; path: string }[]>([{ name: 'Home', path: '' }])
const fileList = ref<FileNode[]>([])

watch(() => props.visible, (val) => {
  if (val && !fileList.value.length) fetchList()
})

async function fetchList() {
  listLoading.value = true
  listQuery.path = path.value
  try {
    const res: any = await api.GetPathList(listQuery)
    const { data, count } = res.data || {}
    fileList.value = data || []
    total.value = count || 0
  } catch {}
  listLoading.value = false
}

function changePath(p: string, index: number) {
  path.value = p
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
  listQuery.page = 1
  fetchList()
}

const onKeywordInput = debounce(() => {
  listQuery.page = 1
  fetchList()
}, 300)

function enterDirectory(p: string) {
  path.value = p
  const hash = p.split('/')
  breadcrumbs.value.push({ name: hash[hash.length - 1] || p, path: p })
  listQuery.page = 1
  fetchList()
}

function toggleSelect(item: FileNode) {
  item.checked = !item.checked
}

function handleCancel() {
  emit('update:visible', false)
  fileList.value.forEach((item) => {
    item.checked = false
  })
}

function handleConfirm() {
  const selected = fileList.value.filter(x => x.checked).map(x => ({ name: x.name, url: x.url }))
  emit('onSelectFile', selected)
  handleCancel()
}

function formatTime(t: any) {
  return t ? parseTime(t) : ''
}

function formatSize(size?: number) {
  if (!size) return '0 Bytes'
  const unitList = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const source = Number(size)
  const index = Math.floor(Math.log(source) / Math.log(1024))
  const result = source / Math.pow(1024, index)
  return `${result.toFixed(2)} ${unitList[index]}`
}
</script>

<style lang="scss" scoped>
.album {
  :deep(.el-dialog) {
    height: 90%;

    &__body {
      height: calc(100% - 95px);
      padding: 15px 20px;
    }
  }

  &-scroll {
    height: calc(100% - 95px);
  }
}

.file {
  &-header {
    padding: 0 15px 10px;

    .el-breadcrumb {
      line-height: 36px;
      color: #606266;

      .redirect {
        cursor: pointer;

        &:hover {
          color: #409EFF;
        }
      }
    }
  }

  &-grid {
    .el-col {
      padding: 0 15px;
    }

    .grid-item {
      z-index: 1;
      height: 210px;
      margin-bottom: 15px;
      overflow: hidden;
      cursor: pointer;
      background-color: #ECF5FF;
      border: 1px solid #D9ECFF;
      border-radius: 4px;

      &.active {
        background-color: #D9ECFF;
        border-color: #409EFF;
      }
    }

    .folder {
      padding: 60px 0;
      text-align: center;

      .el-icon {
        margin: 10px 0;
        font-size: 28px;
      }

      p {
        margin: 0;
        font-size: 16px;
        color: #409EFF;
      }
    }

    .image {
      :deep(.el-image) {
        display: block;
        height: 135px;
        padding: 5px 10px;
        margin: 0 auto;
      }
    }
  }

  &-info {
    padding: 5px 10px;
    background-color: #FDF6EC;

    p {
      margin: 0;
      overflow: hidden;
      font-size: 14px;
      line-height: 22px;
      color: #E6A23C;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &-time,
  &-size {
    font-size: 13px;
    color: #909399;
  }

  &-footer {
    line-height: 40px;
  }
}
</style>
