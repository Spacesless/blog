<template>
  <div class="app-container">
    <el-form
      ref="form"
      v-loading="fetchLoading"
      :model="formData"
      :rules="rules"
      :label-position="device === 'desktop' ? 'left' : 'top'"
      label-width="100px"
      class="form-container is-stick"
    >
      <el-form-item label="所属栏目" prop="category_id">
        <el-cascader
          v-model="formData.category_id"
          :options="categoryOptions"
          :props="{
            checkStrictly: true,
            emitPath: false
          }"
          placeholder="请选择栏目"
          clearable
        />
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-input v-model="formData.title" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="封面图片">
        <upload-image :file-list.sync="fileList" />
      </el-form-item>

      <component :is="paramComponent" :params="formData" :file-list="fileList" />

      <div class="form-item">
        <Tinymce ref="editor" v-model="formData.content" :height="600" />
      </div>
      <el-form-item class="form-title">
        其它设置
      </el-form-item>
      <el-form-item label="前台显示">
        <el-radio-group v-model="formData.is_show">
          <el-radio :label="1">
            显示
          </el-radio>
          <el-radio :label="0">
            隐藏
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发布时间" prop="addtime">
        <el-date-picker
          v-model="formData.addtime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择发布时间"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="updatetime">
        <el-date-picker
          v-model="formData.updatetime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择更新时间"
        />
      </el-form-item>
      <el-form-item v-if="isEdit" label="访问量">
        <el-input v-model="formData.hits" readonly class="form-container-input" />
      </el-form-item>
      <el-form-item class="form-title">
        SEO信息
      </el-form-item>
      <el-form-item label="文章关键词">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-input v-model="formData.keywords" />
          </el-col>
          <el-col :sm="24" :md="12">
            <span style="margin-left: 15px;">多个关键词请用“|”或“，”隔开。</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描述文字">
        <el-input v-model="formData.description" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="Tag标签">
        <el-tag
          v-for="tag in tags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleDeleteTag(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputTag"
          class="input-new-tag"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" @click="showTagInput">
          + 新标签
        </el-button>
      </el-form-item>
      <div class="stick-bottom">
        <el-button type="warning" icon="el-icon-close" plain @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" icon="el-icon-check" :loading="confirmLoading" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BangumiParam from './parameter/BangumiParam'
import UploadImage from '@/components/Upload/index'
import Tinymce from '@/components/Tinymce'
import { getPathName } from '@/utils'
import { parseTime } from '#/utils'

export default {
  components: {
    UploadImage,
    Tinymce,
    BangumiParam
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      default: () => []
    },
    categoryOptions: {
      type: Array,
      default: () => []
    },
    currentCategory: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      formData: {},
      fileList: [],
      tags: [],
      inputVisible: false,
      inputTag: '',
      fetchLoading: false,
      confirmLoading: false,
      rules: {
        category_id: [{ required: true, message: '请选择栏目', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        addtime: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        updatetime: [{ required: true, message: '请选择更新时间', trigger: 'change' }],
        showtime: [{ required: true, message: '请选择放映时间', trigger: 'change' }],
        total: [{ required: true, message: '请输入总集数', trigger: 'blur' }],
        current: [{ required: true, message: '请输入追剧进度', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['userinfo', 'device']),
    currentType () {
      return this.$route.query && this.$route.query.type
    },
    paramComponent () {
      const moduleEnum = {
        bangumi: 'BangumiParam'
      }
      return moduleEnum[this.currentType] || ''
    }
  },
  created () {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.formData = {
        category_id: this.currentCategory,
        addtime: new Date(),
        updatetime: new Date(),
        is_show: 1,
        author: this.userinfo.nickname,
        status: 1,
        ratings: 8
      }
    }
  },
  methods: {
    async fetchData (id) {
      this.fetchLoading = true
      await this.$api.content.GetContent(this.currentType, id).then((res) => {
        this.formData = res.data
        const { imgurl, tag } = this.formData
        if (imgurl) {
          const { basename } = getPathName(imgurl)
          this.fileList = [{
            name: basename,
            url: imgurl
          }]
        }
        this.tags = tag ? tag.split('|') : []
      }).catch(() => {})
      this.fetchLoading = false
    },
    /**
     * 删除tag标签
     * @param {String} tag
     */
    handleDeleteTag (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    showTagInput () {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    handleInputConfirm () {
      const inputTag = this.inputTag
      if (inputTag) {
        this.tags.push(inputTag)
      }
      this.inputVisible = false
      this.inputTag = ''
    },
    handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (!valid) { return }
        this.confirmLoading = true
        const { addtime, updatetime } = this.formData
        const postData = {
          ...this.formData,
          addtime: parseTime(addtime),
          updatetime: parseTime(updatetime),
          imgurl: this.fileList.length ? this.fileList[0].url : '',
          tag: this.tags.join('|'),
          word_count: this.$refs.editor?.getWordCount() || 0
        }

        const SubmitHandler = this.isEdit ? this.$api.content.UpdateContent : this.$api.content.CreateContent
        await SubmitHandler(this.currentType, postData).then((res) => {
          this.$message({
            type: 'success',
            message: this.isEdit ? '更新成功' : '添加成功'
          })
          this.$store.commit('list/SET_UPDATELIST', this.currentType)
          this.handleCancel()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: this.isEdit ? '更新失败' : '添加失败'
          })
        })
        this.confirmLoading = false
      })
    },
    handleCancel () {
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.$router.push({ name: this.currentType.charAt(0).toUpperCase() + this.currentType.slice(1) + 'List' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  height: 32px;
  padding-top: 0;
  padding-bottom: 0;
  margin-left: 10px;
  line-height: 30px;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
