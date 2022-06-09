module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order'
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
  plugins: [
    'stylelint-order'
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy'
  }
}
