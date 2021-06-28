const isPro = process.env.NODE_ENV === 'production'

module.exports = {
  modern: isPro, // 现代模式
  srcDir: 'client/admin/',
  target: 'static',
  ssr: false,
  telemetry: false, // 关闭收集遥测数据
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ]
  },
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  plugins: [
    '@/plugins/element-ui'
  ],
  modules: [
    '@nuxtjs/axios'
  ],
  generate: {
    dir: 'www/admin'
  },
  build: {
    publicPath: '//cdn.timelessq.com/admin/', // 只需将www/admin上传cdn
    babel: {
      plugins: [
        [
          'component',
          {
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ]
      ]
    },
    extractCSS: true,
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : 'js/app.[contenthash:8].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : 'js/chunk-[name].[contenthash:8].js',
      css: ({ isDev }) => isDev ? '[name].css' : 'css/chunk-[name].[contenthash:8].css',
      img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[name].[contenthash:8].[ext]',
      font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[name].[contenthash:8].[ext]'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          commons: false,
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            minChunks: 2,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          element: {
            name: 'element', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than vendor and app or it will be packaged into vendor or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          }
        }
      },
      runtimeChunk: false
    }
  },
  buildDir: '.nuxt/admin',
  render: {
    compressor: false // 禁用中间件压缩
    // resourceHints: false  // 添加prefetch并preload链接以加快初始页面加载时间。
  }
}
