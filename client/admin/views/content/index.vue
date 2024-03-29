<template>
  <div class="app-container blog">
    <header-menu
      :category-options="categoryOptions"
      :current-type="currentType"
      @onSearchKeyword="handleSearchTitle"
      @onColumnChange="handleChangeColumn"
    />

    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 147}"
      v-loading="listLoading"
      :data="tableData"
      height="233"
      border
      @sort-change="onSortChange"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="图片" width="180" align="center">
        <template #default="scope">
          <el-image :src="scope.row.imgurl" fit="contain" lazy scroll-container=".el-table__body-wrapper">
            <div slot="error" class="image-slot">
              <span class="el-icon-picture-outline-round" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="200">
        <template #default="{row}">
          <el-link
            v-if="row.is_show"
            :underline="false"
            :href="`${configs.siteurl}/${currentType}/detail/${row.id}`"
            target="_blank"
          >
            {{ row.title }}
          </el-link>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问量" prop="hits" width="100" align="center" sortable />
      <el-table-column label="字数" prop="word_count" width="100" align="center" />
      <el-table-column label="更新时间" width="200" prop="updatetime" align="center" sortable />
      <el-table-column
        label="前台展示"
        width="100"
        align="center"
        :filters="[{ text: '显示', value: 1 }, { text: '隐藏', value: 0 }]"
        :filter-method="filterShow"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">
            显示
          </el-tag>
          <el-tag v-else type="info">
            隐藏
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <footer-menu
      :category-options="categoryOptions"
      :delete-loading="deleteLoading"
      :multiple-selection="multipleSelection"
      @onDelateSelection="handleDeleteSelection"
    />

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderMenu from './components/HeaderMenu'
import FooterMenu from './components/FooterMenu'
import Pagination from '#/components/Pagination'
import { crud } from '@/mixins'
import { getCategoryByType } from '@/utils'

export default {
  name: 'ArticleList',
  components: {
    HeaderMenu,
    FooterMenu,
    Pagination
  },
  mixins: [crud],
  data () {
    return {
      currentType: 'article',
      updateLoading: false
    }
  },
  computed: {
    ...mapGetters(['categories', 'updateRoute', 'configs']),
    categoryOptions () {
      const result = getCategoryByType(this.categories, this.currentType)
      return result
    }
  },
  watch: {
    async updateRoute (val) {
      if (val === this.currentType) {
        await this.fetchList()
        this.$store.commit('list/SET_UPDATELIST', '')
      }
    }
  },
  methods: {
    handleEdit (id) {
      this.$router.push({
        name: 'ContentEdit',
        params: { id },
        query: { type: this.currentType }
      })
    },
    /**
     * 更新选中数据
     * @param {Object} data
     */
    handleUpdateSelection (data) {
      return this.$api.list.UpdateList(this.currentType, data).then((res) => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.fetchList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '更新失败'
        })
      })
    },
    /**
     * 列排序
     * @param {String} prop 列字段
     * @param {String} order descending降序
     */
    onSortChange ({ prop, order }) {
      if (order) {
        this.listQuery[prop] = order === 'descending' ? 'DESC' : 'ASC'
      } else {
        this.listQuery[prop] = null
      }
      this.handleSearch()
    },
    /**
     * 过滤前台是否展示
     * @param {Number} value 选中的状态
     * @param {Object} row 行数据
     */
    filterShow (value, row) {
      return row.is_show === value
    }
  }
}
</script>

<style lang="scss" scoped>
.blog {
  .el-image {
    display: block;
    width: 150px;
    height: 120px;
    margin: 0 auto;
  }
}
</style>
