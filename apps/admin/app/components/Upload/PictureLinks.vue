<template>
  <el-dialog
    v-model="dialogVisible"
    width="800px"
    title="添加网络图片"
    append-to-body
    align-center
    @close="handleCancel"
  >
    <div class="links-header">
      <el-button type="primary" plain @click="addLink">
        新增图片
      </el-button>
    </div>
    <el-form :model="dynamicForm" label-width="80px" class="links-form">
      <el-form-item
        v-for="(item, index) in dynamicForm.fileList"
        :key="index"
        :label="'图片' + index"
      >
        <el-input v-model="item.url" />
        <el-button class="links-form-remove" type="warning" @click.prevent="removeLink(item)">
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button plain @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" @click="handleConfirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
interface LinkItem {
  name: string
  url: string
}

const props = withDefaults(defineProps<{
  visible?: boolean
  fileList?: LinkItem[]
}>(), {
  visible: false,
  fileList: () => [],
})

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'onFileUrlChange', list: LinkItem[]): void
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (v: boolean) => emit('update:visible', v),
})

const dynamicForm = reactive<{ fileList: LinkItem[] }>({ fileList: [] })

watch(() => props.fileList, (data) => {
  dynamicForm.fileList = Array.from(data || [])
}, { immediate: true })

function handleConfirm() {
  const result = dynamicForm.fileList.map(item => ({ name: item.name, url: item.url }))
  emit('onFileUrlChange', result)
  handleCancel()
}

function addLink() {
  dynamicForm.fileList.push({ name: '测试', url: '' })
}

function removeLink(item: LinkItem) {
  const i = dynamicForm.fileList.indexOf(item)
  if (i !== -1) dynamicForm.fileList.splice(i, 1)
}

function handleCancel() {
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.links {
  &-header {
    padding: 0 15px 30px;
  }

  &-form {
    :deep(.el-form-item) {
      margin-bottom: 15px;
    }

    :deep(.el-input) {
      width: calc(100% - 75px);
    }

    &-remove {
      margin-left: 15px;
    }
  }
}
</style>
