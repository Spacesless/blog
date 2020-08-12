<template>
  <div class="app-container banners">
    <el-row class="app-header">
      <el-col :xs="24">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加banner</el-button>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 80}"
      v-loading="listLoading"
      :data="bannerList"
      height="233"
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
      <el-table-column align="center" label="排序" prop="sort" />
      <el-table-column align="center" label="操作" width="230">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" :loading="scope.row.deleteLoading" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <banner-form :dialog-visible="dialogVisible" :current-id="currentId" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import BannerForm from './components/BannerForm'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable, listDialog } from '@/mixins'
import { GetList } from '@/api/list'

export default {
  name: 'Banners',
  components: {
    BannerForm
  },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable, listDialog],
  data() {
    return {
      bannerList: []
    }
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetList('banner').then(res => {
        this.bannerList = res.data
      }).catch(() => {})
      this.listLoading = false
    }
  }
}
</script>
