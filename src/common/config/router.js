module.exports = [
  [/\/cms\/restful\/(\w+)(?:\/(.*))?/, 'cms/restful/:1?id=:2', 'rest'],
  [/^\/rss(?:\.xml)?\/?$/i, 'xml/rss'],
  [/^\/sitemap(?:\.xml)?\/?$/i, 'xml/sitemap']
]
