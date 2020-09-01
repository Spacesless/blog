<template>
  <div id="live" class="live">
    <div class="el-row">
      <div class="el-col el-col-md-10">
        <div ref="waifu" class="live2d">
          <transition name="fade-transform" mode="out-in">
            <div v-show="tipsShow" class="live-tips" v-html="tips" />
          </transition>
          <canvas id="live2d" ref="live2d" width="500" height="450" />
        </div>
        <div class="live-info">
          <p>{{ currentInfo.message }}</p>
          <a :href="currentInfo.from" target="_blank">{{ currentInfo.from }}</a>
        </div>
      </div>
      <div class="el-col el-col-md-14">
        <div class="live-filter">
          <el-cascader :value="selectModel" :options="options" @change="changeClassify" />
          <el-radio-group v-show="mixVisible" v-model="isMix" @change="changeMix">
            <el-radio-button :label="0">套装</el-radio-button>
            <el-radio-button :label="1">百搭</el-radio-button>
          </el-radio-group>
        </div>
        <el-scrollbar class="live-wrapper" wrap-class="scroll-warpper">
          <div v-infinite-scroll="loadMore" class="live-list" :infinite-scroll-immediate="false" :infinite-scroll-distance="100">
            <div class="el-row">
              <div v-for="item in modelCount" :key="item" class="el-col-12 el-col-sm-8 el-col-md-6">
                <div class="live-list__item" :class="{ 'live-list__item--active': selectModel === modelId && selectTexture === item }">
                  <el-image :src="thumbFormat(item)" @click="loadModel(selectModel, item)" />
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
if (process.client) {
  require('@/utils/live2d')
}

export default {
  layout: 'app',
  data() {
    return {
      apiurl: '//api.timelessq.com/live2d', // apiurl {string} 模型后端接口
      modelId: 100, // 模型 ID
      modelTexturesId: 1, // 材质 ID
      tips: '',
      tipsShow: false,
      selectModel: 10,
      selectTexture: 1,
      mixVisible: true,
      isMix: 0,
      options: [],
      modelCount: 0,
      Info: {},
      currentInfo: {},
      mouseover: [
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
  async mounted() {
    this.fetchList()
    await this.fetchModelList()
    this.initModel()
    /** 开启开发者工具 */
    var re = /x/
    re.toString = function() {
      this.showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 3000, true)
      return ''
    }
  },
  methods: {
    fetchList() {
      axios.get(this.apiurl + '/lists').then(res => {
        let source = res.data.data
        source = JSON.stringify(source).replace(/id/gi, 'value').replace(/name/gi, 'label')
        this.options = JSON.parse(source)
      })
    },
    fetchModelList() {
      this.modelCount = 0
      return new Promise(resolve => {
        axios.get(`${this.apiurl}/lists/model?id=${this.selectModel}&mixins=${this.isMix}`).then(res => {
          const { id, total, message, from } = res.data.data
          this.total = total
          this.modelCount = total <= 16 ? total : 16
          this.Info = {
            id,
            message,
            from
          }
          resolve()
        })
      })
    },
    changeClassify(val) {
      const current = val[val.length - 1]
      if (current === this.selectModel) return
      this.selectModel = current
      this.fetchModelList()
    },
    changeMix() {
      this.fetchModelList()
    },
    loadMore() {
      console.log(this.modelCount + 8 > this.total)
      this.modelCount = this.modelCount + 8 > this.total ? this.total : this.modelCount + 8
    },
    thumbFormat(index) {
      return `/static/live2d/${this.isMix ? 'random' : 'switch'}/${this.selectModel}/${index}.png`
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
    initModel() {
      this.loadModel(this.modelId, this.modelTexturesId)
      this.welcome()
      this.interaction()
    },
    loadModel(modelId, modelTexturesId) {
      this.modelId = modelId
      this.selectTexture = modelTexturesId
      window.loadlive2d(
        'live2d', `${this.apiurl}/models?id=${modelId}&texture=${modelTexturesId}&mixins=${this.isMix}`,
        console.log('live2d', '模型 ' + modelId + '-' + modelTexturesId + ' 加载完成')
      )
      this.currentInfo = this.modelId === this.Info.id ? this.Info : {}
    },
    /** 更换模型*/
    loadOtherModel() {
      const { modelId } = this.getLocalStorage()
      axios.get(this.apiurl + '/models/switch?id=' + modelId)
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
      axios.get(this.apiurl + '/textures/random?id=' + modelId + '&texture=' + modelTexturesId)
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
    handleTakePhoto() {
      this.showMessage('照好了嘛，是不是很可爱呢？', 3000)
      window.Live2D.captureName = 'Pio.png'
      window.Live2D.captureFrame = true
    }
  }
}
</script>

<style lang="scss" scoped>
.live{
  position: fixed;
  width: 100%;
  &, .el-row, .el-col{
    height: 100%;
  }
  .el-col{
    position: relative;
  }
  .live2d{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -250px;
    margin-left: -250px;
  }
  &-tips {
    overflow: hidden;
    position: absolute;
    top: 20px;
    left: 50px;
    width: 350px;
    height: 100px;
    margin: -20px 10px;
    padding: 5px 10px;
    border: 1px solid $primary;
    background-color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    text-overflow: ellipsis;
    box-shadow: 0 1px 3px #66ccff;
    border-radius: 12px;
    animation: shake 25s ease-in-out 2s infinite;
  }
  &-info{
    position: absolute;
    bottom: 10px;
    right: 0;
    padding: 0 20px;
    font-size: 15px;
    line-height: 1.5;
    text-align: right;
    p{
      color: #606266;
    }
    a{
      color: $primary;
    }
  }
  &-filter{
    padding: 15px 0;
  }
  &-list{
    &__item{
      padding: 10px 15px;
      border: 1px solid #fff;
      &--active{
        border: 1px solid $primary;
        border-radius: 4px;
      }
      .el-image{
        cursor: pointer;
      }
    }
  }
  &-wrapper{
    height: calc(100% - 65px);
  }
  .scroll-warpper{
    overflow-x: hidden !important;
  }
}
</style>
