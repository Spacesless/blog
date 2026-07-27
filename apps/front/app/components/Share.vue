<template>
  <div class="share relative border-t border-[var(--border-color)]">
    <ul
      v-if="isShowCode"
      class="share-pay clearfix py-4 px-[var(--grid-space)] text-center border-b border-[var(--border-color)]"
    >
      <li class="inline-block mx-[calc(var(--grid-space)*2)]">
        <img class="share-pay__qrcode w-75 max-w-full h-auto" :src="sponsorWx" alt="wx">
      </li>
      <li class="inline-block mx-[calc(var(--grid-space)*2)]">
        <img class="share-pay__qrcode w-75 max-w-full h-auto" :src="sponsorAlipay" alt="alipay">
      </li>
    </ul>
    <div class="share-body clearfix py-4 px-[var(--grid-space)]">
      <div class="share-sponsor float-left cursor-pointer" @click="toggleCodeShow">
        <el-tooltip effect="dark" content="给我打钱" placement="bottom">
          <span class="share-item share-item--sponsor mr-2" />
        </el-tooltip>
        <span class="share-sponsor__tooltips leading-9 text-[var(--color-secondary)]">{{ isShowCode ? '下次一定' : '请我喝[茶]~(￣▽￣)~*' }}</span>
      </div>
      <div class="share-community float-right">
        <el-tooltip effect="dark" content="分享到新浪微博" placement="bottom">
          <span class="share-item share-item--sina" @click="shareToSina" />
        </el-tooltip>
        <el-tooltip effect="dark" content="分享到微信" placement="bottom">
          <el-popover :visible="wxVisible" placement="bottom" :width="256">
            <div class="qrcode-wrap">
              <img ref="qrcodeRef" class="max-w-full h-auto" alt="">
              <p class="pt-2.5 text-[15px] text-center text-[var(--color-secondary)]">分享到微信</p>
            </div>
            <template #reference>
              <span class="share-item share-item--wx" @click="shareToWx" />
            </template>
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

<script setup lang="ts">
import QRCode from 'qrcode'
import sponsorWx from '~/assets/image/sponsor-wx.png'
import sponsorAlipay from '~/assets/image/sponsor-alipay.png'

const props = defineProps<{
  title?: string
  cover?: string
  description?: string
}>()

const isShowCode = ref(false)
const wxVisible = ref(false)
const shareUrl = ref('')
const website = ref('')
const shareTitle = ref('')
const qrcodeRef = ref<HTMLImageElement>()

onMounted(() => {
  shareUrl.value = encodeURIComponent(location.href)
  website.value = encodeURIComponent(location.origin)
  shareTitle.value = props.title || encodeURIComponent(document.title)
})

function toggleCodeShow() {
  isShowCode.value = !isShowCode.value
}

function openWindow(url: string, width = 850, height = 650) {
  window.open(url, '', `width=${width},height=${height}`)
}

function shareToQQ() {
  const url = `https://connect.qq.com/widget/shareqq/index.html?url=${shareUrl.value}&title=${shareTitle.value}&desc=${props.description || ''}&summary=&site=${website.value}`
  openWindow(url)
}

function shareToQzone() {
  const url = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${shareUrl.value}&title=${shareTitle.value}&pics=${props.cover || ''}&desc=${props.description || ''}&site=${website.value}`
  openWindow(url)
}

function shareToWx() {
  wxVisible.value = !wxVisible.value
  if (!wxVisible.value || qrcodeRef.value?.src) return
  const options = {
    errorCorrectionLevel: 'H' as const,
    margin: 1.5,
    scale: 1,
    width: 256,
    color: {
      dark: '#1890ff',
      light: '#f5f5f5',
    },
  }
  QRCode.toDataURL(decodeURIComponent(shareUrl.value), options, (err, url) => {
    if (err) throw err
    if (qrcodeRef.value) qrcodeRef.value.src = url
  })
}

function shareToSina() {
  const params = new URLSearchParams({
    url: shareUrl.value,
    appkey: '564047643',
    title: shareTitle.value,
    pic: props.cover || '',
    rnd: String(Date.now()),
  })
  openWindow(`http://v.t.sina.com.cn/share/share.php?${params}`)
}
</script>

<style lang="scss" scoped>
$iconWidth: 36px;

.share-item {
  display: inline-block;
  width: $iconWidth;
  height: $iconWidth;
  margin-left: 8px;
  vertical-align: bottom;
  cursor: pointer;
  background-image: url('~/assets/image/share-icon.png');

  &--sponsor {
    margin-left: 0;
    background-position: 0 0;
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
</style>
