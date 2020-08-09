<template>
  <div class="top-menu">
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-cascader
          v-model="selectedColumn"
          class="top-menu-select"
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
  </div>
</template>

<script>
import { debounce } from 'lodash/function'

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
      const _column = this.selectedColumn
      const columnObj = {
        class1: _column[0] ? _column[0] : null,
        class2: _column[1] ? _column[1] : null,
        class3: _column[2] ? _column[2] : null
      }
      this.$emit('onColumnChange', columnObj)
    },
    handleSearch() {
      const onKeywordInput = debounce(() => {
        this.$emit('onSearchKeyword', this.keyword)
      }, 500)
      onKeywordInput()
    }
  }
}
</script>

<style lang="scss" scoped>
.top-menu{
  &-select{
    margin-right: 15px;
  }
}
</style>
