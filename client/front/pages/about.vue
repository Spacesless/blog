<template>
  <div class="about">
    <h1 class="tl__title">关于</h1>
    <div class="hitokoto">
      <span class="hitokoto__title">
        生活总是两难，再多执着，再多不肯，最终不得不学会接受，从哭着控制，到笑着对待，到头来不过是一场随遇而安。<br>
        别想太多，一切都会过去的。
      </span>
    </div>

    <div class="about-introduce content">
      <div class="content-wrap">
        <div class="content-right">
          <!-- 文章目录 -->
          <Catalog v-if="isLoaded" />
        </div>
        <div id="js-content" class="markup content-left">
          <h2>My Life</h2>
          <p>这是一个自个开发的小破站，用来记录工作经验以及生活点滴，虽说现在文章不多就是了，因为总想着改代码、加功能而不是写文章 doge。不过只要还感兴趣，网站肯定会坚持做下去的。</p>
          <p>Hi 👋, I'm Timeless</p>
          <p>大区：广州郊区</p>
          <p>职业：练习时长3年半的前端开发</p>
          <p>爱好：Web开发、看动画、徒步、旅游、爬山(以及一切有趣的事物)</p>
          <p>梦想：前端工程师 || 全栈工程师 || 自由职业者</p>
          <h2>网站历史</h2>
          <h3>2018年</h3>
          <h4>1月</h4>
          <ul>
            <li>最开始有建站的想法</li>
            <li>2018-01-14，注册了timelessq.com域名</li>
          </ul>
          <h4>3月</h4>
          <ul>
            <li>2018-03-06，在腾讯云购买了学生云服务器</li>
            <li>2018-03-10，使用wordpress搭建的网站上线</li>
            <li>2018-03-22，添加内容分发服务：腾讯云CDN（每月白嫖10G够用了，反正没啥流量）</li>
          </ul>
          <h4>4月</h4>
          <ul>
            <li>2018-04-25，域名ICP备案成功</li>
            <li>2018-04-26，域名公网安备完成</li>
          </ul>
          <h3>2019年</h3>
          <h4>8月</h4>
          <ul>
            <li>2019-08-10，使用nodejs(thinkjs)代替php进行完全重构</li>
            <li>2019-08-16，后台使用ThinkJS + Vue-element-admin开发完成</li>
            <li>2019-08-28，使用对象储存服务：腾讯云COS（每月存储50G + 流量10G，存个静态文件啥的）</li>
          </ul>
          <h4>10月</h4>
          <ul>
            <li>2019-10-15，使用nodejs开发的Api站点<a href="https://api.timelessq.com" target="_blank">https://api.timelessq.com</a>上线</li>
          </ul>
          <h3>2020年</h3>
          <h4>6月</h4>
          <ul>
            <li>2020-06-01，使用nuxt.js代替nunjucks模板引擎实现同构渲染</li>
            <li>2020-06-19，根据lighthouse进行性能优化</li>
          </ul>
          <h3>2021年</h3>
          <h4>9月 - 10月</h4>
          <ul>
            <li>2021-09-12，腾讯云服务器到期，更换为轻量应用服务器（2C4G8M）</li>
            <li>2021-10-06，后台管理系统由vue-cli改成nuxt.js，前后端合并到一个项目</li>
            <li>2021-10-18，前台使用 ThinkJS + NuxtJs + Element-ui 开发完成</li>
          </ul>
          <h2>未来计划</h2>
          <ul>
            <li>新增追番剧进度模块</li>
            <li>统一用nuxt管理前台、内容管理系统</li>
            <li>网站性能优化</li>
            <li>新增暗黑模式</li>
            <li>自己写一个评论系统</li>
            <li>新增文章归档页面</li>
            <li>新增个性化404页面</li>
            <li>升级到Nuxt@3版本</li>
            <li>优化Api附属站，小工具</li>
            <li>尝试使用Egg.js重写服务端</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- comment start -->
    <Comment :topic-id="'about'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Catalog from '@/components/Catalog'
import Comment from '#/components/Comment'
import { pageMeta } from '@/mixins'

export default {
  components: {
    Catalog,
    Comment
  },
  mixins: [pageMeta],
  data() {
    return {
      pageName: '关于本站',
      isLoaded: false
    }
  },
  computed: {
    ...mapGetters(['configs'])
  },
  mounted() {
    this.$nextTick(() => {
      this.isLoaded = true
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/content.scss';

.about{
  &-introduce{
    padding-top: 0;
    margin-bottom: $grid-space;
    background-color: var(--bg-normal);
    box-shadow: $shadow-3-down;
    border-radius: $border-radius;
  }
}
</style>
