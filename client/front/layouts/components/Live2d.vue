<template>
  <div v-if="isShow" ref="waifu" class="waifu" @mousedown="dragMove">
    <transition name="fade-transform" mode="out-in">
      <div v-show="tipsShow" class="waifu-tips" v-html="tips" />
    </transition>
    <canvas
      id="js-live2d"
      width="208"
      height="208"
      class="waifu-live2d"
      @click="onMouseClick"
      @mouseenter="onMouseEnter('live2d')"
    />
    <div class="waifu-tool">
      <!-- 返回首页 -->
      <span class="icon-shouye" @click="navigatorToHome" @mouseenter="onMouseEnter('home')" />
      <!-- 切换模型 -->
      <span class="icon-moxing" @click="loadOtherModel" @mouseenter="onMouseEnter('model')" />
      <!-- 更换材质 -->
      <span class="icon-pifu" @click="loadOtherTexture" @mouseenter="onMouseEnter('textures')" />
      <!-- 拍照 -->
      <span class="icon-paizhao" @click="handleTakePhoto" @mouseenter="onMouseEnter('photo')" />
      <!-- 关闭 -->
      <span class="icon-guanbi" @click="handleHideLive2d" @mouseenter="onMouseEnter('close')" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { sleep } from '@/utils'
if (process.client) {
  require('@/vendor/live2d')
}

const mouseTips = {
  live2d: [
    '(๑•́ ₃ •̀๑)',
    '.^◡^.',
    'ᖗ乛◡乛ᖘ'
  ],
  home: '点击前往首页，想回到上一页可以使用浏览器的后退功能哦',
  model: '๑乛◡乛๑ 让我的好朋友见见你',
  textures: '(๑¯◡¯๑) 要看看其它的衣服么',
  photo: '123茄子 西瓜甜不甜，宝宝萌不萌',
  close: 'つ﹏⊂ 真的到了要分开的时候了么'
}

const clickTips = [
  '萝莉控是什么呀',
  '(๑•́ ∀ •̀๑)',
  '๑乛◡乛๑嘿嘿',
  '！⌇●﹏●⌇',
  '(ó﹏ò｡)'
]

export default {
  name: 'Live2D',
  data () {
    return {
      apiurl: '//api.timelessq.com/live2d', // apiurl {string} 模型后端接口
      tips: '',
      isShow: false,
      tipsShow: false,
      isLoaded: false
    }
  },
  computed: {
    ...mapGetters(['live2dShow', 'configs']),
    modelId () { // 模型 ID
      return this.configs.live2d_model || 100
    },
    texturesId () { // 材质 ID
      return this.configs.live2d_texture || 1
    }
  },
  watch: {
    async live2dShow (isShow) {
      if (isShow) {
        if (!this.isLoaded) {
          this.isLoaded = true
          await sleep(3000)
        }
        this.handleShowLive2d()
      } else {
        this.handleHideLive2d()
      }
    }
  },
  mounted () {
    // 复制
    document.addEventListener('copy', () => {
      this.showMessage('你都复制了些什么呀，转载要记得加上出处哦', 3000)
    })
  },
  methods: {
    dragMove (e) {
      const $el = this.$refs.waifu // 获取目标元素
      // 算出鼠标相对元素的位置
      const disX = e.clientX - $el.offsetLeft
      const disY = e.clientY - $el.offsetTop
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX
        let top = e.clientY - disY

        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        if (left < 0) {
          left = 0
        } else if (left > clientWidth - $el.clientWidth) {
          left = clientWidth - $el.clientWidth
        }
        if (top < 0) {
          top = 0
        } else if (top > clientHeight - $el.clientHeight) {
          top = clientHeight - $el.clientHeight
        }

        // 移动当前元素
        $el.style.left = left + 'px'
        $el.style.top = top + 'px'

        document.body.style.userSelect = 'none'
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        document.body.style.userSelect = 'unset'
      }
    },
    /**
     * 提示信息
     * @param {String} text tips信息
     * @param {Number [int]} duration 持续时间
     */
    showMessage (text, duration = 3000) {
      if (!text) { return }
      this.tips = text
      this.tipsShow = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.tipsShow = false
      }, duration)
    },
    // 初始化模型
    initModel () {
      this.loadModel(this.modelId, this.texturesId)
      this.onEnterPage()
    },
    /**
     * 加载指定模型
     * @param {Number [int]} modelId 模型id
     * @param {Number [int]} texturesId 材质id
     */
    loadModel (modelId, texturesId = 1) {
      window.loadlive2d(
        'js-live2d', `${this.apiurl}/get?id=${modelId}&texture=${texturesId}&isuseCDN=true`,
        console.log('live2d', `模型 ${modelId}-${texturesId} 加载完成`)
      )
    },
    // 更换模型
    loadOtherModel () {
      this.$axios.get(this.apiurl + '/model/switch', {
        params: {
          id: this.modelId
        }
      }).then((res) => {
        const { id, message } = res.data
        if (id) {
          this.showMessage(message)
          this.loadModel(id)
        } else {
          this.showMessage('哎呀 还没有其它的小伙伴呢')
        }
      })
    },
    // 更换材质
    loadOtherTexture () {
      this.$axios.get(this.apiurl + '/texture/random', {
        params: {
          id: this.modelId,
          texture: this.texturesId
        }
      }).then((res) => {
        const { id, texture } = res.data
        if (id) {
          this.showMessage('我的新衣服好看嘛')
          this.loadModel(id, texture)
        } else {
          this.showMessage('我还没有其他衣服呢')
        }
      })
    },
    onEnterPage () {
      let text
      const homePath = window.location.protocol + '//' + window.location.hostname + '/' // 自动获取主页
      if (window.location.href === homePath) { // 如果是主页
        const nowHour = new Date().getHours()
        if (nowHour > 23 || nowHour <= 5) {
          text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛'
        } else if (nowHour > 5 && nowHour <= 7) {
          text = '早上好！一日之计在于晨，美好的一天就要开始了'
        } else if (nowHour > 7 && nowHour <= 11) {
          text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！'
        } else if (nowHour > 11 && nowHour <= 14) {
          text = '中午了，工作了一个上午，现在是午餐时间！'
        } else if (nowHour > 14 && nowHour <= 17) {
          text = '午后很容易犯困呢，今天的运动目标完成了吗？'
        } else if (nowHour > 17 && nowHour <= 19) {
          text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~'
        } else if (nowHour > 19 && nowHour <= 21) {
          text = '晚上好，今天过得怎么样？'
        } else if (nowHour > 21 && nowHour <= 23) {
          text = '已经这么晚了呀，早点休息吧，晚安~'
        } else {
          text = '嗨~ 快来逗我玩吧！'
        }
      } else if (document.referrer !== '') {
        const referrer = document.createElement('a')
        referrer.href = document.referrer
        const domain = referrer.hostname.split('.')[1]
        if (window.location.hostname === referrer.hostname) {
          text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
        } else if (domain === 'baidu') {
          text = 'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + (referrer.search.split('&wd=')[1]?.split('&')[0] || '') + '</span> 找到的我吗？'
        } else if (domain === 'so') {
          text = 'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + (referrer.search.split('&q=')[1]?.split('&')[0] || '') + '</span> 找到的我吗？'
        } else if (domain === 'google') {
          text = 'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
        } else {
          text = 'Hello! 来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友'
        }
      } else {
        text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
      }
      this.showMessage(text)
    },
    // 鼠标交互
    onMouseEnter (key) {
      const tips = mouseTips[key]
      let text = tips
      if (tips instanceof Array) {
        text = tips[Math.floor(Math.random() * tips.length + 1) - 1]
      }
      this.showMessage(text)
    },
    onMouseClick () {
      const text = clickTips[Math.floor(Math.random() * clickTips.length + 1) - 1]
      this.showMessage(text)
    },
    // 返回首页
    navigatorToHome () {
      this.$router.push({ path: '/' })
    },
    handleShowLive2d () {
      this.isShow = true
      this.$nextTick(() => {
        this.initModel()
        this.showMessage('锵锵锵锵~ 本宝宝又回来了', 1500)
      })
    },
    handleHideLive2d () {
      this.showMessage('愿你有一天能与重要的人重逢', 1500)
      window.setTimeout(() => {
        this.$store.commit('tools/SET_LIVE2D', false)
        this.isShow = false
      }, 1500)
    },
    /**
     * 拍照
     * @summary canvas转图片
     */
    handleTakePhoto () {
      this.showMessage('照好了嘛，是不是很可爱呐？')
      window.Live2D.captureName = 'Pio.png'
      window.Live2D.captureFrame = true
    }
  }
}
</script>

<style lang="scss" scoped>
.waifu {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 997;
  width: 208px;
  height: 220px;
  transition: margin-top .3s ease-in-out;
  transform-origin: bottom center;

  @media (max-width: 992px) {
    display: none;
  }

  &:hover {
    margin-top: 0;
    cursor: grab;

    .waifu-tool {
      display: block;
    }
  }

  &-tips {
    position: absolute;
    top: 0;
    width: 185px;
    height: 60px;
    padding: 5px 10px;
    overflow: hidden;
    font-size: 12px;
    color: #303133;
    text-overflow: ellipsis;
    background-color: rgba(255, 255, 255, .8);
    border: 1px solid var(--color-primary);
    border-radius: 12px;
    box-shadow: 0 1px 3px #66CCFF;
  }

  &-tool {
    position: absolute;
    bottom: 0;
    left: 10px;
    display: none;
    font-size: 14px;
    color: #AAAAAA;

    span {
      display: block;
      margin-bottom: 10px;
      font-size: 20px;
      line-height: 20px;
      color: var(--color-text);
      cursor: pointer;
      transition: .2s;

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  &-live2d {
    position: relative;
    top: 15px;
  }
}
</style>
