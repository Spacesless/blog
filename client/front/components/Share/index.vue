<template>
  <div class="share">
    <span class="share__tooltips">请我喝[茶]~(￣▽￣)~*</span>
    <el-tooltip effect="dark" content="打赏" placement="bottom">
      <span class="share-item share-item--sponsor" @click="shareToSina" />
    </el-tooltip>
    <el-tooltip effect="dark" content="分享到新浪微博" placement="bottom">
      <span class="share-item share-item--sina" @click="shareToSina" />
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
        <span slot="reference" class="share-item share-item--wx" @click="shareToWx" />
      </el-popover>
    </el-tooltip>
    <el-tooltip effect="dark" content="分享到QQ好友" placement="bottom">
      <span class="share-item share-item--qq" @click="shareToQQ" />
    </el-tooltip>
    <el-tooltip effect="dark" content="分享到QQ空间" placement="bottom">
      <span class="share-item share-item--qzone" @click="shareToQzone" />
    </el-tooltip>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { primaryColor } from '@/styles/export-to-js.scss'

export default {
  name: 'ShareSponsor',
  props: {
    title: {
      type: String,
      default: ''
    },
    cover: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      shareUrl: '',
      website: '',
      wxVisible: false
    }
  },
  mounted () {
    this.getShareData()
  },
  methods: {
    getShareData () {
      this.shareUrl = encodeURIComponent(location.href)
      this.website = encodeURIComponent(location.origin)
      this.shareTitle = this.title || encodeURIComponent(document.title)
    },
    shareToQQ () {
      const url = `https://connect.qq.com/widget/shareqq/index.html?url='${this.shareUrl}&title=${this.shareTitle}&desc=${this.description}&summary=&site=${this.website}`
      this.openWindow(url)
    },
    shareToQzone () {
      const url = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${this.shareUrl}&title=${this.shareTitle}&pics=${this.cover}&desc=${this.description}&site=${this.website}`
      this.openWindow(url)
    },
    shareToWx () {
      if (this.$refs.qrcode.src) { return }
      const options = {
        errorCorrectionLevel: 'H',
        margin: 1.5,
        scale: 1,
        width: 256,
        color: {
          dark: primaryColor,
          light: '#f5f5f5'
        }
      }
      QRCode.toDataURL(this.shareUrl, options, (err, url) => {
        if (err) { throw err }
        this.$refs.qrcode.src = url
      })
    },
    shareToSina () {
      const param = {
        url: this.shareUrl,
        appkey: '564047643',
        title: this.shareTitle,
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
    openWindow (url, width = 850, height = 650) {
      window.open(url, '', `width = ${width}, height = ${height}`)
    }
  }
}
</script>

<style lang="scss" scoped>
$iconWidth: 36px;

.share {
  position: relative;
  padding: 12px 20px;
  text-align: right;
  border-top: 1px solid var(--border-color);

  &__tooltips {
    position: absolute;
    left: 20px;
    line-height: $iconWidth;
    color: var(--color-secondary);
  }

  &-icon {
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-right: 3px;
    font-size: 22px;
    line-height: 40px;
    background-color: var(--bg-normal);
    border-radius: 50%;
  }

  .el-icon-share {
    margin-right: 3px;
    font-size: 24px;
    line-height: 40px;
    color: var(--color-primary);
  }

  &-item {
    display: inline-block;
    width: $iconWidth;
    height: $iconWidth;
    margin-left: 8px;
    vertical-align: bottom;
    cursor: pointer;
    background-image: url('~@/assets/image/share-icon.png');

    &--sponsor {
      background-position: -0 0;
    }

    &--wx {
      background-position: -$iconWidth 0;
    }

    &--sina {
      background-position: -$iconWidth * 2 0;
    }

    &--qzone {
      background-position: -$iconWidth * 3 0;
    }

    &--qq {
      background-position: -$iconWidth * 4 0;
    }
  }
}

.qrcode-wrap {
  p {
    padding-top: 10px;
    font-size: 15px;
    color: var(--color-secondary);
    text-align: center;
  }
}
</style>
