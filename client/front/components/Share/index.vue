<template>
  <div class="share">
    <ul v-if="isShowCode" class="share-pay">
      <li class="share-pay-item">
        <img class="share-pay__qrcode img-fluid" :src="'/static/img/sponsor-wx.png' | getAbsolutePath" alt="wx">
      </li>
      <li class="share-pay-item">
        <img class="share-pay__qrcode img-fluid" :src="'/static/img/sponsor-alipay.png' | getAbsolutePath" alt="alipay">
      </li>
    </ul>
    <div class="share-body clearfix">
      <div class="share-sponsor" @click="toggleCodeShow">
        <el-tooltip effect="dark" content="给我打钱" placement="bottom">
          <span class="share-item share-item--sponsor" />
        </el-tooltip>
        <span class="share-sponsor__tooltips">{{ isShowCode ? '下次一定' : '请我喝[茶]~(￣▽￣)~*' }}</span>
      </div>
      <div class="share-community">
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
    </div>
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
      isShowCode: false,
      shareUrl: '',
      website: '',
      wxVisible: false
    }
  },
  mounted () {
    this.getShareData()
  },
  methods: {
    toggleCodeShow () {
      this.isShowCode = !this.isShowCode
    },
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
  border-top: 1px solid var(--border-color);

  &-pay {
    padding: 16px $grid-space;
    overflow: hidden;
    text-align: center;
    border-bottom: 1px solid var(--border-color);

    &-item {
      display: inline-block;
      margin: 0 $grid-space * 2;
    }

    &__qrcode {
      width: 300px;
    }
  }

  &-body {
    padding: 16px $grid-space;
  }

  &-sponsor {
    float: left;
    cursor: pointer;

    &__tooltips {
      line-height: $iconWidth;
      color: var(--color-secondary);
    }
  }

  &-community {
    float: right;
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

  &-item {
    display: inline-block;
    width: $iconWidth;
    height: $iconWidth;
    margin-left: 8px;
    vertical-align: bottom;
    cursor: pointer;
    background-image: url('~@/assets/image/share-icon.png');

    &--sponsor {
      margin-left: 0;
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
