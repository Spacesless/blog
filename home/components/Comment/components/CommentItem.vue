<template>
  <div class="comment-item">
    <div class="clearfix">
      <div class="comment-avatar">
        <el-image :src="getAvatar(data.id, data.email)" />
      </div>
      <div class="comment-info">
        <div class="comment-oparate">
          <span class="comment-name">{{ data.nickname }}</span>
          <span>{{ data.addtime }}</span>
          <i class="el-icon-chat-line-round" @click="handleReply" />
        </div>
        <div class="comment-content">{{ data.content }}</div>
      </div>
    </div>
    <comment-reply v-if="data.id === isReply" ref="textArea" :info="info" :parentid="data.id" :respond="respond" />

    <div v-if="data.children" class="comment-tree">
      <comment-item
        v-for="child in data.children"
        :key="child.id"
        :info="info"
        :data="child"
        :is-reply="isReply"
        @onreply="handleReply"
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
    isReply: {
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
      this.$emit('onreply', id)
      await this.$nextTick()
      this.respond = `@${nickname}`
    },
    getAvatar(id, email) {
      if (email.toLowerCase().includes('@qq.com')) {
        const qquin = email.split('@')[0]
        return `http://q1.qlogo.cn/g?b=qq&s=100&nk=${qquin}`
      } else {
        const domains = ['//www.gravatar.com', '//0.gravatar.com', '//1.gravatar.com', '//secure.gravatar.com']
        const emailHash = md5(email)
        return `${domains[id % 3] || domains[0]}/avatar/${emailHash}`
      }
    }
  }
}
</script>

