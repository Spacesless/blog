<template>
  <div class="comment-item">
    <div class="clearfix">
      <div class="comment-avatar">
        <a v-if="data.website" :href="data.website" target="_blank" rel="noopener noreferrer" :title="data.website">
          <el-image class="comment-avatar__picture" :src="getAvatar(data)">
            <div slot="error" class="image-slot">
              <span class="el-icon-picture-outline" />
            </div>
          </el-image>
        </a>
        <el-image v-else class="comment-avatar__picture" :src="getAvatar(data)">
          <div slot="error" class="image-slot">
            <span class="el-icon-picture-outline" />
          </div>
        </el-image>
      </div>
      <div class="comment-info">
        <p class="comment-info-name">{{ data.name }}<span v-if="data.is_admin" class="comment-info__admin">管网站的</span></p>
        <div class="comment-info-content">
          <span v-if="data.type === 3" class="comment-info-content__replyname">@{{ data.reply_name }}</span>
          <span class="comment-info-content__text">{{ data.content }}</span>
        </div>
        <div class="comment-info-operate">
          <span class="comment-info__time">{{ data.addtime }}</span>
          <span v-if="data.id === replyData.id" class="comment-info-btn" @click="handleCancel">
            <span class="el-icon-close" />取消
          </span>
          <span v-else class="comment-info-btn" @click="handleReply">
            <span class="el-icon-chat-line-round" />回复
          </span>
        </div>

        <comment-reply v-if="data.id === replyData.id" ref="textArea" :info="info" :reply-data="replyData" />
      </div>
    </div>

    <div v-if="data.children" class="comment-tree">
      <comment-item
        v-for="child in data.children"
        :key="child.id"
        :info="info"
        :data="child"
        :reply-data="replyData"
      />
    </div>
  </div>
</template>

<script>
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
    replyData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tree: null
    }
  },
  mounted() {
    let parent = this.$parent
    while (parent && !parent.isTreeRoot) {
      parent = parent.$parent
    }
    this.tree = parent
  },
  methods: {
    async handleReply() {
      this.tree.updateReplyData(this.data)
    },
    handleCancel() {
      this.tree.resetReplyData()
    },
    getAvatar({ id, email }) {
      if (email.toLowerCase().includes('@qq.com')) {
        const qquin = email.split('@')[0]
        return `http://q1.qlogo.cn/g?b=qq&s=100&nk=${qquin}`
      } else {
        return `/static/img/comment/${id % 10}.jpg`
      }
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
    margin-bottom: 15px;
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
      background-color: var(--bg-secondary);
      text-align: center;
      line-height: 50px;
    }
  }
  &-info{
    overflow: hidden;
    &-name{
      margin-bottom: 5px;
      font-size: 13px;
      line-height: 22px;
    }
    &__admin{
      display: inline-block;
      height: 22px;
      margin-left: 5px;
      padding: 0 6px;
      background: #ecf5ff;
      color: var(--color-primary);
      border-radius: 4px;
    }
    &-content{
      margin-bottom: 8px;
      padding: 7px 12px;
      background-color: var(--bg-secondary);
      color: var(--color-main);
      font-size: 15px;
      border-radius: 4px;
      &__replyname{
        display: inline-block;
        margin-right: 5px;
        padding: 3px 6px;
        background: var(--color-primary);
        color: #fff;
        font-size: 12px;
        border-radius: 11px;
      }
    }
    &-operate{
      margin-bottom: 20px;
      font-size: 13px;
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
