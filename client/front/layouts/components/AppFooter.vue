<template>
  <div class="footer">
    <p class="footer-info">
      Power by Node.js + Nuxt.js,&nbsp;由
      <img class="footer__icon" width="20" height="20" src="@/assets/image/tencent-cloud.png" alt="腾讯云">
      腾讯云 提供云计算服务,&nbsp;本站已经稳稳地存活了 {{ configs.duration }} 天
    </p>
    <p class="footer-copyright">
      <span>Copyright © 2018 - {{ configs.currentYear }} Timeless. All rights reserved. </span>
      <a
        v-if="configs.icp_beian"
        class="footer-copyright__link"
        href="https://beian.miit.gov.cn/"
        rel="noopener noreferrer"
        target="_blank"
        title="ICP/IP地址/域名信息备案管理系统"
      >{{ configs.icp_beian }}</a>
      <a
        v-if="configs.police_beian"
        class="footer-copyright__link"
        href="http://www.beian.gov.cn"
        rel="noopener noreferrer"
        target="_blank"
        title="全国互联网安全管理服务平台"
      >
        <img class="footer__icon" width="20" height="20" src="@/assets/image/icp-beian.png" alt="公网安备">{{ configs.police_beian }}
      </a>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    configs: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
