module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
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
        'languages': ['markup', 'css', 'javascript', 'json','bash', 'less', 'php', 'sql' ],
        'plugins': ['show-language', 'highlight-keywords','toolbar'],
        'css': false
      }
    ]
  ]
};
