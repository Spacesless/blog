<template>
  <div>
    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 62}"
      v-loading="listLoading"
      :data="bannerList"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="图片" width="150" align="center">
        <template #default="scope">
          <el-image :src="scope.row.imgurl" fit="contain" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline-round" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" />
      <el-table-column label="描述" prop="mark" />
      <el-table-column align="center" label="操作" width="230">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" plain @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <banner-form />
  </div>
</template>

<script>
import BannerForm from './components/BannerForm'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable } from '@/mixins'
import { GetList } from '@/api/list'

export default {
  components: {
    BannerForm
  },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable],
  data() {
    return {
      bannerList: []
    }
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetList('banner').then(res => {
        const { count, data } = res.data
        this.total = count
        this.bannerList = data
      }).catch(() => {})
      this.listLoading = false
    },
    handleEdit() {

    },
    handleDelete() {

    }
  }
}
</script>
