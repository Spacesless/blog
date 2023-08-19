<template>
  <div class="ai container">
    <h2 class="tl__title">
      AI
    </h2>
    <div class="hitokoto">
      <span class="hitokoto__title">
        当前内容仅供参考和学习，请不要在这些网站上输入任何个人敏感信息。本站不承担任何责任，如有问题请联系处理。<br>
        数据来源：https://github.com/xx025/carrot、https://github.com/LiLittleCat/awesome-free-chatgpt<br>
        ⭐ : 使用稳定，推荐 | 🆓 : 免费使用 | 🔑 : 有一定限制的 | 🌎 : 需国际网络进行访问。
      </span>
    </div>

    <el-form class="ai-filter" :inline="true">
      <el-form-item label="排序">
        <el-select v-model="filters.sortBy" placeholder="请选择排序方式">
          <el-option label="推荐指数" value="weight" />
          <el-option label="访问延迟" value="delay" />
        </el-select>
      </el-form-item>
      <el-form-item label="需要国际网络的">
        <el-radio-group v-model="filters.vpn">
          <el-radio-button label="show">
            展示
          </el-radio-button>
          <el-radio-button label="hide">
            隐藏
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="不可用的">
        <el-radio-group v-model="filters.delay">
          <el-radio-button label="show">
            展示
          </el-radio-button>
          <el-radio-button label="hide">
            隐藏
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="ai-nav">
      <svg
        class="ai-nav__logo"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="43"
        height="44"
        fill="none"
      >
        <defs>
          <path id="chatgpt_svg__a" d="M0 0h43v43.58H0z" />
        </defs>
        <g>
          <mask id="chatgpt_svg__b" fill="#fff">
            <use xlink:href="#chatgpt_svg__a" />
          </mask>
          <g mask="url(#chatgpt_svg__b)">
            <path fill-rule="evenodd" opacity="0.45" d="M40.17 17.84c.36-1.11.55-2.27.55-3.43 0-1.93-.51-3.83-1.49-5.49a10.98 10.98 0 0 0-9.52-5.51c-.77 0-1.55.08-2.3.24A10.868 10.868 0 0 0 19.29 0h-.1c-4.76 0-8.98 3.07-10.45 7.6-3.06.63-5.71 2.55-7.26 5.27a10.993 10.993 0 0 0 1.35 12.87c-.36 1.11-.55 2.27-.55 3.43 0 1.93.51 3.83 1.49 5.49a10.97 10.97 0 0 0 11.82 5.27c2.06 2.32 5.02 3.65 8.12 3.65h.1c4.76 0 8.99-3.07 10.45-7.61a10.82 10.82 0 0 0 7.26-5.26 10.995 10.995 0 0 0-1.35-12.87ZM18.817 38.695c-.09.05-.17.1-.26.15a8.145 8.145 0 0 0 5.22 1.89h.01c4.5-.01 8.15-3.67 8.16-8.17v-10.13a.153.153 0 0 0-.07-.1l-3.67-2.12v12.24c0 .51-.27.98-.72 1.23l-8.67 5.01Zm-1.424-2.472 8.77-5.06c.04-.03.06-.07.06-.11h-.01v-4.24l-10.59 6.12c-.44.25-.98.25-1.42 0l-8.68-5.01c-.08-.05-.2-.12-.26-.16a8.19 8.19 0 0 0 .97 5.47 8.18 8.18 0 0 0 7.08 4.08c1.43 0 2.84-.37 4.08-1.09Zm-9.187-25.21v-.3c-1.79.66-3.3 1.93-4.25 3.58a8.226 8.226 0 0 0-1.09 4.08c0 2.92 1.55 5.61 4.08 7.07l8.77 5.07c.04.02.09.02.12-.01l3.67-2.12-10.59-6.11c-.44-.25-.71-.72-.71-1.23v-10.03Zm27.849 7.117-8.77-5.07a.126.126 0 0 0-.12.01l-3.67 2.12 10.59 6.12c.44.25.71.71.71 1.22v10.33a8.168 8.168 0 0 0 5.35-7.66 8.16 8.16 0 0 0-4.09-7.07Zm-19.22-5.718a.16.16 0 0 0-.05.11v4.24l10.59-6.12c.22-.12.47-.19.72-.19s.49.07.71.19l8.68 5.02c.08.05.17.1.25.15.08-.46.12-.92.12-1.38 0-4.51-3.66-8.17-8.17-8.17-1.43 0-2.83.38-4.08 1.09l-8.77 5.06ZM19.22 2.85c-4.51 0-8.17 3.65-8.17 8.16v10.13c.01.05.03.08.07.1l3.67 2.12.01-12.23v-.01c0-.5.27-.97.71-1.22l8.68-5.01c.07-.05.19-.11.25-.15a8.145 8.145 0 0 0-5.22-1.89ZM16.783 24.51l4.72 2.73 4.72-2.73v-5.45l-4.72-2.72-4.72 2.73v5.44Z" style="fill: #1890FF;" />
          </g>
        </g>
      </svg>

      <div class="ai-catalog">
        <a v-for="item in sortList" :key="item.name" :href="'#' + item.name" class="ai-catalog__item">{{ item.name }}</a>
      </div>
    </div>

    <div v-loading="fetchLoading" class="ai-list">
      <div v-for="(item, index) in sortList" :key="index">
        <h3 :id="item.name" class="ai-list__name">
          # {{ item.name }}
        </h3>
        <el-row :gutter="20">
          <el-col
            v-for="link in item.data"
            :key="link.url"
            :xl="4"
            :lg="6"
            :md="8"
            :sm="12"
          >
            <LinkItem :index="index" :link="link" @updateDelay="updateDelay" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import LinkItem from './components/LinkItem'
import { pageMeta } from '@/mixins'
import { getLocalStorage, setLocalStorage } from '#/utils'

export default {
  name: 'AiList',
  components: {
    LinkItem
  },
  mixins: [pageMeta],
  layout: 'app',
  data () {
    return {
      aiList: [],
      fetchLoading: false,
      filters: {}
    }
  },
  computed: {
    sortList () {
      const { sortBy, vpn, delay } = this.filters

      return this.aiList.map((item) => {
        let cloneData = [...item.data]
        cloneData = cloneData.filter((element) => {
          let isShowVpn = true
          let isShowUnreachable = true

          if (vpn === 'hide' && element.vpn === true) { isShowVpn = false }
          if (delay === 'hide' && element.delay === 'unreachable') { isShowUnreachable = false }

          return isShowVpn && isShowUnreachable
        })
        const sortData = cloneData.sort((prev, next) => {
          if (sortBy === 'weight') {
            return next.weight - prev.weight
          } else {
            const prevDelay = prev.delay === 'unreachable' || !prev.delay ? Infinity : prev.delay
            const nextDelay = next.delay === 'unreachable' || !next.delay ? Infinity : next.delay
            return prevDelay - nextDelay
          }
        })

        return {
          name: item.name,
          data: sortData
        }
      })
    }
  },
  watch: {
    filters: {
      handler (ops) {
        setLocalStorage('AI_STORE', ops)
      },
      deep: true
    }
  },
  mounted () {
    const localStore = getLocalStorage('AI_STORE')

    this.filters = {
      sortBy: 'weight',
      vpn: 'hide',
      delay: 'show',
      ...localStore
    }

    this.fetchList()
  },
  methods: {
    async fetchList () {
      this.fetchLoading = true
      await this.$axios.$get('/category', {
        params: {
          id: this.findCategory.id
        }
      }).then((res) => {
        const data = res.params || []

        data.forEach((item) => {
          item.data.forEach((element) => {
            const { free, recommend, lock, vpn } = element
            element.weight = 0
            free && (element.weight += 2)
            recommend && (element.weight += 3)
            lock && (element.weight -= 2)
            vpn && (element.weight -= 5)
          })
        })

        this.aiList = data
      }).catch(() => {})
      this.fetchLoading = false
    },
    /**
     * 更新延迟信息
     * @param {Number} param.index
     * @param {String} param.url
     * @param {Number} param.delay
     */
    updateDelay ({ index, url, delay }) {
      const data = this.aiList[index].data
      const findIndex = data.findIndex(item => item.url === url)

      if (findIndex > -1) {
        this.$set(data[findIndex], 'delay', delay)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ai {
  .tl__title {
    font-size: 40px;
  }

  &-nav {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 6;
    text-align: center;
  }

  &-catalog {
    &__item {
      display: block;
      line-height: 32px;
      color: var(--color-secondary);

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  &-filter {
    margin-bottom: 16px;
  }

  &-list {
    &__name {
      margin-bottom: 16px;
      font-size: 30px;
      font-weight: normal;
      color: var(--color-text);
    }
  }
}
</style>
