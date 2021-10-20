<template>
  <div class="comment-item">
    <div class="clearfix">
      <!-- 头像 -->
      <div class="comment-avatar">
        <a
          rel="noopener noreferrer"
          :href="commentData.website ? commentData.website : 'javascript:;'"
          :target="commentData.website ? '__blank' : ''"
          :title="commentData.website"
        >
          <el-image class="comment-avatar__picture" :src="getAvatar(commentData)">
            <div slot="error" class="image-slot">
              <span class="el-icon-picture-outline" />
            </div>
          </el-image>
        </a>
      </div>
      <div class="comment-info">
        <!-- 昵称 -->
        <p class="comment-info-name">{{ commentData.name }}<span v-if="commentData.is_admin" class="comment-info__admin">管网站的</span></p>
        <div class="comment-info-operate">
          <!-- 评论时间 -->
          <span class="comment-info__time">{{ commentData.addtime }}</span>
          <span v-if="commentData.id === replyData.id" class="comment-info-btn" @click="handleCancel">
            <span class="el-icon-close" />取消
          </span>
          <span v-else class="comment-info-btn" @click="handleReply">
            <span class="el-icon-chat-line-round" />回复
          </span>
        </div>
        <!-- 评论内容 -->
        <div class="comment-info-content">
          <span v-if="commentData.type === 3" class="comment-info-content__replyname">@{{ commentData.reply_name }}</span>
          <span class="comment-info-content__text" v-html="commentData.content" />
        </div>
        <!-- 回复 -->
        <comment-reply
          v-if="commentData.id === replyData.id"
          ref="textArea"
          :form-data.sync="formData"
          :submit-comment="submitComment"
        />
      </div>
    </div>
    <!-- 子评论 -->
    <div v-if="commentData.children" class="comment-tree">
      <comment-item
        v-for="child in commentData.children"
        :key="child.id"
        :form-data="formData"
        :comment-data="child"
        :reply-data="replyData"
        :submit-comment="submitComment"
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
    formData: {
      type: Object,
      default: () => {}
    },
    commentData: {
      type: Object,
      default: () => {}
    },
    replyData: {
      type: Object,
      default: () => {}
    },
    submitComment: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    // 回复指定评论
    handleReply() {
      this.tempReplyId = this.replyData.id
      this.$emit('update:replyData', this.commentData)
    },
    // 取消回复
    handleCancel() {
      this.$emit('update:replyData', {
        id: this.tempReplyId
      })
    },
    /**
     * 根据邮箱地址获取头像
     * @param {Number} id 评论ID
     * @param {String} email 邮箱地址
     * @returns {String} 头像图片url地址
     */
    getAvatar({ id, email }) {
      if (email.toLowerCase().includes('@qq.com')) {
        // QQ头像
        const qquin = email.split('@')[0]
        return `http://q1.qlogo.cn/g?b=qq&s=100&nk=${qquin}`
      } else {
        // gravatar镜像
        const gravatarImage = [
          'https://sdn.geekzu.org/avatar/', // 极客族
          'https://gravatar.loli.net/avatar', // Loli源
          'https://cdn.sep.cc/avatar/' // inwao源
        ]
        /**
         * s是大小的意思，r是等级，参数一般是g，d的选项如下
         * 404：如果没有与电子邮件哈希关联的图像，则不加载任何图像，而是返回 HTTP 404 响应
         * mm：一个简单的卡通风格的人物轮廓（不因电子邮件哈希而异）
         * identicon：基于电子邮件哈希的几何图案
         * monsterid：生成的具有不同颜色、面孔等的“怪物”
         * wavatar：生成具有不同特征和背景的人脸
         * retro：生成8位街机风格的像素化面孔
         * blank：透明的PNG图像
         */
        return `${gravatarImage[email.length % 3]}/${md5(email || id)}?s=64&d=retro&r=g`
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
    margin-bottom: 8px;
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
      margin-bottom: 20px;
      padding: 7px 12px;
      border: 1px solid var(--border-color);
      color: var(--color-main);
      font-size: 14px;
      line-height: 1.5;
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
      &__text{
        white-space: pre-line;
      }
    }
    &-operate{
      margin-bottom: 16px;
      font-size: 13px;
    }
    &__time{
      margin-right: 10px;
    }
    &-btn{
      cursor: pointer;
      span {
        margin-right: 3px;
      }
      &:hover{
        color: #409EFF;
      }
    }
  }
}
</style>