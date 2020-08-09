<template>
  <div class="footer">
    <p class="footer-info">
      Power by ThinkJs + NuxtJs,&nbsp;
      由<img class="footer__icon" src="/static/tencent-cloud.png" alt="腾讯云" />腾讯云 提供云计算服务,&nbsp;
      本站已经稳稳哒存活了 {{ configs.timeless }} 天
    </p>
    <p class="footer-copyright">
      <span>Copyright © 2018 - {{ configs.currentYear }} Timeless. All rights reserved. </span>
      <a class="footer-copyright__link" href="http://www.beian.miit.gov.cn" rel="noopener noreferrer" target="_blank" title="工信部">桂ICP备18003656号-1</a>
      <a class="footer-copyright__link" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45092102000147" rel="noopener noreferrer" target="_blank" title="公网安备">
        <img class="footer__icon" src="/static/icp-beian.png" alt="公网安备">桂公网安备45092102000147号
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
