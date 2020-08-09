<template>
  <div class="about">
    <div class="about-introduce">
      <h1 class="about__title">关于本站</h1>
      <p>本站是个人网站，用来记录工作经验以及生活点滴，主要关注web开发、二次元等方面，用爱发电。</p>
      <p>部分内容(图片、视频)来源于互联网，如果有侵权内容、不妥之处，请联系我删除。</p>
      <h2 class="app-main__title">建站历程</h2>
      <p>服务器：腾讯云学生服务器（1C2G3M）</p>
      <p>内容分发服务：腾讯云CDN，每月白嫖10G够用了，反正没啥流量</p>
      <p>对象储存服务：腾讯云COS，每月存储50G + 流量10G，存个静态文件啥的</p>
      <p>后台：Thinkjs + Vue-element-admin</p>
      <p>前台：Thinkjs + Nuxt</p>
      <el-timeline class="about-introduce-timeline">
        <el-timeline-item timestamp="2020-06-01" placement="top">
          <el-card>
            <p>使用nuxt.js代替nunjucks实现同构渲染</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2019-11-10" placement="top">
          <el-card>
            <p>使用thinkjs(nodejs)进行完全重构</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018-10-19" placement="top">
          <el-card>
            <p>后台更换为Metinfo米拓CMS，重新开发主题</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018-03-02" placement="top">
          <el-card>
            <p>使用Wordpress做的网站上线</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <h2 class="app-main__title">未来计划</h2>
      <p>后面看看要不要换egg.js自己写下，并不是thinkjs不好(thinkjs封装了很多，很大程度提高了开发速度)，只想多练下手</p>
      <h2 class="app-main__title">关于站长</h2>
      <p>Timeless</p>
      <p>大区：广州</p>
      <p>等级：24级萌新</p>
      <p>职业：练习时长2年半的前端小白</p>
      <p>爱好：ACG(动漫偏国动、游戏不怎么玩了)、旅行、爬山、看电影，以及和计算机有关的东西（包括但不限于编程）</p>
      <div class="about-connact">
        <a class="about-connact__links" href="https://space.bilibili.com/315883644/favlist" rel="noopener noreferrer" target="_blank">
          <i class="tl-icon">&#xe75e;</i>bilibili
        </a>
        并不是阿婆主，不过可以看看收藏~
        <img class="about-connact__image" src="@/assets/image/about.png" alt="">
      </div>
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
  computed: {
    ...mapGetters(['configs'])
  },
  head() {
    const { sitename, keywords, description } = this.configs
    return {
      title: `关于本站 - ${sitename}`,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'keyword', name: 'keyword', content: keywords }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.about{
  &-introduce{
    font-size: 15px;
    line-height: 2;
    color: #303133;
    &-timeline{
      margin-top: 15px;
    }
  }
  &__title{
    font-size: 32px;
    font-weight: normal;
    line-height: 1.5;
    padding: 30px 0;
  }
  &-connact{
    &__links{
      vertical-align: middle;
      display: inline-block;
      padding: 5px 12px;
      border: 1px solid #dcdfe6;
      color: #606266;
      border-radius: 4px;
      line-height: 1;
      &:hover{
        border-color: $primary;
        color: $primary;
        background-color: #ecf5ff;
      }
    }
    &__image{
      vertical-align: middle;
      display: inline-block;
      height: 100px;
      margin-left: 10px;
    }
  }
}
</style>
