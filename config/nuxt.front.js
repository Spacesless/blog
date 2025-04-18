const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

let isPro = process.env.NODE_ENV === 'production'
try {
  // eslint-disable-next-line no-undef
  isPro = think.env === 'production' // 作为thinkjs中间件可以获取全局的think对象
} catch {}

const srcDir = 'client/front/'

function resolve (dir) {
  return path.join(__dirname, '../', srcDir, dir)
}

module.exports = {
  alias: {
    '#': resolve('../common')
  },
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/color-mode',
    '@nuxtjs/style-resources'
  ],
  build: {
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: '../packages/theme-chalk/src',
            ext: '.scss'
          }
        ],
        [
          'prismjs',
          {
            languages: ['markup', 'css', 'javascript', 'json', 'less', 'scss', 'shell', 'typescript'],
            plugins: ['show-language', 'line-numbers', 'toolbar'],
            css: false
          }
        ]
      ]
    },
    extractCSS: true,
    plugins: [
      new CompressionPlugin({
        test: /.(js|css|woff|ttf)$/, // 匹配需要压缩的文件后缀 看需求
        threshold: 10240 // 大于10kb的会压缩，默认为0
      })
    ],
    publicPath: '//cdn.timelessq.com/nuxt-front/dist/client', // 只需将www/front上传cdn
    transpile: [/^element-ui/]
  },
  buildDir: isPro ? 'www/nuxt-front' : '.nuxt/front',
  css: [
    '@/styles/index.scss'
  ],
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'renderer', content: 'webkit' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1,shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'author', content: 'Timeless' }
    ]
  },
  loading: {
    color: '#409EFF',
    failedColor: '#F56C6C',
    continuous: true
  },
  modern: isPro, // 现代模式
  modules: [
    '@nuxtjs/axios'
  ],
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios',
    '@/plugins/filters',
    { src: '@/plugins/baidu-analytics', mode: 'client' }
  ],
  render: {
    compressor: false // 禁用中间件压缩
    // resourceHints: false  // 添加prefetch并preload链接以加快初始页面加载时间。
  },
  srcDir,
  styleResources: {
    scss: resolve('/styles/settings/variables.scss')
  },
  telemetry: false // 关闭收集遥测数据
}
