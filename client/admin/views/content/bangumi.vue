<template>
  <div class="app-container bangumi">
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
      <el-table-column label="图片" width="150" align="center">
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
      <el-table-column label="总集数" width="150" align="center">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.total"
            controls-position="right"
            :min="0"
          />
        </template>
      </el-table-column>
      <el-table-column label="进度" width="150" align="center">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.current"
            controls-position="right"
            :min="0"
            :max="scope.row.total"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="150"
        align="center"
        :filters="[{ text: '未上映', value: 0 }, { text: '连载中', value: 1 }, { text: '已完结', value: 2 }]"
        :filter-method="filterStatus"
      >
        <template #default="scope">
          <el-select v-model="scope.row.status" placeholder="请选择状态">
            <el-option label="未上映" :value="0" />
            <el-option label="连载中" :value="1" />
            <el-option label="已完结" :value="2" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="推荐指数" width="150" align="center" prop="ratings" sortable>
        <template #default="scope">
          <el-input-number
            v-model="scope.row.ratings"
            controls-position="right"
            :min="5"
            :max="10"
            :step="0.1"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="前台显示"
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
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button type="success" :loading="scope.row.updateLoading" plain @click="handleUpdate(scope.row)">
            更新
          </el-button>
          <el-button type="primary" @click="handleEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button type="danger" :loading="scope.row.deleteLoading" plain @click="handleDelete(scope.row)">
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
  name: 'BangumiList',
  components: {
    HeaderMenu,
    FooterMenu,
    Pagination
  },
  mixins: [crud],
  data () {
    return {
      currentType: 'bangumi',
      list: []
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
    async handleUpdate (row) {
      const { id, total, current, status, ratings } = row
      this.$set(row, 'updateLoading', true)
      await this.$api.content.UpdateContent(this.currentType, { id, total, current, status, ratings }).then((res) => {
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
      this.$set(row, 'updateLoading', false)
    },
    handleEdit (id) {
      this.$router.push({
        name: 'ContentEdit',
        params: { id },
        query: { type: this.currentType }
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
     * 过滤状态
     */
    filterStatus (value, row) {
      return row.status === value
    },
    /**
     * 过滤前台是否展示
     * @param {Number} value 选中的状态
     * @param {Object} row 行数据
     */
    filterShow (value, row) {
      return row.is_show === value
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
.bangumi {
  .el-image {
    display: block;
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
}

.el-input-number--small {
  width: 100px;
  margin-right: 5px;
}
</style>
