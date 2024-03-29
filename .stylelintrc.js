module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue'
  ],
  plugins: [
    'stylelint-order'
  ],
  overrides: [
    {
      customSyntax: 'postcss-scss',
      files: ['**/*.css', '**/*.scss']
    },
    {
      customSyntax: 'postcss-html',
      files: ['**/*.html', '**/*.vue']
    }
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',
    // 类选择器的命名规则
    "selector-class-pattern": ".",
    // 指定字符串使用单引号或双引号 "single"|"double"
    "string-quotes": "single",
    // 颜色指定大写
    "color-hex-case": "upper",
    // 禁止空块
    'block-no-empty': true,
    // 颜色6位长度
    "color-hex-length": "long",
    // 兼容自定义标签名
    "selector-type-no-unknown": [true, {
      "ignoreTypes": []
    }],
    "max-line-length": null,
    // 忽略伪类选择器 ::v-deep
    "selector-pseudo-element-no-unknown": [true, {
      "ignorePseudoElements": ["/./","v-deep", '/deep/', '-webkit-']
    }],
    // 禁止低优先级的选择器出现在高优先级的选择器之后。
    "no-descending-specificity": null,
    // 不验证@未知的名字，为了兼容scss的函数
    "at-rule-no-unknown": null,
    // 禁止空注释
    "comment-no-empty": true,
    // 禁止简写属性的冗余值
    "shorthand-property-no-redundant-values": true,
    "selector-pseudo-class-no-unknown": [true, {
      "ignorePseudoClasses": ['/./', '-webkit-']
    }],
    // 禁止值的浏览器引擎前缀
    "value-no-vendor-prefix": [true,
    {
      "ignoreValues": "box"
    }],
    // 禁止属性的浏览器引擎前缀
    "property-no-vendor-prefix": [
      true,
      {
        "ignoreProperties": [ /./]
      }
    ],
    // 禁止小于 1 的小数有一个前导零
    "number-leading-zero": "never",
    // 禁止空第一行
    "no-empty-first-line": true,
    // 属性的排序
    "order/properties-order": [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'box-sizing',
      'display',
      'flex',
      'flex-align',
      'flex-basis',
      'flex-direction',
      'flex-wrap',
      'flex-flow',
      'flex-shrink',
      'flex-grow',
      'flex-order',
      'flex-pack',
      'align-content',
      'align-items',
      'align-self',
      'justify-content',
      'order',
      'float',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'overflow',
      'overflow-x',
      'overflow-y',
      '-webkit-overflow-scrolling',
      '-ms-overflow-x',
      '-ms-overflow-y',
      '-ms-overflow-style',
      'columns',
      'column-count',
      'column-fill',
      'column-gap',
      'column-rule',
      'column-rule-width',
      'column-rule-style',
      'column-rule-color',
      'column-span',
      'column-width',
      'orphans',
      'widows',
      'clip',
      'clear',
      'font',
      'font-family',
      'font-size',
      'font-style',
      'font-weight',
      'font-variant',
      'font-size-adjust',
      'font-stretch',
      'font-effect',
      'font-emphasize',
      'font-emphasize-position',
      'font-emphasize-style',
      'font-smooth',
      'src',
      'hyphens',
      'line-height',
      'color',
      'text-align',
      'text-align-last',
      'text-emphasis',
      'text-emphasis-color',
      'text-emphasis-style',
      'text-emphasis-position',
      'text-decoration',
      'text-indent',
      'text-justify',
      'text-outline',
      '-ms-text-overflow',
      'text-overflow',
      'text-overflow-ellipsis',
      'text-overflow-mode',
      'text-shadow',
      'text-transform',
      'text-wrap',
      '-webkit-text-size-adjust',
      '-ms-text-size-adjust',
      'letter-spacing',
      '-ms-word-break',
      'word-break',
      'word-spacing',
      '-ms-word-wrap',
      'word-wrap',
      'overflow-wrap',
      'tab-size',
      'white-space',
      'vertical-align',
      'direction',
      'unicode-bidi',
      'list-style',
      'list-style-position',
      'list-style-type',
      'list-style-image',
      'pointer-events',
      '-ms-touch-action',
      'touch-action',
      'cursor',
      'visibility',
      'zoom',
      'table-layout',
      'empty-cells',
      'caption-side',
      'border-spacing',
      'border-collapse',
      'content',
      'quotes',
      'counter-reset',
      'counter-increment',
      'resize',
      'user-select',
      'nav-index',
      'nav-up',
      'nav-right',
      'nav-down',
      'nav-left',
      'background',
      'background-color',
      'background-image',
      'filter',
      'background-repeat',
      'background-attachment',
      'background-position',
      'background-position-x',
      'background-position-y',
      'background-clip',
      'background-origin',
      'background-size',
      'border',
      'border-color',
      'border-style',
      'border-width',
      'border-top',
      'border-top-color',
      'border-top-style',
      'border-top-width',
      'border-right',
      'border-right-color',
      'border-right-style',
      'border-right-width',
      'border-bottom',
      'border-bottom-color',
      'border-bottom-style',
      'border-bottom-width',
      'border-left',
      'border-left-color',
      'border-left-style',
      'border-left-width',
      'border-radius',
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-image',
      'border-image-source',
      'border-image-slice',
      'border-image-width',
      'border-image-outset',
      'border-image-repeat',
      'outline',
      'outline-width',
      'outline-style',
      'outline-color',
      'outline-offset',
      'box-shadow',
      'opacity',
      '-ms-interpolation-mode',
      'page-break-after',
      'page-break-before',
      'page-break-inside',
      'transition',
      'transition-delay',
      'transition-timing-function',
      'transition-duration',
      'transition-property',
      'transform',
      'transform-origin',
      'perspective',
      'appearance',
      'animation',
      'animation-name',
      'animation-duration',
      'animation-play-state',
      'animation-timing-function',
      'animation-delay',
      'animation-iteration-count',
      'animation-direction',
      'animation-fill-mode',
      'fill',
      'stroke'
    ]
  }
}
