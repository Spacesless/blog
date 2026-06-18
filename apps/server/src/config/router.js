module.exports = [
  [/\/admin\/restful\/(\w+)(?:\/(.*))?/, 'admin/restful/:1?id=:2', 'rest'],
  [/^\/rss(?:\.xml)?\/?$/i, 'front/xml/rss'],
  [/^\/sitemap(?:\.xml)?\/?$/i, 'front/xml/sitemap']
];
