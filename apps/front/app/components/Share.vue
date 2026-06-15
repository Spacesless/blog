<template>
  <div class="border-t border-[var(--border-color)]">
    <div class="p-4 px-[var(--grid-space)] clearfix">
      <div class="float-right">
        <el-tooltip effect="dark" content="分享到新浪微博" placement="bottom">
          <span class="inline-flex w-9 h-9 ml-2 items-center justify-center text-lg text-[var(--color-secondary)] cursor-pointer bg-[var(--bg)] rounded-full hover:text-[var(--color-primary)]" @click="shareToSina">
            <Icon name="ph:share-network" />
          </span>
        </el-tooltip>
        <el-tooltip effect="dark" content="分享到QQ好友" placement="bottom">
          <span class="inline-flex w-9 h-9 ml-2 items-center justify-center text-lg text-[var(--color-secondary)] cursor-pointer bg-[var(--bg)] rounded-full hover:text-[var(--color-primary)]" @click="shareToQQ">
            <Icon name="ph:chat-circle" />
          </span>
        </el-tooltip>
        <el-tooltip effect="dark" content="分享到QQ空间" placement="bottom">
          <span class="inline-flex w-9 h-9 ml-2 items-center justify-center text-lg text-[var(--color-secondary)] cursor-pointer bg-[var(--bg)] rounded-full hover:text-[var(--color-primary)]" @click="shareToQzone">
            <Icon name="ph:planet" />
          </span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  cover?: string
  description?: string
}>()

const shareUrl = ref('')
const website = ref('')
const shareTitle = ref('')

onMounted(() => {
  shareUrl.value = encodeURIComponent(location.href)
  website.value = encodeURIComponent(location.origin)
  shareTitle.value = props.title || encodeURIComponent(document.title)
})

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

function shareToSina() {
  const params = new URLSearchParams({
    url: shareUrl.value,
    title: shareTitle.value,
    pic: props.cover || '',
    rnd: String(Date.now()),
  })
  openWindow(`http://v.t.sina.com.cn/share/share.php?${params}`)
}
</script>
