const path = require('path')

let isPro = process.env.NODE_ENV === 'production'
try {
  // eslint-disable-next-line no-undef
  isPro = think.env === 'production' // 作为thinkjs中间件可以获取全局的think对象
} catch {}

const srcDir = 'client/admin/'

function resolve (dir) {
  return path.join(__dirname, '../', srcDir, dir)
}

module.exports = {
  alias: {
    '#': resolve('../common')
  },
  axios: {
    proxy: true,
    prefix: '/admin'
  },
  build: {
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ]
    },
    extractCSS: true,
    extend (config, ctx) {
      // set svg-sprite-loader
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
      svgRule.exclude = [resolve('assets/icons/svg')]
      // Includes /icons/svg for svg-sprite-loader
      config.module.rules.push({
        test: /\.svg$/,
        include: [resolve('assets/icons/svg')],
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]'
        }
      })
    },
    publicPath: '//cdn.timelessq.com/nuxt-admin/', // 只需将www/admin上传cdn
    postcss: true,
    transpile: [/^element-ui/]
  },
  buildDir: isPro ? 'www/nuxt-admin' : '.nuxt/admin',
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/router',
  ],
  css: [
    '@/styles/index.scss'
  ],
  plugins: [
    '@/plugins/axios',
    '@/plugins/api',
    '@/plugins/element-ui',
    '@/plugins/svg-icon'
  ],
  generate: {
    dir: 'www/nuxt-admin',
    fallback: 'index.html'
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ]
  },
  loading: {
    color: '#409EFF',
    failedColor: '#F56C6C',
    continuous: true
  },
  modern: isPro, // 现代模式
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: {
    '/admin': {
      target: 'http://127.0.0.1:8360', // 目标接口域名
      changeOrigin: true // 表示是否跨域
    }
  },
  render: {
    compressor: false // 禁用中间件压缩
    // resourceHints: false  // 添加prefetch并preload链接以加快初始页面加载时间。
  },
  router: {
    middleware: ['permission']
  },
  server: {
    port: 9528
  },
  srcDir,
  ssr: false,
  target: 'static',
  telemetry: false // 关闭收集遥测数据
}
