export default defineNuxtPlugin(() => {
  if (import.meta.env.MODE === 'development') {
    return
  }

  var _hmt = _hmt || [];
  (function () {
    const hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?265655a20981cb779612259086df6494'
    const s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  })()
})
