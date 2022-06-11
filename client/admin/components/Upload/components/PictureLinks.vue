<template>
  <el-dialog
    width="800px"
    :visible="visible"
    append-to-body
    @close="handleCancel"
  >
    <div class="links-header">
      <el-button type="primary" plain @click="addLink">
        新增图片
      </el-button>
    </div>
    <el-form ref="dynamicForm" :model="dynamicForm" label-width="80px" class="links-form">
      <el-form-item
        v-for="(item, index) in dynamicForm.fileList"
        :key="item.name"
        :label="'图片' + index"
      >
        <el-input v-model="item.url" />
        <el-button class="links-form-remove" type="warning" @click.prevent="removeLink(item)">
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button plain @click="handleCancel">
        取消
      </el-button>
      <el-button type="primary" @click="handleConfirm">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dynamicForm: {
        fileList: []
      }
    }
  },
  watch: {
    fileList: {
      handler (data) {
        this.dynamicForm.fileList = Array.from(data)
      },
      immediate: true
    }
  },
  methods: {
    handleConfirm () {
      const result = this.dynamicForm.fileList.map((item) => {
        return {
          name: item.name,
          url: item.url
        }
      })
      this.$emit('onFileUrlChange', result)
      this.handleCancel()
    },
    addLink () {
      this.dynamicForm.fileList.push({
        name: '测试',
        url: ''
      })
    },
    removeLink (item) {
      const findIndex = this.dynamicForm.fileList.indexOf(item)
      if (findIndex !== -1) {
        this.dynamicForm.fileList.splice(findIndex, 1)
      }
    },
    handleCancel () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.links {
  &-header {
    padding: 0 15px 30px;
  }

  &-form {
    .el-form-item {
      margin-bottom: 15px;
    }

    .el-input {
      width: calc(100% - 75px);
    }

    &-remove {
      margin-left: 15px;
    }
  }
}
</style>
