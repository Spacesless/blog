<template>
  <el-dialog
    class="ablum"
    :visible="visible"
    width="90%"
    append-to-body
    @close="handleCancel"
  >
    <div class="file-header">
      <el-row>
        <el-col :sm="24" :md="12">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumbs"
              :key="index"
            >
              <span v-if="index === breadcrumbs.length - 1">{{ item.name }}</span>
              <span v-else class="redirect" @click="changePath(item.path, index)">{{ item.name }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :sm="24" :md="{span:6,offset:6}">
          <el-input
            v-model="listQuery.keyword"
            clearable
            placeholder="请输入关键字"
            @change="onKeywordInput"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
        </el-col>
      </el-row>
    </div>

    <el-scrollbar class="ablum-scroll" wrap-class="scrollbar-wrapper">
      <el-row v-loading="listLoading" class="file-grid">
        <el-col v-for="(item, index) in fileList" :key="index" :xs="12" :sm="8" :md="6" :xl="4">
          <div
            v-if="item.type === 1"
            class="grid-item folder"
            @click="enterDirectory(item.url)"
          >
            <i class="el-icon-folder" />
            <p>{{ item.name }}</p>
          </div>
          <div
            v-else-if="item.type === 2"
            class="grid-item image"
            :class="{active:item.checked}"
            @click="toggleSelect(item)"
          >
            <el-image :src="item.url" fit="contain">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline-round" />
              </div>
            </el-image>
            <div class="file-info">
              <p class="file-name">{{ item.name }}</p>
              <p class="file-time">{{ item.mtime | timeFilter }}</p>
              <p class="file-size">{{ item.size | sizeFilter }}</p>
            </div>
          </div>
          <div
            v-else
            class="grid-item blob"
            :class="{active:item.checked}"
            @click="toggleSelect(item)"
          >
            <div class="blob-slot">
              <i class="el-icon-document" />
            </div>
            <div class="file-info">
              <p class="file-name">{{ item.name }}</p>
              <p class="file-time">{{ item.mtime | timeFilter }}</p>
              <p class="file-size">{{ item.size | sizeFilter }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
    <div class="file-footer">
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="fecthList"
      />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button plain @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { debounce } from 'lodash-es'
import Pagination from '@/components/Pagination'
import { GetPathList } from '@/api/common'
import { parseTime } from '@/utils'

export default {
  name: 'Upload',
  components: {
    Pagination
  },
  filters: {
    timeFilter(time) {
      return time ? parseTime(time) : ''
    },
    sizeFilter(size) {
      if (!size) {
        return '0 Bytes'
      }
      const unitList = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      let index = 0
      const soureSize = parseFloat(size)
      index = Math.floor(Math.log(soureSize) / Math.log(1024))
      size = soureSize / Math.pow(1024, index)
      size = size.toFixed(2) // 保留的小数位数
      return `${size} ${unitList[index]}`
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      total: 0,
      listLoading: false,
      listQuery: {
        keyword: '',
        page: 1,
        limit: 20
      },
      path: '',
      breadcrumbs: [
        { name: '根目录', path: '' }
      ],
      fileList: [],
      isLazyLoaded: false
    }
  },
  watch: {
    visible(isShow) {
      if (isShow && !this.isLazyLoaded) {
        this.isLazyLoaded = true
        this.fecthList()
      }
    }
  },
  methods: {
    async fecthList() {
      this.listLoading = true
      this.listQuery.path = this.path
      await GetPathList(this.listQuery).then(res => {
        const { data, count } = res.data
        this.fileList = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    },
    /**
     * 更改文件目录
     * @param {String} 目录路径
     * @param {Number [int]} index 所在面包屑菜单下标
     */
    changePath(path, index) {
      this.path = path
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1)
      this.listQuery.page = 1
      this.fecthList()
    },
    onKeywordInput: debounce(function() {
      this.listQuery.page = 1
      this.fecthList()
    }, 200),
    /**
     * 进入目录
     * @param {String} path 目录路径
     */
    enterDirectory(path) {
      this.path = path
      const urlHash = path.split('/')
      this.breadcrumbs.push({
        name: urlHash[urlHash.length - 1],
        path: path
      })
      this.listQuery.page = 1
      this.fecthList()
    },
    toggleSelect(item) {
      if (!item.check) {
        this.$set(item, 'checked', 1)
      } else {
        this.$set(item, 'checked', 0)
      }
    },
    handleCancel() {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      const findSelectFile = this.fileList.filter(item => item.checked)
      this.$emit('onSelectFile', findSelectFile)
      this.handleCancel()
    }
  }
}
</script>

<style lang="scss" scoped>
.ablum{
  ::v-deep .el-dialog{
    height: 90%;
    &__body{
      height: calc(100% - 95px);
      padding: 15px 20px;
    }
  }
  &-scroll{
    height: calc(100% - 95px);
  }
}
.file {
  &-header{
    padding: 0 15px 10px;
    .el-breadcrumb{
      color: #606266;
      line-height: 36px;
      .redirect{
        cursor: pointer;
        &:hover{
          color: #409eff;
        }
      }
    }
  }
  &-grid{
    .el-col{
      padding: 0 15px;
    }
    .grid-item{
      overflow: hidden;
      z-index: 1;
      height: 210px;
      margin-bottom: 15px;
      border: 1px solid #d9ecff;
      background-color: #ecf5ff;
      cursor: pointer;
      border-radius: 4px;
      &.active{
        border-color: #409eff;
        background-color: #d9ecff;
      }
    }
    .folder{
      padding: 60px 0;
      text-align: center;
      .el-icon-folder{
        margin: 10px 0;
        font-size: 28px;
      }
      p{
        margin: 0;
        color: #409eff;
        font-size: 16px;
      }
    }
    .image{
      .el-image{
        display: block;
        height: 135px;
        padding: 5px 10px;
        margin: 0 auto;
      }
    }
    .blob{
      .blob-slot{
        font-size: 28px;
        line-height: 130px;
        text-align: center;
      }
    }
  }
  &-info{
    padding: 5px 10px;
    background-color: #fdf6ec;
    p{
      overflow: hidden;
      margin: 0;
      color: #e6a23c;
      font-size: 14px;
      line-height: 22px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &-time, &-size{
    font-size: 13px;
    color: #909399;
  }
  &-footer{
    line-height: 40px;
    .select{
      padding-top: 18px;
    }
    ::v-deep .pagination-container{
      padding-bottom: 0;
      border: none;
    }
  }
}
</style>
