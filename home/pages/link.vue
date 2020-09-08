<template>
  <!-- links start -->
  <div class="links">
    <h1 class="links__title">友情链接</h1>
    <el-row class="links-wrap" :gutter="15">
      <el-col v-for="item in linkList" :key="item.id" :sm="12" :md="8" :lg="6" :xl="4">
        <a class="links-item" :href="item.website" :title="item.name" target="_blank">
          <div class="links-logo">
            <el-image class="links-logo__picture" :src="item.logo">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
          <div class="links-info">
            <p class="links-info__name">{{ item.name }}</p>
            <p class="links-info__desc">{{ item.description }}</p>
          </div>
        </a>
      </el-col>
    </el-row>
    <div class="links-tips">
      <h2 class="app-main__title">友链要求</h2>
      <p>1、优先考虑博客类、ACG、国风相关的网站</p>
      <p>2、需有原创内容，内容积极向上，如有广告需适量</p>
      <p>3、不定期检查链接(๑＞ڡ＜)☆，长时间打不开的站会被删掉的，如要恢复请打call</p>
      <p>4、申请前先添加本站为友链的最好不过了，能拉满成功率</p>
      <p>5、ฅ^ω^ฅ 各位大神、二次元小伙伴可大幅降低以上要求，如不嫌弃随时欢迎入驻</p>
      <!--<p>6、如果看到这，请忽略上述要求</p>-->
      <h2 class="app-main__title">申请方式</h2>
      <p>可以通过站内反馈、留言评论等方式申请，格式如下：</p>
      <p>名称：Timeless's博客</p>
      <p>描述：关注web开发、ACG <span>可选</span></p>
      <p>网址：https://www.timelessq.com</p>
      <p>头像/Logo：https://www.timelessq.com/static/avatar.jpg <span>可选</span></p>
    </div>
    <!-- comment start -->
    <Comment />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Comment from '@/components/Comment'

export default {
  components: {
    Comment
  },
  async asyncData({ $axios }) {
    const linkList = await $axios.$get('/link')
    return { linkList }
  },
  computed: {
    ...mapGetters(['configs'])
  },
  head() {
    const { sitename, keywords, description } = this.configs
    return {
      title: `友情链接 - ${sitename}`,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'keyword', name: 'keyword', content: keywords }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.links{
  &__title{
    padding: 30px 0;
    font-size: 32px;
    font-weight: normal;
    line-height: 1.5;
  }
  &-wrap {
    ::v-deep .el-col{
      margin-bottom: 15px;
      transition: transform 0.3s;
      &:hover{
        transform:translateY(-5px);
      }
    }
  }
  &-item{
    display: block;
    padding: 10px;
    border-top: 3px solid $primary;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  &-logo{
    overflow: hidden;
    float: left;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    &__picture{
      display: block;
      width: 65px;
      height: 65px;
    }
  }
  &-info{
    overflow: hidden;
    padding-left: 10px;
    &__name{
      font-size: 16px;
      line-height: 22px;
      color: $primary;
    }
    &__desc{
      overflow: hidden;
      height: 42px;
      color: #606266;
      font-size: 13px;
      line-height: 1.6em;
    }
  }
  &-tips{
    color: #606266;
    font-size: 15px;
    line-height: 2;
    span {
      margin-left: 15px;
      color: #F56C6C;
    }
  }
}
</style>
