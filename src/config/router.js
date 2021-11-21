module.exports = [
  [/\/admin\/restful\/(\w+)(?:\/(.*))?/, 'admin/restful/:1?id=:2', 'rest'],
  [/^\/rss(?:\.xml)?\/?$/i, 'web/xml/rss'],
  [/^\/sitemap(?:\.xml)?\/?$/i, 'web/xml/sitemap']
];
