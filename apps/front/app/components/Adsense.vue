<template>
  <div class="p-[var(--grid-space)] mb-[var(--grid-space)] overflow-hidden bg-[var(--bg-normal)] rounded-[var(--border-radius)] shadow-[var(--shadow-3-down)]">
    <h2 class="tl-card__title">恰饭区</h2>
    <div class="min-h-50 overflow-hidden relative">
      <div
        class="border border-dashed border-gray-300 text-gray-300 z-0 rounded-md h-full absolute top-0 left-0 w-full box-border flex items-center justify-center"
      >
        广告位招租
      </div>
      <ins
        class="adsbygoogle relative z-1"
        :style="insStyle"
        :data-ad-client="dataAdClient"
        :data-ad-slot="dataAdSlot"
        :data-ad-format="dataAdFormat"
        :data-full-width-responsive="dataFullWidthResponsive"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    insStyle?: string
    dataAdClient?: string
    dataAdSlot?: string
    dataAdFormat?: string
    dataFullWidthResponsive?: boolean
  }>(),
  {
    insStyle: 'display:block',
    dataAdClient: 'ca-pub-1379822583295856',
    dataAdSlot: '5847565467',
    dataAdFormat: 'auto',
    dataFullWidthResponsive: true,
  },
)

function initAdsense() {
  if (!import.meta.client) return
  const w = window as any
  if (!w.adsbygoogle) {
    const oHead = document.getElementsByTagName('head').item(0)
    const oScript = document.createElement('script')
    oScript.onload = () => {
      ;(w.adsbygoogle = w.adsbygoogle || []).push({})
    }
    oScript.type = 'text/javascript'
    oScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    oHead?.appendChild(oScript)
  } else {
    ;(w.adsbygoogle = w.adsbygoogle || []).push({})
  }
}

onMounted(() => {
  nextTick(initAdsense)
})
</script>
