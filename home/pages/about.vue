<template>
  <div class="about">
    <div class="about-introduce">
      <h1 class="about__title">关于本站</h1>
      <p>本站是个人网站，用来记录工作经验以及生活点滴，主要关注web开发、二次元等方面，用爱发电。</p>
      <p>部分内容(图片、视频)来源于互联网，如果有侵权内容、不妥之处，请联系我删除。</p>
      <p>Timeless</p>
      <p>大区：广州</p>
      <p>职业：练习时长2年半的前端开发</p>
      <div class="about-connact">
        <a class="about-connact__links" href="https://space.bilibili.com/315883644/favlist" rel="noopener noreferrer" target="_blank">
          <i class="tl-icon">&#xe75e;</i>Bilibili
        </a>
        <a class="about-connact__links" href="https://github.com/spacesless" rel="noopener noreferrer" target="_blank">
          <i class="tl-icon">&#xe620;</i>Github
        </a>
      </div>
      <h2 class="app-main__title">建站历程</h2>
      <p>服务器：腾讯云学生服务器（1C2G3M）</p>
      <p>内容分发服务：腾讯云CDN，每月白嫖10G够用了，反正没啥流量</p>
      <p>对象储存服务：腾讯云COS，每月存储50G + 流量10G，存个静态文件啥的</p>
      <p>后台：ThinkJS + Vue-element-admin</p>
      <p>前台：ThinkJS + NuxtJs + Element-ui</p>
      <el-timeline class="about-timeline">
        <el-timeline-item timestamp="2020-06-01" placement="top">
          <el-card>
            <p>使用nuxt.js代替nunjucks模板引擎实现SSR</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2019-10-15" placement="top">
          <el-card>
            <p>使用nodejs开发的Api站点<a class="about-timeline__link" href="https://api.timelessq.com" target="_blank">https://api.timelessq.com</a>上线</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2019-08-10" placement="top">
          <el-card>
            <p>使用nodejs(thinkjs)代替php进行完全重构</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018-03-02" placement="top">
          <el-card>
            <p>使用Wordpress搭建的博客上线</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <h2 class="app-main__title">未来计划</h2>
      <ul>
        <li>1、统一用nuxt管理前台、内容管理系统</li>
        <li>2、研究live2d、spine</li>
      </ul>
    </div>
    <!-- comment start -->
    <Comment :topic-id="'about'" />
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
    color: var(--color-main);
    font-size: 15px;
    line-height: 2;
    &-timeline{
      margin-top: 15px;
    }
  }
  &__title{
    padding: 30px 0;
    font-size: 32px;
    font-weight: normal;
    line-height: 1.5;
  }
  &-timeline {
    padding-top: 15px;
    &__link{
      margin: 0 5px;
      color: var(--color-primary);
    }
  }
  &-connact{
    &__links{
      display: inline-block;
      margin-right: 10px;
      padding: 5px 12px;
      border: 1px solid #dcdfe6;
      line-height: 1;
      vertical-align: middle;
      border-radius: 4px;
      &:hover{
        border-color: var(--color-primary);
        background-color: #ecf5ff;
        color: var(--color-primary);
      }
      .tl-icon{
        margin-right: 3px;
      }
    }
    &__image{
      display: inline-block;
      height: 100px;
      margin-left: 10px;
      vertical-align: middle;
    }
  }
}
</style>
