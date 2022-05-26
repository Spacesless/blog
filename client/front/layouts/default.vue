<template>
  <div class="app container" :class="classObj">
    <!--header-->
    <app-header />
    <!-- aside -->
    <sidebar />
    <!-- app start -->
    <div class="app-main">
      <!-- main start -->
      <nuxt />
      <!--footer start-->
      <app-footer :configs="configs" />
    </div>
    <!-- tools start -->
    <div class="tools">
      <!-- fixbar -->
      <fixbar />
      <!--live2d-->
      <live-2d />
    </div>
    <!--background start-->
    <Background :particle-active="particleActive" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from './components/Sidebar/index.vue'
import AppHeader from './components/AppHeader'
import Fixbar from './components/Fixbar'
import Live2d from './components/Live2d'
import AppFooter from './components/AppFooter'
import Background from './components/Background'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  components: {
    AppHeader,
    AppFooter,
    Background,
    Sidebar,
    Fixbar,
    Live2d
  },
  mixins: [ResizeMixin],
  data() {
    return {
      isOpen: true
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'device', 'configs', 'particleActive']),
    classObj() {
      return {
        hideAside: !this.sidebar.opened,
        openAside: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    '$route.name': {
      async handler(name) {
        if (process.client) {
          await this.$nextTick()
          if (name === 'index' && +this.configs.is_silent) {
            document.documentElement.classList.add('silent')
          } else {
            document.documentElement.classList.remove('silent')
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/components/layout.scss';
</style>
