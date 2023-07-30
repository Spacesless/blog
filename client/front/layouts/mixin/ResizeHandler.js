let body
if (process.client) {
  body = document.body
}
const WIDTH = 992 // refer to Bootstrap's responsive design
const MDWIDTH = 1280

export default {
  watch: {
    $route (route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        this.$store.dispatch('tools/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted () {
    const { isMobile, isMiddleWidth } = this.getScreenSize()

    if (isMobile) {
      this.$store.dispatch('toggleDevice', 'mobile')
      this.$store.commit('tools/SET_PARTICLE', false)
      this.$store.commit('tools/SET_LIVE2D', false)
    } else {
      this.$store.commit('tools/SET_PARTICLE', true)
      this.$store.commit('tools/SET_LIVE2D', true)
    }
    if (isMiddleWidth) {
      this.$store.dispatch('tools/closeSideBar', { withoutAnimation: true })
    } else {
      this.$store.dispatch('tools/openSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    getScreenSize () {
      const rect = body.getBoundingClientRect()

      return {
        isMobile: rect.width + 7 < WIDTH,
        isMiddleWidth: rect.width + 7 < MDWIDTH
      }
    },
    $_resizeHandler () {
      if (!document.hidden) {
        const { isMobile, isMiddleWidth } = this.getScreenSize()

        this.$store.dispatch('toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMiddleWidth) {
          this.$store.dispatch('tools/closeSideBar', { withoutAnimation: true })
        } else {
          this.$store.dispatch('tools/openSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
