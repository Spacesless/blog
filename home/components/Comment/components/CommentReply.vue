<template>
  <div class="comment-reply">
    <el-input ref="textarea" v-model="message" type="textarea" :rows="5" resize="none" placeholder="请输入内容" />
    <div class="reply-tools">
      <el-tooltip class="item" effect="dark" content="表情" placement="top">
        <span ref="OwO" class="reply-tools-icon" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="插入代码" placement="top">
        <span class="reply-tools-icon el-icon-eleme" @click="handleInsertCode" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="插入图片" placement="top">
        <span class="reply-tools-icon el-icon-eleme" @click="handleInsertPicture" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="插入链接" placement="top">
        <span class="reply-tools-icon el-icon-eleme" @click="handleInsertLink" />
      </el-tooltip>
      <el-button type="primary" icon="el-icon-position" @click="handleSubmit">123</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import OwO from 'owo'

export default {
  name: 'CommentReply',
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    parentid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    initOwO() {
      // new OwO({
      //   logo: 'OωO',
      //   container: this.$refs.OwO,
      //   target: this.$refs.textarea,
      //   api: './OwO.json',
      //   position: 'down',
      //   width: '100%',
      //   maxHeight: '250px'
      // })
    },
    handleSubmit() {
      const postData = Object.assign(this.info, {
        parent_id: this.parentid,
        content: this.respond
      })
      axios.post('', postData).then(response => {

      }).catch(error => {
        console.log(error)
      })
    },
    handleInsertCode() {
      this.message += '<pre>\n请输入代码...\n</pre>\n'
    },
    handleInsertPicture() {

    },
    handleInsertLink() {

    }
  }
}
</script>

