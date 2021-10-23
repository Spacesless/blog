const path = require('path')

const isPro = process.env.NODE_ENV === 'production'
const srcDir = 'client/admin/'

function resolve(dir) {
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
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ]
      ]
    },
    extractCSS: true,
    extend(config, ctx) {
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
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          element: {
            name: 'element', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than vendor and app or it will be packaged into vendor or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          common: {
            name: 'common',
            minChunks: 2
          }
        }
      },
      runtimeChunk: false
    },
    postcss: {
      'plugins': {
        // to edit target browsers: use "browserslist" field in package.json
        'autoprefixer': {}
      }
    },
    publicPath: '//cdn.timelessq.com/admin/' // 只需将www/admin上传cdn
  },
  buildDir: 'www/admin',
  buildModules: [
    '@nuxtjs/router'
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
    dir: 'www/admin',
    fallback: 'index.html'
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ]
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
  target: 'static'
}
