<template>
  <div class="fixbar">
    <el-tooltip effect="dark" :content="live2dShow ? '关闭看板娘' : '打开看板娘'" placement="left">
      <div class="fixbar-item icon-xiaolian" :class="live2dShow ? 'fixbar-item--active' : ''" @click="toggleWaifu" />
    </el-tooltip>
    <el-tooltip effect="dark" :content="particleActive ? '关闭背景动画' : '打开背景动画'" placement="left">
      <div class="fixbar-item icon-dongxiao" :class="particleActive ? 'fixbar-item--active' : ''" @click="toggleBubble" />
    </el-tooltip>
    <el-tooltip effect="dark" content="点我坐电梯" placement="left" :disabled="backTopTips">
      <transition name="fade-transform">
        <div v-show="backTopShow" class="fixbar-item fixbar-item-back" @click="backTop">
          <span class="fixbar-item-back__percent">{{ scrollPercent }}%</span>
          <span class="fixbar-item-back__icon icon-fanhuidingbu" />
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
  name: 'FixedBar',
  data () {
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
    scrollTop () {
      this.backTopShow = this.scrollTop > REFERENCE

      const screenHeight = window.innerHeight
      const windowHeight = document.body.clientHeight || document.documentElement.clientHeight
      const percent = Math.ceil(this.scrollTop / (windowHeight - screenHeight) * 100)
      this.scrollPercent = percent > 100 ? 100 : percent
    }
  },
  mounted () {
    this.scrollTop = getPosition()
    window.addEventListener('scroll', () => {
      this.scrollTop = getPosition()
    })
  },
  methods: {
    toggleWaifu () {
      this.$store.commit('tools/TOGGLE_LIVE2D')
    },
    toggleBubble () {
      this.$store.commit('tools/TOGGLE_PARTICLE')
    },
    backTop () {
      this.backTopTips = true
      scrollTo(0, 800, undefined, () => {
        this.backTopTips = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fixbar {
  position: fixed;
  right: 8px;
  bottom: 16px;
  z-index: 998;

  @media (max-width: 768px) {
    display: none;
  }

  &-item {
    width: 40px;
    height: 40px;
    margin-top: $grid-space / 2;
    font-size: 20px;
    line-height: 40px;
    color: var(--color-secondary);
    text-align: center;
    cursor: pointer;
    user-select: none;
    background-color: var(--bg-normal);
    border-radius: 50%;
    outline: none;
    box-shadow: $shadow-3-right;

    &:hover {
      color: var(--color-primary);
      background-color: var(--bg-normal);
    }

    &--active {
      color: var(--color-primary);
    }

    &-back {
      &__percent {
        font-size: 14px;
        vertical-align: bottom;
      }

      &__icon {
        display: none;
      }

      &:hover & {
        &__percent {
          display: none;
        }

        &__icon {
          display: inline-block;
        }
      }
    }
  }
}
</style>
