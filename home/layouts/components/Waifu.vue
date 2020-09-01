<template>
  <div v-if="isShow" ref="waifu" class="waifu" @mousedown="drag">
    <transition name="fade-transform" mode="out-in">
      <div v-show="tipsShow" class="waifu-tips" v-html="tips" />
    </transition>
    <canvas id="live2d" ref="live2d" width="280" height="250" class="live2d" />
    <div class="waifu-tool">
      <span ref="home" class="tl-icon" @click="goToHome">&#xe76f;</span>
      <span ref="feedback" class="tl-icon" @click="openFeedback">&#xe745;</span>
      <span ref="model" class="tl-icon" @click="loadOtherModel">&#xe6ed;</span>
      <span ref="textures" class="tl-icon" @click="loadOtherTexture">&#xe646;</span>
      <span ref="photo" class="tl-icon" @click="handleTakePhoto">&#xe704;</span>
      <span ref="close" class="tl-icon" @click="handleCloseLive2d">&#xe602;</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
if (process.client) {
  require('@/utils/live2d')
}
export default {
  data() {
    return {
      apiurl: '//api.timelessq.com/live2d/', // apiurl {string} 模型后端接口
      modelId: 100, // 模型 ID
      modelTexturesId: 7, // 材质 ID
      tips: '',
      isShow: true,
      tipsShow: false,
      mouseover: [
        {
          'selector': 'home',
          'text': ['点击前往首页，想回到上一页可以使用浏览器的后退功能哦']
        },
        {
          'selector': 'feedback',
          'text': ['啊呀 我哪里做错了 你要去投诉我么~']
        },
        {
          'selector': 'model',
          'text': ['๑乛◡乛๑ 让我的好朋友见见你']
        },
        {
          'selector': 'textures',
          'text': ['(๑¯◡¯๑) 要看看其它的衣服么']
        },
        {
          'selector': 'photo',
          'text': ['123茄子 西瓜甜不甜，宝宝萌不萌']
        },
        {
          'selector': 'close',
          'text': ['つ﹏⊂ 真的到了要分开的时候了么']
        },
        {
          'selector': 'live2d',
          'text': [
            '干嘛呢你，快把手拿开',
            '鼠…鼠标放错地方了！',
            '我生气了啊~~( ﹁ ﹁ ) ~~~ 哄不回来的那种',
            ' 怕帕(๑⁼̴̀д⁼̴́๑)'
          ]
        }
      ],
      click: [
        '是…是不小心碰到了吧',
        '萝莉控是什么呀',
        '喵喵喵(๑•́ ∀ •̀๑)',
        '๑乛◡乛๑嘿嘿',
        '你看到我的小熊了吗',
        '再摸的话我可要报警了！⌇●﹏●⌇',
        '妖妖零吗，这里有个家伙一直在摸我(ó﹏ò｡)'
      ]
    }
  },
  computed: {
    ...mapGetters(['live2dShow'])
  },
  watch: {
    live2dShow(isShow) {
      if (isShow) {
        this.handleOpenLive2d()
      } else {
        this.handleCloseLive2d()
      }
    }
  },
  mounted() {
    let { isShow } = this.getLocalStorage()
    if (isShow === undefined) isShow = true
    this.$store.commit('tools/SET_LIVE2D', isShow)
    this.isShow = isShow
    if (isShow) {
      this.initModel()
    }
    /** 开启开发者工具 */
    var re = /x/
    re.toString = function() {
      this.showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 3000, true)
      return ''
    }
    document.body.oncopy = () => {
      this.showMessage('你都复制了些什么呀，转载要记得加上出处哦', 3000, true)
    }
  },
  methods: {
    drag(e) {
      const odiv = this.$refs.waifu // 获取目标元素
      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX
        let top = e.clientY - disY

        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        if (left < 0) {
          left = 0
        } else if (left > clientWidth - odiv.clientWidth) {
          left = clientWidth - odiv.clientWidth
        }
        if (top < 0) {
          top = 0
        } else if (top > clientHeight - odiv.clientHeight) {
          top = clientHeight - odiv.clientHeight
        }

        // 绑定元素位置到positionX和positionY上面
        this.positionX = top
        this.positionY = left

        // 移动当前元素
        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'

        document.body.style.userSelect = 'none'
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        document.body.style.userSelect = 'text'
      }
    },
    /** 提示框 */
    showMessage(text, timeout) {
      if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1]
      this.tips = text
      this.tipsShow = true
      if (timeout === undefined) timeout = 3000
      this.hideMessage(timeout)
    },
    hideMessage(timeout) {
      if (timeout === undefined) timeout = 3000
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.tipsShow = false
      }, timeout)
    },
    /** 初始化模型 */
    initModel(waifuPath) {
      if (waifuPath === undefined) waifuPath = ''
      let { modelId, modelTexturesId } = this.getLocalStorage()
      if (modelId == null) {
        /* 首次访问加载 指定模型 的 指定材质 */
        modelId = this.modelId
        modelTexturesId = this.modelTexturesId
      }
      this.loadModel(modelId, modelTexturesId)
      this.welcome()
      this.interaction()
    },
    loadModel(modelId, modelTexturesId) {
      if (modelTexturesId === undefined) modelTexturesId = 1
      this.setLocalStorage({
        modelId, modelTexturesId
      })
      window.loadlive2d(
        'live2d', this.apiurl + 'models?id=' + modelId + '&texture=' + modelTexturesId,
        console.log('live2d', '模型 ' + modelId + '-' + modelTexturesId + ' 加载完成')
      )
    },
    /** 更换模型*/
    loadOtherModel() {
      const { modelId } = this.getLocalStorage()
      axios.get(this.apiurl + 'models/switch?id=' + modelId)
        .then(response => {
          const { id, message } = response.data.data
          if (id) {
            this.showMessage(message, 3000)
            this.loadModel(id)
          } else {
            this.showMessage('哎呀 还没有其它的小伙伴呢', 3000)
          }
        })
    },
    loadOtherTexture() {
      const { modelId, modelTexturesId } = this.getLocalStorage()
      axios.get(this.apiurl + 'textures/random?id=' + modelId + '&texture=' + modelTexturesId)
        .then(response => {
          const { id, texture } = response.data.data
          if (id) {
            this.showMessage('我的新衣服好看嘛', 3000)
            this.loadModel(id, texture)
          } else {
            this.showMessage('我还没有其他衣服呢', 3000)
          }
        })
    },
    welcome() {
      var text
      var SiteIndexUrl = window.location.protocol + '//' + window.location.hostname + '/' // 自动获取主页
      if (window.location.href === SiteIndexUrl) { // 如果是主页
        var now = (new Date()).getHours()
        if (now > 23 || now <= 5) {
          text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛'
        } else if (now > 5 && now <= 7) {
          text = '早上好！一日之计在于晨，美好的一天就要开始了'
        } else if (now > 7 && now <= 11) {
          text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！'
        } else if (now > 11 && now <= 14) {
          text = '中午了，工作了一个上午，现在是午餐时间！'
        } else if (now > 14 && now <= 17) {
          text = '午后很容易犯困呢，今天的运动目标完成了吗？'
        } else if (now > 17 && now <= 19) {
          text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~'
        } else if (now > 19 && now <= 21) {
          text = '晚上好，今天过得怎么样？'
        } else if (now > 21 && now <= 23) {
          text = '已经这么晚了呀，早点休息吧，晚安~'
        } else {
          text = '嗨~ 快来逗我玩吧！'
        }
      } else {
        if (document.referrer !== '') {
          var referrer = document.createElement('a')
          referrer.href = document.referrer
          var domain = referrer.hostname.split('.')[1]
          if (window.location.hostname === referrer.hostname) {
            text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
          } else if (domain === 'baidu') {
            text = 'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？'
          } else if (domain === 'so') {
            text = 'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？'
          } else if (domain === 'google') {
            text = 'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
          } else {
            text = 'Hello! 来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友'
          }
        } else {
          text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
        }
      }
      this.showMessage(text, 3000)
    },
    /** 交互时间 */
    interaction() {
      const refs = this.$refs
      for (const key in refs) {
        refs[key].addEventListener('mouseover', (e) => {
          const rows = this.mouseover.find(item => item.selector === key)
          if (!rows) return
          let text = ''
          if (Array.isArray(rows.text)) {
            text = rows.text[Math.floor(Math.random() * rows.text.length + 1) - 1]
          } else {
            text = rows.text
          }
          this.showMessage(text, 3000)
        })
      }
      this.$refs.live2d.addEventListener('click', () => {
        const text = this.click[Math.floor(Math.random() * this.click.length + 1) - 1]
        this.showMessage(text, 3000, true)
      })
    },
    goToHome() {
      window.location = window.location.protocol + '//' + window.location.hostname + '/'
    },
    handleOpenLive2d() {
      this.isShow = true
      this.$nextTick(() => {
        this.initModel()
        this.showMessage('锵锵锵锵~ 本宝宝又回来了', 1500)
      })
      this.setLocalStorage({
        isShow: true
      })
    },
    handleCloseLive2d() {
      this.setLocalStorage({
        isShow: false
      })
      this.showMessage('愿你有一天能与重要的人重逢', 1500)
      window.setTimeout(() => {
        this.isShow = false
      }, 1500)
    },
    openFeedback() {
      window.open(`${location.protocol}//${location.host}/feedback/`)
    },
    handleTakePhoto() {
      this.showMessage('照好了嘛，是不是很可爱呢？', 3000)
      window.Live2D.captureName = 'Pio.png'
      window.Live2D.captureFrame = true
    },
    getLocalStorage() {
      const local = localStorage.getItem('waifu')
      return local ? JSON.parse(local) : {}
    },
    setLocalStorage(opts) {
      const local = this.getLocalStorage()
      const target = Object.assign(local, opts)
      localStorage.setItem('waifu', JSON.stringify(target))
    }
  }
}
</script>
