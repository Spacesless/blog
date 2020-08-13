<template>
  <el-row class="app-header">
    <el-col :xs="24" :sm="12">
      <el-cascader
        v-model="selectedColumn"
        class="app-header-select"
        :options="columns"
        :props="{ checkStrictly: true }"
        placeholder="请选择栏目"
        clearable
        @change="onColumnChange"
      />
      <el-input
        v-model="keyword"
        placeholder="请输入关键字"
        clearable
        style="width:220px"
        @input="handleSearch"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
    </el-col>
    <el-col :xs="24" :sm="12" class="text-right">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加内容</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { debounce } from 'lodash-es'

export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    currentModule: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyword: '',
      selectedColumn: []
    }
  },
  methods: {
    handleAdd() {
      const columnToStr = this.selectedColumn.length ? this.selectedColumn.join(',') : null
      this.$router.push({ name: 'ContentCreate', query: { module: this.currentModule, column: columnToStr }})
    },
    onColumnChange() {
      const [class1, class2, class3] = this.selectedColumn || []
      this.$emit('onColumnChange', { class1, class2, class3 })
    },
    handleSearch: debounce(function() {
      this.$emit('onSearchKeyword', this.keyword)
    }, 500)
  }
}
</script>
