<template>
  <el-form ref="form" class="reply" :model="formData" :rules="rules">
    <el-row :gutter="10">
      <el-col :sm="24" :md="8">
        <el-form-item prop="name">
          <el-input v-model="formData.name" placeholder="昵称" clearable />
        </el-form-item>
      </el-col>
      <el-col :sm="24" :md="8">
        <el-form-item prop="email">
          <el-input v-model="formData.email" placeholder="邮箱（不会告诉别人的）" clearable />
        </el-form-item>
      </el-col>
      <el-col :sm="24" :md="8">
        <el-form-item prop="website">
          <el-input v-model="formData.website" placeholder="网址 http(s)://" clearable />
        </el-form-item>
      </el-col>
      <el-col class="reply-content" :span="24">
        <el-form-item prop="content">
          <el-input
            ref="textarea"
            v-model="formData.content"
            class="reply-content-input"
            type="textarea"
            :rows="5"
            maxlength="500"
            show-word-limit
            resize="none"
            placeholder="What do you want to say..."
            @blur="onTextareaBlur"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="isShowPreview" :span="24">
        <div class="reply-preview" v-html="previewHtml" />
      </el-col>
      <el-col class="reply-toolbar" :span="24">
        <Emojis ref="emoji" @selectEmojis="onSelectEmojis" />
        <svg
          class="reply-toolbar__icon"
          :class="{'reply-toolbar__icon--active': isShowPreview}"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="17688"
          width="22"
          height="22"
          @click="isShowPreview = !isShowPreview"
        >
          <path d="M502.390154 935.384615a29.538462 29.538462 0 1 1 0 59.076923H141.430154C79.911385 994.461538 29.538462 946.254769 29.538462 886.153846V137.846154C29.538462 77.745231 79.950769 29.538462 141.390769 29.538462h741.218462c61.44 0 111.852308 48.206769 111.852307 108.307692v300.268308a29.538462 29.538462 0 1 1-59.076923 0V137.846154c0-26.899692-23.355077-49.230769-52.775384-49.230769H141.390769c-29.420308 0-52.775385 22.331077-52.775384 49.230769v748.307692c0 26.899692 23.355077 49.230769 52.775384 49.230769h360.999385z" p-id="17689" />
          <path d="M196.923077 216.615385m29.538461 0l374.153847 0q29.538462 0 29.538461 29.538461l0 0q0 29.538462-29.538461 29.538462l-374.153847 0q-29.538462 0-29.538461-29.538462l0 0q0-29.538462 29.538461-29.538461Z" p-id="17690" /><path d="M649.846154 846.769231a216.615385 216.615385 0 1 0 0-433.230769 216.615385 216.615385 0 0 0 0 433.230769z m0 59.076923a275.692308 275.692308 0 1 1 0-551.384616 275.692308 275.692308 0 0 1 0 551.384616z" p-id="17691" />
          <path d="M807.398383 829.479768m20.886847-20.886846l0 0q20.886846-20.886846 41.773692 0l125.321079 125.321079q20.886846 20.886846 0 41.773693l0 0q-20.886846 20.886846-41.773693 0l-125.321078-125.321079q-20.886846-20.886846 0-41.773693Z" p-id="17692" />
        </svg>
        <el-button
          class="reply-toolbar__submit"
          type="primary"
          icon="el-icon-position"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          提交评论
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Emojis from './Emojis'

export default {
  name: 'CommentReply',
  components: {
    Emojis
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    submitComment: {
      type: Function,
      default: () => {}
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const validateEmail = (rule, value, callback) => {
      if (!this.isAdmin && value === '804093032@qq.com') {
        callback(new Error('请不要拿站长的破邮箱来充数哦'))
      } else {
        callback()
      }
    }
    return {
      tree: null,
      submitLoading: false,
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请输入昵称' },
          { max: 50, trigger: ['change', 'blur'], message: '昵称太长了' }
        ],
        email: [
          { required: true, message: '要不留个邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: ['change', 'blur'] },
          { max: 255, trigger: ['change', 'blur'], message: '邮箱地址有那么多字嘛' },
          { trigger: 'change', validator: validateEmail }
        ],
        website: [
          { type: 'url', message: '噫，这个网址好像不对哦', trigger: 'change' },
          { max: 255, trigger: ['change', 'blur'], message: '网址有那么多字嘛' }
        ],
        content: [
          { required: true, trigger: 'blur', message: '确定不说点什么?' },
          { max: 500, trigger: ['change', 'blur'], message: '只能输入500个字哦' }
        ]
      },
      selectionStart: 0,
      isShowPreview: false
    }
  },
  computed: {
    previewHtml () {
      return this.formatContent()
    },
    emojiList () {
      return this.$refs.emoji.emojis
    }
  },
  methods: {
    /**
     * @event 选中表情
     * @param {String} emojis 表情名称
     */
    onSelectEmojis (emojis) {
      const content = this.formData.content || ''
      this.formData.content = `${content.slice(0, this.selectionStart)} :${emojis}: ${content.slice(this.selectionStart)}`
    },
    /**
     * @event 评论输入框拾取焦点
     * @param {Event} e
     * @summary 获取输入光标位置
     */
    onTextareaBlur (e) {
      this.selectionStart = e.target.selectionStart
    },
    // 格式化表情展示
    formatContent () {
      return this.formData.content.replace(/:((?!:).)*:/g, (emojis) => {
        const [prefix, ...name] = emojis.replace(/:/g, '').split('_')

        const findEmojis = this.emojiList.find(item => item.prefix.includes(prefix))
        if (findEmojis) {
          return `<img class="emojis" src="${findEmojis.url}/${findEmojis.prefix}${name.join('_')}.${findEmojis.type}" alt="${findEmojis.prefix}${name.join('_')}" >`
        }
        return emojis
      })
    },
    handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (!valid) { return }

        this.submitLoading = true
        const content = this.formatContent()
        await this.submitComment(content).catch(() => {})
        this.submitLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.reply {
  &-content {
    ::v-deep .el-textarea__inner {
      padding-right: 66px;
      font-family: Quicksand, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    }
  }

  &-toolbar {
    position: relative;
    height: 32px;

    ::v-deep &__icon {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      color: var(--color-text);
      cursor: pointer;
      outline: none;
      fill: currentcolor;

      &--active {
        color: var(--color-primary);
      }
    }

    &__submit {
      position: absolute;
      right: 5px;
    }
  }

  &-preview {
    padding: 5px 15px;
    margin-bottom: 18px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--color-text);
    white-space: pre-line;
    border: 1px solid rgba(#C0C4CC, .6);
    border-radius: 4px;
  }
}
</style>
