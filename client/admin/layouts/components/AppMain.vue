<template>
  <section class="app-main">
    <!-- 使用动态的 transition name -->
    <transition :name="transitionName" mode="out-in">
      <Nuxt />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      transitionName: 'fade-transform'
    }
  },
  watch: {
    // watch $route 决定使用哪种过渡，path包含redirect则为刷新
    '$route'(to, from) {
      this.transitionName = to.path.includes('redirect') || from.path.includes('redirect') ? 'fade' : 'fade-transform'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 100vh;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.hasTagsView {
  .fixed-header+.app-main {
    padding-top: 90px;
  }
}
</style>
