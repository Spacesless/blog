<template>
  <div class="comment-item">
    <div class="clearfix">
      <div class="comment-avatar">
        <a :href="data.webSite" target="_blank" rel="noopener noreferrer">
          <el-image class="comment-avatar__picture" :src="getAvatar(data.id, data.email)" />
        </a>
      </div>
      <div class="comment-info">
        <p class="comment-info__name">{{ data.nickname }}</p>
        <div class="comment-info__content">{{ data.content }}</div>
        <div class="comment-info-operate">
          <span class="comment-info__time">{{ data.addTime }}</span>
          <span v-if="data.id === replyId" class="comment-info-btn" @click="handleCancel">
            <i class="el-icon-close" />取消
          </span>
          <span v-else class="comment-info-btn" @click="handleReply">
            <i class="el-icon-chat-line-round" />回复
          </span>
        </div>
      </div>
    </div>
    <comment-reply v-if="data.id === replyId" ref="textArea" :info="info" :parentid="data.id" :respond="respond" />

    <div v-if="data.children" class="comment-tree">
      <comment-item
        v-for="child in data.children"
        :key="child.id"
        :info="info"
        :data="child"
        :reply-id.sync="replyId"
      />
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import CommentReply from './CommentReply'

export default {
  name: 'CommentItem',
  components: { CommentReply },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    },
    replyId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      respond: ''
    }
  },
  methods: {
    async handleReply() {
      const { id, nickname } = this.data
      this.$emit('update:replyId', id)
      await this.$nextTick()
      this.respond = `@${nickname}`
    },
    getAvatar(id, email) {
      if (email.toLowerCase().includes('@qq.com')) {
        const qquin = email.split('@')[0]
        return `http://q1.qlogo.cn/g?b=qq&s=100&nk=${qquin}`
      } else {
        const domains = ['//www.gravatar.com', '//0.gravatar.com', '//1.gravatar.com', '//cn.gravatar.com']
        const emailHash = md5(email)
        return `${domains[id % 4] || domains[0]}/avatar/${emailHash}?s=50&d=http://cdn.timelessq.com/static/comment/${id % 10}.jpg`
      }
    },
    handleCancel() {
      this.$emit('onCancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.comment{
  &-tree{
    padding-left: 65px;
  }
  &-item{
    margin-bottom: 20px;
  }
  &-avatar{
    overflow: hidden;
    float: left;
    width: 50px;
    height: 50px;
    margin-right: 15px;
    border-radius: 50%;
    &__picture{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  &-info{
    overflow: hidden;
    &__name{
      margin-bottom: 8px;
      font-size: 14px;
      color: #606266;
    }
    &__content{
      margin-bottom: 8px;
      padding: 7px 12px;
      background-color: #f4f6fb;
      color: #303133;
      font-size: 15px;
      border-radius: 2px;
    }
    &-operate{
      margin-bottom: 20px;
      font-size: 13px;
      color: #606266;
    }
    &__time{
      margin-right: 10px;
    }
    &-btn{
      cursor: pointer;
      i {
        margin-right: 3px;
      }
      &:hover{
        color: #409EFF;
      }
    }
  }
}
</style>
