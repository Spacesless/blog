<template>
  <div class="share">
    <span class="share-icon tl-icon">&#xe725;</span>
    <el-tooltip effect="dark" content="分享到QQ好友" placement="bottom">
      <span class="share-item QQ" @click="shareToQQ" />
    </el-tooltip>
    <el-tooltip effect="dark" content="分享到QQ空间" placement="bottom">
      <span class="share-item Qzone" @click="shareToQzone" />
    </el-tooltip>
    <el-tooltip effect="dark" content="分享到微信" placement="bottom">
      <el-popover
        v-model="wxVisible"
        placement="bottom"
        width="256"
      >
        <div class="qrcode-wrap">
          <img ref="qrcode" class="img-fluid" alt="">
          <p>分享到微信</p>
        </div>
        <span slot="reference" class="share-item Wx" @click="shareToWx" />
      </el-popover>
    </el-tooltip>
    <el-tooltip effect="dark" content="分享到新浪微博" placement="bottom">
      <span class="share-item Sina" @click="shareToSina" />
    </el-tooltip>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  data() {
    return {
      url: '',
      title: '',
      description: '',
      cover: '',
      website: encodeURIComponent(''),
      wxVisible: false
    }
  },
  mounted() {
    this.getShareData()
  },
  methods: {
    getShareData() {
      this.url = encodeURIComponent(location.href)
      this.title = encodeURIComponent(document.title)
      const descriptionEle = document.getElementById('description')
      this.description = descriptionEle ? encodeURIComponent(descriptionEle.innerText) : ''
      const cover = document.getElementById('cover')
      this.cover = cover ? cover.src : ''
    },
    shareToQQ() {
      const url = `https://connect.qq.com/widget/shareqq/index.html?url='${this.url}&title=${this.title}&desc=${this.description}&summary=&site=${this.website}`
      this.openWindow(url)
    },
    shareToQzone() {
      const url = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${this.url}&title=${this.title}&pics=${this.cover}&desc=${this.description}&site=${this.website}`
      this.openWindow(url)
    },
    shareToWx() {
      if (this.$refs.qrcode.src) return
      const options = {
        errorCorrectionLevel: 'H',
        margin: 1.5,
        scale: 1,
        width: 256,
        color: {
          dark: '#409EFF',
          light: '#f5f5f5'
        }
      }
      QRCode.toDataURL(this.url, options, (err, url) => {
        if (err) throw err
        this.$refs.qrcode.src = url
      })
    },
    shareToSina() {
      const param = {
        url: this.url,
        appkey: '564047643',
        title: this.title,
        pic: this.cover,
        rnd: new Date().getTime()
      }
      const temp = []
      for (const q in param) {
        temp.push(q + '=' + encodeURIComponent(param[q] || ''))
      }
      const url = `http://v.t.sina.com.cn/share/share.php?${temp.join('&')}`
      this.openWindow(url)
    },
    openWindow(url, width = 850, height = 650) {
      window.open(url, '', `width = ${width}, height = ${height}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.share{
  padding: 10px 15px;
  text-align: center;
  &-icon{
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-right: 3px;
    background-color: var(--bg-normal);
    font-size: 22px;
    line-height: 40px;
    border-radius: 50%;
  }
  .el-icon-share{
    margin-right: 3px;
    color: var(--color-primary);
    font-size: 24px;
    line-height: 40px;
  }
  &-item{
    display: inline-block;
    width: 40px;
    height: 40px;
    margin: 0 3px;
    background-image: url('~@/assets/image/share-icon.png');
    vertical-align: bottom;
    cursor: pointer;
  }
  .QQ{
    background-position: 0 0;
  }
  .Qzone{
    background-position: -40px 0;
  }
  .Wx{
    background-position: -80px 0;
  }
  .Sina{
    background-position: -120px 0;
  }
}
.qrcode-wrap{
  p{
    padding-top: 10px;
    color: var(--color-secondary);
    font-size: 15px;
    text-align: center;
  }
}
</style>
