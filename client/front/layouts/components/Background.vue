<template>
  <div class="background">
    <canvas id="flower" width="1900" height="1080" />

    <div class="theme" :class="{'theme--changing': isShowChange, 'theme--dark': isDark}">
      <div class="theme__sun" />
      <div class="theme__moon" />
    </div>
  </div>
</template>

<script>
// 落花canvas
import ParticleCanvas from '@/utils/particle'
import { getAbsolutePath } from '#/utils'
import { debounce, sleep } from '@/utils'

export default {
  name: 'BackgroundLayout',
  props: {
    particleActive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowChange: false,
      isLoaded: false
    }
  },
  computed: {
    isDark () {
      return this.$colorMode.preference === 'dark'
    }
  },
  watch: {
    particleActive: {
      async handler (val) {
        if (val) {
          if (!this.particleInstance) {
            if (!this.isLoaded) {
              this.isLoaded = true
              await sleep(2000)
            }
            this.initParticle()
          } else {
            this.particleInstance.resize()
            this.particleInstance.draw()
          }
        } else {
          this.particleInstance?.stopDraw()
        }
      },
      immediate: true
    },
    mounted () {
      this.__resizeHandler = debounce(() => {
        this.particleInstance?.resize()
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.__resizeHandler)
    },
    isDark () {
      this.isShowChange = true

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.isShowChange = false
      }, 2000)
    }
  },
  methods: {
    initParticle () {
      this.particleInstance = new ParticleCanvas(
        'flower',
        [
          {
            type: { typeName: 'image', url: getAbsolutePath('/static/img/spring/flower-1.png') },
            number: 8,
            op: { min: 0.7, max: 1 },
            size: { min: 50, max: 60 },
            speed: { min: 2, max: 4 },
            angle: { value: 140, float: 20 },
            area: { leftTop: [0, 0], rightBottom: [0, 1000] },
            rota: { value: 30, speed: 2, floatValue: 120, floatSpeed: 1 },
            reIn: 'reverseDirection'
          },
          {
            type: { typeName: 'image', url: getAbsolutePath('/static/img/spring/flower-2.png') },
            number: 9,
            size: { min: 50, max: 60 },
            speed: { min: 3, max: 5 },
            area: { leftTop: [500, 300], rightBottom: [1000, 4000] },
            angle: { value: 130, float: 20 },
            reIn: 'reverseDirection'
          },
          {
            type: { typeName: 'image', url: getAbsolutePath('/static/img/spring/flower-3.png') },
            number: 8,
            size: { min: 50, max: 60 },
            speed: { min: 3, max: 5 },
            area: { leftTop: [500, 400], rightBottom: [1000, 4000] },
            angle: { value: 140, float: 30 },
            reIn: 'reverseDirection'
          },
          {
            type: { typeName: 'image', url: getAbsolutePath('/static/img/spring/flower-4.png') },
            number: 7,
            size: { min: 50, max: 60 },
            speed: { min: 3, max: 4 },
            area: { leftTop: [500, 600], rightBottom: [1000, 4000] },
            angle: { value: 140, float: 30 },
            reIn: 'reverseDirection'
          },
          {
            type: { typeName: 'image', url: getAbsolutePath('/static/img/spring/flower-5.png') },
            number: 6,
            size: { min: 50, max: 60 },
            speed: { min: 3, max: 5 },
            area: { leftTop: [0, 1400], rightBottom: [1900, 4300] },
            angle: { value: 140, float: 40 },
            reIn: 'reverseDirection'
          }
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;

  &::before {
    position: absolute;
    right: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: '';
    background: url('~@/assets/image/background.png') no-repeat bottom right;
    background-size: cover;
    opacity: .25;
  }

  #flower {
    width: 100%;
    height: 100%;
    opacity: .65;
  }
}

.theme {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  opacity: .65;
  transform-origin: center bottom;

  &--changing {
    animation: theme-rotate 2s cubic-bezier(.7, 0, 0, 1);
  }

  &__sun,
  &__moon {
    position: absolute;
    top: 30%;
    left: 60%;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: opacity 1s;
    transition-delay: 1s;
  }

  &__sun {
    background: #FFC53D;
    box-shadow: 0 0 32px #FFC53D;
    opacity: 1;
  }

  &__moon {
    background-color: #F5F5F5;
    box-shadow: 0 0 32px #F5F5F5;
    opacity: 0;
  }

  &--dark &__sun {
    opacity: 0;
  }

  &--dark &__moon {
    opacity: 1;
  }
}

@keyframes theme-rotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
