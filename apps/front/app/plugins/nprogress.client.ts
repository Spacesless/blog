import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

export default defineNuxtPlugin(() => {
  nprogress.configure({
    showSpinner: false,
  })

  // 在路由开始时显示加载条
  useRouter().beforeEach(() => {
    nprogress.start()
  })

  // 在路由完成时隐藏加载条
  useRouter().afterEach(() => {
    nprogress.done()
  })
})
