<template>
  <!-- link start -->
  <div class="link">
    <h1 class="tl__title">友情链接</h1>
    <div class="hitokoto">
      <span class="hitokoto__title">愿以一朵花的姿态行走世间，看得清繁华却不在心中留下痕迹，花开成景，花落成诗。</span>
    </div>
    <el-row class="link-wrap" :gutter="16">
      <el-col v-for="item in linkList" :key="item.id" :sm="12" :md="8" :lg="6">
        <a class="link-item" :href="item.website" :title="item.name" target="_blank" rel="noopener noreferrer">
          <div class="link-logo">
            <el-image class="link-logo__picture" :src="item.logo">
              <div slot="error" class="image-slot">
                <i class="tl-icon">&#xe695;</i>
              </div>
            </el-image>
          </div>
          <div class="link-info">
            <p class="link-info__name">{{ item.name }}</p>
            <p class="link-info__desc">{{ item.description }}</p>
          </div>
        </a>
      </el-col>
    </el-row>
    <div class="link-tips tl-card">
      <h2 class="tl-card__title link-tips__title">友链要求</h2>
      <p>1、优先考虑博客类、ACG、国风相关的网站</p>
      <p>2、需有原创内容，内容积极向上，如有广告需适量</p>
      <p>3、不定期检查链接(๑＞ڡ＜)☆，长时间打不开的站会被删掉的，如要恢复请打call</p>
      <p>4、申请前先添加本站为友链的最好不过了，能拉满成功率</p>
      <p>5、ฅ^ω^ฅ 各位大神、二次元小伙伴可大幅降低以上要求，如不嫌弃随时欢迎入驻</p>
      <!--<p>6、如果看到这，请忽略上述要求</p>-->
      <h2 class="tl-card__title link-tips__title">申请方式</h2>
      <p>可以通过邮件、留言评论等方式申请，格式如下：</p>
      <p>名称：Timeless's博客</p>
      <p>描述：花开成景，花落成诗 <span>可选</span></p>
      <p>网址：https://www.timelessq.com</p>
      <p>头像/Logo：https://www.timelessq.com/static/avatar.jpg <span>可选</span></p>
    </div>
    <!-- comment start -->
    <Comment :topic-id="'link'" />
  </div>
</template>

<script>
import Comment from '#/components/Comment'
import { pageMeta } from '@/mixins'

export default {
  components: {
    Comment
  },
  mixins: [pageMeta],
  async asyncData({ $axios }) {
    const linkList = await $axios.$get('/link')
    return { linkList }
  },
  data() {
    return {
      pageName: '友情链接'
    }
  }
}
</script>

<style lang="scss" scoped>
.link{
  color: var(--color-text);
  font-size: 15px;
  line-height: 2;
  &-item{
    display: block;
    padding: 10px;
    margin-bottom: $grid-space;
    background-color: var(--bg-normal);
    border-top: 3px solid var(--color-primary);
    color: var(--color-text);
    border-radius: 4px;
    box-shadow: $shadow-3-down;
    transition: all 0.3s;
    &:hover{
      transform:translateY(-5px);
    }
  }
  &-logo{
    overflow: hidden;
    float: left;
    width: 65px;
    height: 65px;
    background-color: var(--bg-normal);
    border-radius: 50%;
    &__picture{
      display: block;
      width: 65px;
      height: 65px;
      font-size: 22px;
      line-height: 65px;
      text-align: center;
    }
  }
  &-info{
    overflow: hidden;
    padding-left: 10px;
    &__name{
      font-size: 16px;
      line-height: 22px;
      color: var(--color-primary);
    }
    &__desc{
      overflow: hidden;
      height: 42px;
      font-size: 13px;
      line-height: 1.6em;
    }
  }
  &-tips{
    padding: 20px 15px;
    padding-top: 1px;
    margin-bottom: $grid-space;
    &__title{
      margin-top: $grid-space;
    }
    span {
      margin-left: 15px;
      color: #F56C6C;
    }
  }
}
</style>
