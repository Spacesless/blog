<template>
  <div class="app container" :class="classObj">
    <!--header-->
    <LayoutHeader />
    <!-- aside -->
    <div v-if="device==='mobile' && sidebar.opened" class="app-mask" @click="handleClickOutside" />
    <Sidebar />
    <!-- app start -->
    <div class="main">
      <!-- main start -->
      <nuxt class="main-wrapper" />
      <!--footer start-->
      <LayoutFooter :configs="configs" />
    </div>
    <!--background start-->
    <Background :particle-active="particleActive" />
    <!-- fixedBar -->
    <FixedBar />
    <!-- live2d -->
    <Live2d />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutHeader from './components/LayoutHeader'
import Sidebar from './components/Sidebar'
import LayoutFooter from './components/LayoutFooter'
import Background from './components/Background'
import FixedBar from './components/FixedBar'
import Live2d from './components/Live2d'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  components: {
    LayoutHeader,
    Sidebar,
    LayoutFooter,
    Background,
    FixedBar,
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
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('tools/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/components/layout.scss';
</style>
