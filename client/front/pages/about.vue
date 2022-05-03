<template>
  <div class="about">
    <h1 class="tl__title">关于本站</h1>
    <div class="hitokoto">
      <span class="hitokoto__title">
        生活总是两难，再多执着，再多不肯，最终不得不学会接受，从哭着控制，到笑着对待，到头来不过是一场随遇而安。<br>
        别想太多，一切都会过去的。
      </span>
    </div>
    <div class="about-introduce">
      <p>这是一个自个开发的小破站，用来记录工作经验以及生活点滴，虽说现在文章不多就是了，因为总想着改代码、加功能而不是写文章 doge。不过只要还感兴趣，网站肯定会坚持做下去的。</p>
      <p>昵称：Timeless</p>
      <p>大区：广州郊区</p>
      <p>职业：练习时长3年半的前端开发，会一丢丢后端</p>
      <p>喜好：<s>唱、跳、rap</s> 计算机相关、看动画、旅游、爬山等，以及一些未知的事物</p>
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
      <p>内容分发服务：腾讯云CDN（每月白嫖10G够用了，反正没啥流量）</p>
      <p>对象储存服务：腾讯云COS（每月存储50G + 流量10G，存个静态文件啥的）</p>
      <p>后台：ThinkJS + Vue-element-admin</p>
      <p>前台：ThinkJS + NuxtJs + Element-ui</p>
      <el-timeline class="about-timeline">
        <el-timeline-item timestamp="2020-06-01" placement="top">
          <div class="about-timeline-card">
            <p>使用nuxt.js代替nunjucks模板引擎实现SSR</p>
          </div>
        </el-timeline-item>
        <el-timeline-item timestamp="2019-10-15" placement="top">
          <div class="about-timeline-card">
            <p>
              使用nodejs开发的Api站点
              <a class="about-timeline__link" href="https://api.timelessq.com" target="_blank">https://api.timelessq.com</a>
              上线
            </p>
          </div>
        </el-timeline-item>
        <el-timeline-item timestamp="2019-08-10" placement="top">
          <div class="about-timeline-card">
            <p>使用nodejs(thinkjs)代替php进行完全重构</p>
          </div>
        </el-timeline-item>
        <el-timeline-item timestamp="2018-03-02" placement="top">
          <div class="about-timeline-card">
            <p>使用Wordpress搭建的博客上线</p>
          </div>
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
import Comment from '#/components/Comment'
import { pageMeta } from '@/mixins'

export default {
  components: {
    Comment
  },
  mixins: [pageMeta],
  data() {
    return {
      pageName: '关于本站'
    }
  },
  computed: {
    ...mapGetters(['configs'])
  }
}
</script>

<style lang="scss" scoped>
.about{
  color: var(--color-text);
  font-size: 15px;
  line-height: 2;
  &-introduce{
    padding: $grid-space;
    margin-bottom: $grid-space;
    background-color: var(--bg-normal);
    border-radius: 4px;
    &-timeline{
      margin-top: $grid-space;
    }
  }
  &-timeline {
    padding-top: $grid-space;
    &-card{
      color: var(--color-text);
    }
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
      border: 1px solid var(--border-color);
      color: var(--color-text);
      line-height: 1;
      vertical-align: middle;
      border-radius: 4px;
      &:hover{
        border-color: var(--color-primary);
        background-color: var(--bg-normal);
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
