<template>
  <div class="apple">
    <div ref="apple" class="apple-console" />
    <audio ref="audio" class="apple-audio" controls :src="'/static/bad-apple/music.mp3' | replaceUrlPrefix">
      <p>你的浏览器不支持播放音频</p>
    </audio>
  </div>
</template>

<script>
import axios from 'axios'

const totalPaint = 4380
const partCount = 400
const maxPart = Math.ceil(totalPaint / partCount)

export default {
  layout: 'app',
  async asyncData({ app, route, $axios }) {
    const filename = route.path.split('/')
    const { seo } = await $axios.$get('/tool/content', {
      params: {
        path: filename[filename.length - 1] || 'bad-apple'
      }
    })

    return {
      seo
    }
  },
  data() {
    return {
      index: 0,
      fileIndex: 1,
      dotsArr: [],
      timer: null,
      isPlaying: false,
      failCount: 0
    }
  },
  mounted() {
    this.resize()
    this.fetchData().then(res => {
      this.print()
      this.addAudioListener()
    })
  },
  methods: {
    fetchData() {
      return axios.get(`/static/bad-apple/frame-${this.fileIndex}.txt`).then(res => {
        const data = res.data?.trim().split('\n\r') || []
        data.forEach((item, index) => {
          this.dotsArr[(this.fileIndex - 1) * partCount + index] = item
        })
      })
    },
    async play() {
      if (this.index >= totalPaint || this.failCount > 5) {
        return clearInterval(this.timer)
      }

      const preLoadIndex = this.index + partCount / 2

      if (!this.dotsArr[this.index]) {
        this.$refs.audio.pause()
        this.isPlaying = false
        this.fileIndex = Math.ceil(this.index / partCount)
        await this.fetchData().then(res => {
          this.$refs.audio.play()
          if (!this.dotsArr[this.index]) {
            this.failCount++
          } else {
            this.failCount = 0
          }
        })
      } else if (preLoadIndex < totalPaint && !this.dotsArr[preLoadIndex]) {
        if (this.fileIndex < maxPart) this.fileIndex++
        this.fetchData()
      }

      this.print()

      if (this.isPlaying) {
        this.index++
      } else {
        clearInterval(this.timer)
      }
    },
    print() {
      const currtPaint = this.dotsArr[this.index]
      if (currtPaint) this.$refs.apple.innerText = this.shrinkString(currtPaint)
    },
    /**
     * 解压字符串
     * @param {String} sText
     * @summary wwwcaabbbb 压缩成 w3ca2b4
     * @returns {String}
     */
    shrinkString(sText) {
      return sText.replace(/(\D\d+)/g, (m, p1) => {
        const match = m.match(/(\D)(\d+)/)
        return ''.padEnd(+match[2], match[1])
      })
    },
    resize() {
      const resize = () => {
        const bodyHeight = window.innerHeight - 54
        const scale = bodyHeight / 726
        this.$refs.apple.style.transform = `scale(${scale})`
        // const fontSize = Math.ceil(12 * scale)
        // this.$refs.apple.style.cssText = `font-size: ${fontSize}px; line-height: ${fontSize}px`
      }
      resize()
      window.addEventListener('resize', resize)
    },
    addAudioListener() {
      this.$refs.audio.addEventListener('play', () => {
        console.log('play')
        if (this.index === totalPaint) {
          this.index = 0
          this.fileIndex = 1
        }
        this.isPlaying = true
        clearInterval(this.timer)
        this.timer = setInterval(this.play, 50)
      })
      this.$refs.audio.addEventListener('pause', () => {
        console.log('pause')
        this.isPlaying = false
      })
      this.$refs.audio.addEventListener('timeupdate', e => {
        const cuurentTime = e.target.currentTime
        const duration = e.target.duration
        this.index = Math.round(cuurentTime / duration * totalPaint)
      })
      this.$refs.audio.addEventListener('ended', () => {
        this.index = 0
        this.fileIndex = 1
      })
    }
  },
  head() {
    return {
      title: this.seo.title,
      meta: [
        { hid: 'description', name: 'description', content: this.seo.description },
        { hid: 'keyword', name: 'keyword', content: this.seo.keyword }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.apple{
  &-console{
    position: fixed;
    top: 50%;
    left: 50%;
    width: 1046px;
    height: 726px;
    margin-left: -523px;
    margin-top: -390px;
    // margin-top: -28px;
    // transform: translateX(-50%) translateY(-50%);
    font-family: simsun;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
  }
  &-audio {
    position: fixed;
    bottom: 0;
    left: 16px;
    width: calc(100% - 32px);
  }
}
</style>
