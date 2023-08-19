<template>
  <a
    ref="link"
    class="link"
    :class="delaySituation"
    :href="link.url"
    :title="link.url"
    target="__blank"
  >
    <p class="link__name">{{ link.url }}</p>
    <div class="link-tags">
      <span v-if="link.recommend" title="推荐使用">⭐</span>
      <span v-if="link.free" title="免费">🆓</span>
      <span v-if="link.lock" title="有一定限制的">🔑</span>
      <span v-if="link.vpn" title="需要国际网络">🌎</span>
    </div>
    <span v-loading="fetchLoading" element-loading-spinner="el-icon-loading" class="link__deley" :class="delaySituation">
      <template v-if="link.delay">
        {{ link.delay === 'unreachable' ? '不可用' : +link.delay.toFixed(2) + 'ms' }}
      </template>
    </span>
  </a>
</template>

<script>
export default {
  name: 'LinkItem',
  props: {
    index: {
      type: Number,
      default: 0
    },
    link: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      fetchLoading: false
    }
  },
  computed: {
    delaySituation () {
      if (this.link.delay === 'unreachable') {
        return 'unreachable'
      } else if (this.link.delay > 5000) {
        return 'bad'
      } else if (this.link.delay > 2000) {
        return 'normal'
      }

      return ''
    }
  },
  mounted () {
    if (!this.link.delay) {
      this.observeDom(this.$refs.link, () => {
        this.checkLatency()
      })
    }
  },
  methods: {
    /**
     * 检查网址延迟时间
     */
    async checkLatency () {
      const start = performance.now()
      let delay

      try {
        this.fetchLoading = true
        await this.fetchUrl()
        const end = performance.now()
        delay = end - start
      } catch (error) {
        delay = 'unreachable'
      }

      this.fetchLoading = false
      this.$emit('updateDelay', {
        index: this.index,
        url: this.link.url,
        delay
      })
    },
    fetchUrl () {
      const controller = new AbortController()
      const signal = controller.signal

      const timeoutPromise = (timeout) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Response('timeout', { status: 504, statusText: 'timeout' }))
            controller.abort()
          }, timeout)
        })
      }
      const requestPromise = () => {
        return fetch(this.link.url, {
          mode: 'no-cors', // 使用no-cors模式以避免CORS问题
          signal
        })
      }
      return Promise.race([timeoutPromise(8000), requestPromise()])
    },
    /**
     * 监听Dom是否位于可视区域
     * @param {Element} observerDom
     * @param {Function} callback
     */
    observeDom (observerDom, callback) {
      const observer = new IntersectionObserver((entires) => {
        if (entires[0].isIntersecting) {
          callback && callback()
          observer.disconnect()
        }
      })
      observer.observe(observerDom)
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  position: relative;
  display: block;
  padding: 10px 10px 16px;
  margin-bottom: $grid-space;
  color: var(--color-text);
  background-color: var(--bg-normal);
  border-top: 3px solid var(--color-primary);
  border-radius: 4px;
  box-shadow: $shadow-3-down;
  transition: all .3s;

  &.unreachable {
    border-color: var(--color-secondary);
  }

  &.bad {
    border-color: #F5222D;
  }

  &.normal {
    border-color: #FAAD14;
  }

  &:hover {
    transform: translateY(-5px);
  }

  &__name {
    overflow: hidden;
    font-size: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-tags {
    height: 24px;
    padding-top: 10px;
    font-size: 18px;
  }

  &__deley {
    position: absolute;
    right: 10px;
    bottom: 10px;
    min-width: 20px;
    color: var(--color-primary);

    &.unreachable {
      color: var(--color-secondary);
    }

    &.bad {
      color: #F5222D;
    }

    &.normal {
      color: #FAAD14;
    }
  }
}
</style>
