<template>
  <div class="background">
    <canvas id="flower" width="1900" height="1080" />

    <div class="theme" :class="{'theme--changing': isShowChange, 'theme--dark': !isLight}">
      <div class="theme__sun" />
      <div class="theme__moon" />
    </div>
  </div>
</template>

<script>
// 落花canvas
import ParticleCanvas from '@/utils/particle'
import { getAbsolutePath } from '#/utils'

export default {
  props: {
    particleActive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShowChange: false
    }
  },
  computed: {
    isLight() {
      return this.$colorMode.preference === 'system'
    }
  },
  watch: {
    particleActive(val) {
      if (val) {
        this.particleInstance && this.particleInstance.draw()
      } else {
        this.particleInstance.stopDraw()
      }
    },
    isLight() {
      this.isShowChange = true

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.isShowChange = false
      }, 2000)
    }
  },
  mounted() {
    this.initParticle()
  },
  methods: {
    initParticle() {
      this.particleInstance = new ParticleCanvas(
        'flower',
        [
          {
            'type': { 'typeName': 'image', 'url': getAbsolutePath('/static/img/spring/flower-1.png') },
            'number': 8,
            'op': { 'min': 0.7, 'max': 1 },
            'size': { 'min': 50, 'max': 60 },
            'speed': { 'min': 2, 'max': 4 },
            'angle': { 'value': 140, 'float': 20 },
            'area': { 'leftTop': [0, 0], 'rightBottom': [0, 1000] },
            'rota': { 'value': 30, 'speed': 2, 'floatValue': 120, 'floatSpeed': 1 },
            'reIn': 'reverseDirection'
          },
          {
            'type': { 'typeName': 'image', 'url': getAbsolutePath('/static/img/spring/flower-2.png') },
            'number': 9,
            'size': { 'min': 50, 'max': 60 },
            'speed': { 'min': 3, 'max': 5 },
            'area': { 'leftTop': [500, 300], 'rightBottom': [1000, 4000] },
            'angle': { 'value': 130, 'float': 20 },
            'reIn': 'reverseDirection'
          },
          {
            'type': { 'typeName': 'image', 'url': getAbsolutePath('/static/img/spring/flower-3.png') },
            'number': 8,
            'size': { 'min': 50, 'max': 60 },
            'speed': { 'min': 3, 'max': 5 },
            'area': { 'leftTop': [500, 400], 'rightBottom': [1000, 4000] },
            'angle': { 'value': 140, 'float': 30 },
            'reIn': 'reverseDirection'
          },
          {
            'type': { 'typeName': 'image', 'url': getAbsolutePath('/static/img/spring/flower-4.png') },
            'number': 7,
            'size': { 'min': 50, 'max': 60 },
            'speed': { 'min': 3, 'max': 4 },
            'area': { 'leftTop': [500, 600], 'rightBottom': [1000, 4000] },
            'angle': { 'value': 140, 'float': 30 },
            'reIn': 'reverseDirection'
          },
          {
            'type': { 'typeName': 'image', 'url': getAbsolutePath('/static/img/spring/flower-5.png') },
            'number': 6,
            'size': { 'min': 50, 'max': 60 },
            'speed': { 'min': 3, 'max': 5 },
            'area': { 'leftTop': [0, 1400], 'rightBottom': [1900, 4300] },
            'angle': { 'value': 140, 'float': 40 },
            'reIn': 'reverseDirection'
          }
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.background{
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  background-image: url('~@/assets/image/background.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transition: all .5s;
  #flower{
    width: 100%;
    height: 100%;
  }
}

.theme{
  position: fixed;
  left: -50%;
  top: -50%;
  width: 200%;
  height: 200%;
  transform-origin: center bottom;
  &--changing{
    animation: themeRotate 2s cubic-bezier(.7,0,0,1);
  }
  &__sun, &__moon{
    position: absolute;
    left: 60%;
    top: 30%;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    transition: opacity 1s;
    transition-delay: 1s;
  }
  &__sun {
    background: #ffc53d;
    box-shadow: 0 0 32px #ffc53d;
    opacity: 1;
  }
  &__moon {
    background-color: #f5f5f5;
    box-shadow: 0 0 32px #f5f5f5;
    opacity: 0;
  }
  &--dark &__sun{
    opacity: 0;
  }
  &--dark &__moon{
    opacity: 1;
  }
}

@keyframes themeRotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

<style lang="scss">
.dark-mode{
  .background{
    background-image: none;
  }
}
</style>
