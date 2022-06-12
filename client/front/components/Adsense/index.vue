<template>
  <div class="adsense tl-card">
    <h2 class="tl-card__title">
      恰饭区
    </h2>
    <ins
      :class="insClass"
      :style="insStyle"
      :data-ad-client="dataAdClient"
      :data-ad-slot="dataAdSlot"
      :data-ad-format="dataAdFormat"
      :data-full-width-responsive="dataFullWidthResponsive"
    />
  </div>
</template>

<script>
export default {
  name: 'GoogleAdsense',
  props: {
    insClass: {
      type: String,
      default: 'adsbygoogle'
    },
    insStyle: {
      type: String,
      default: 'display:block'
    },
    dataAdClient: {
      type: String,
      default: 'ca-pub-1379822583295856'
    },
    dataAdSlot: {
      type: String,
      default: '5847565467'
    },
    dataAdFormat: {
      type: String,
      default: 'auto'
    },
    dataFullWidthResponsive: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.initAdsense()
  },
  methods: {
    initAdsense () {
      if (!window.adsbygoogle) {
        const oHead = document.getElementsByTagName('head').item(0)

        const oScript = document.createElement('script')

        oScript.onload = function () {
          // eslint-disable-next-line no-undef
          (adsbygoogle = window.adsbygoogle || []).push({})
        }

        oScript.type = 'text/javascript'

        oScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

        oHead.appendChild(oScript)
      } else {
        // eslint-disable-next-line no-undef
        (adsbygoogle = window.adsbygoogle || []).push({})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.adsense {
  padding: $grid-space;
  margin-bottom: $grid-space;
}
</style>
