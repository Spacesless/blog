module.exports = [
  [/\/admin\/restful\/(\w+)(?:\/(.*))?/, 'admin/restful/:1?id=:2', 'rest'],
  [/^\/rss(?:\.xml)?\/?$/i, 'xml/rss'],
  [/^\/sitemap(?:\.xml)?\/?$/i, 'xml/sitemap']
];
