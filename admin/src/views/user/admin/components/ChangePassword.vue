<template>
  <el-dialog
    title=""
    :visible="dialogVisible"
    width="640"
  >
    <div />
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dialogForm } from '@/mixins'

export default {
  mixins: [dialogForm]
}
</script>
