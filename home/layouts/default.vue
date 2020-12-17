<template>
  <div class="app" :class="classObj">
    <!-- aside -->
    <sidebar />
    <!-- app start -->
    <div class="app-main">
      <!--header-->
      <app-header />
      <!-- main start -->
      <nuxt class="container" />
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
    <div class="background">
      <canvas id="flower" width="1900" height="1080" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from './components/Sidebar/index.vue'
import AppHeader from './components/AppHeader'
import Fixbar from './components/Fixbar'
import Live2d from './components/Live2d'
import AppFooter from './components/AppFooter'
// 落花canvas
import ParticleCanvas from '@/utils/particle'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  components: {
    Sidebar,
    AppHeader,
    Fixbar,
    Live2d,
    AppFooter
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
    particleActive(val) {
      if (val) {
        this.particleInstance && this.particleInstance.draw()
      } else {
        this.particleInstance.stopDraw()
      }
    }
  },
  mounted() {
    this.particleInstance = new ParticleCanvas(
      'flower',
      [
        {
          'type': { 'typeName': 'image', 'url': '/static/spring/flower-1.png' },
          'number': 3,
          'op': { 'min': 0.7, 'max': 1 },
          'size': { 'min': 40, 'max': 60 },
          'speed': { 'min': 2, 'max': 4 },
          'angle': { 'value': 140, 'float': 20 },
          'area': { 'leftTop': [0, 0], 'rightBottom': [0, 1000] },
          'rota': { 'value': 30, 'speed': 1, 'floatValue': 120, 'floatSpeed': 3 },
          'reIn': 'reverseDirection'
        },
        {
          'type': { 'typeName': 'image', 'url': '/static/spring/flower-2.png' },
          'number': 4,
          'size': { 'min': 40, 'max': 60 },
          'speed': { 'min': 2, 'max': 5 },
          'area': { 'leftTop': [400, 200], 'rightBottom': [800, 1800] },
          'angle': { 'value': 130, 'float': 20 },
          'reIn': 'reverseDirection'
        },
        {
          'type': { 'typeName': 'image', 'url': '/static/spring/flower-3.png' },
          'number': 3,
          'size': { 'min': 50, 'max': 60 },
          'speed': { 'min': 1, 'max': 3 },
          'area': { 'leftTop': [400, 300], 'rightBottom': [800, 1800] },
          'angle': { 'value': 140, 'float': 30 },
          'reIn': 'reverseDirection'
        },
        {
          'type': { 'typeName': 'image', 'url': '/static/spring/flower-4.png' },
          'number': 2,
          'size': { 'min': 50, 'max': 60 },
          'speed': { 'min': 3, 'max': 5 },
          'area': { 'leftTop': [400, 700], 'rightBottom': [400, 1300] },
          'angle': { 'value': 140, 'float': 30 },
          'reIn': 'reverseDirection'
        },
        {
          'type': { 'typeName': 'image', 'url': '/static/spring/flower-5.png' },
          'number': 1,
          'size': { 'min': 50, 'max': 60 },
          'speed': { 'min': 1, 'max': 2 },
          'area': { 'leftTop': [0, 1200], 'rightBottom': [1300, 200] },
          'angle': { 'value': 140, 'float': 40 },
          'reIn': 'reverseDirection'
        }
      ]
    )
  },
  head() {
    return {
      htmlAttrs: {
        class: parseInt(this.configs.is_silent) ? 'silent' : ''
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/index.scss';
</style>
