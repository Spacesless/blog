<template>
  <div class="fixbar">
    <el-tooltip effect="dark" :content="live2dShow ? '关闭看板娘' : '打开看板娘'" placement="left">
      <div class="fixbar-item tl-icon" :class="live2dShow ? 'fixbar-item--active' : ''" @click="toggleWaifu">&#xe703;</div>
    </el-tooltip>
    <el-tooltip effect="dark" :content="particleActive ? '关闭背景动画' : '打开背景动画'" placement="left">
      <div class="fixbar-item tl-icon" :class="particleActive ? 'fixbar-item--active' : ''" @click="toggleBubble">&#xe640;</div>
    </el-tooltip>
    <el-tooltip effect="dark" content="点我坐电梯" placement="left" :disabled="backTopTips">
      <transition name="fade-transform">
        <div v-show="backTopShow" class="fixbar-item fixbar-item-back" @click="backTop">
          <span class="fixbar-item-back__percent">{{ scrollPercent }}%</span>
          <span class="fixbar-item-back__icon tl-icon">&#xe637;</span>
        </div>
      </transition>
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPosition, scrollTo } from '#/utils/scroll-to'

const REFERENCE = 100

export default {
  data() {
    return {
      backTopShow: false,
      backTopTips: false,
      scrollTop: 0,
      scrollPercent: 0
    }
  },
  computed: {
    ...mapGetters(['particleActive', 'live2dShow'])
  },
  watch: {
    scrollTop() {
      this.backTopShow = this.scrollTop > REFERENCE

      const screenHeight = window.innerHeight
      const windowHeight = document.body.clientHeight || document.documentElement.clientHeight
      const percent = Math.ceil(this.scrollTop / (windowHeight - screenHeight) * 100)
      this.scrollPercent = percent > 100 ? 100 : percent
    }
  },
  mounted() {
    this.scrollTop = getPosition()
    window.addEventListener('scroll', () => {
      this.scrollTop = getPosition()
    })
  },
  methods: {
    toggleWaifu() {
      this.$store.commit('tools/TOGGLE_LIVE2D')
    },
    toggleBubble() {
      this.$store.commit('tools/TOGGLE_PARTICLE')
    },
    backTop() {
      this.backTopTips = true
      scrollTo(0, 800, undefined, () => {
        this.backTopTips = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fixbar{
  position: fixed;
  right: 8px;
  bottom: 16px;
  z-index: 1000;
  @media (max-width:768px) {
    display: none;
  }
  &-item{
    width: 44px;
    height: 44px;
    margin-top: $grid-space / 2;
    background-color: var(--bg-normal);
    color: var(--color-secondary);
    font-size: 22px;
    line-height: 44px;
    text-align: center;
    outline: none;
    user-select: none;
    cursor: pointer;
    box-shadow: $shadow-3-right;
    border-radius: 50%;
    &:hover{
      background-color: var(--bg-normal);
      color: var(--color-primary);
    }
    &--active{
      color: var(--color-primary);
    }
    &-back {
      &__percent{
        font-size: 15px;
        vertical-align: bottom;
      }
      &__icon{
        display: none;
      }
      &:hover &{
        &__percent{
          display: none;
        }
        &__icon{
          display: inline-block;
        }
      }
    }
  }
}
</style>
