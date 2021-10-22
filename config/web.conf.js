const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

const isPro = process.env.NODE_ENV === 'production'
const srcDir = 'client/web/'

function resolve(dir) {
  return path.join(__dirname, '../', srcDir, dir)
}

module.exports = {
  alias: {
    '#': resolve('../common')
  },
  buildModules: ['@nuxtjs/color-mode'],
  build: {
    babel: {
      plugins: [
        [
          'component',
          {
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ],
        [
          'prismjs',
          {
            'languages': ['markup', 'css', 'javascript', 'json', 'bash', 'less', 'php', 'sql'],
            'plugins': ['line-numbers', 'show-language', 'highlight-keywords', 'toolbar'],
            'css': false
          }
        ]
      ]
    },
    extractCSS: true,
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
      }
    },
    postcss: {
      'plugins': {
        // to edit target browsers: use "browserslist" field in package.json
        'autoprefixer': {}
      }
    },
    plugins: [
      new CompressionPlugin({
        test: /.(js|css|woff|ttf)$/, // 匹配需要压缩的文件后缀 看需求
        threshold: 10240 // 大于10kb的会压缩，默认为0
      })
    ],
    publicPath: '//cdn.timelessq.com/web/dist/client' // 只需将www/web上传cdn
  },
  buildDir: 'www/web',
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/styles/global.scss'
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
    '@/plugins/filters'
  ],
  render: {
    compressor: false // 禁用中间件压缩
    // resourceHints: false  // 添加prefetch并preload链接以加快初始页面加载时间。
  },
  srcDir,
  telemetry: false // 关闭收集遥测数据
}
