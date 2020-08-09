const Base = require('./base.js');
const axios = require('axios');

module.exports = class extends Base {
  async refreshAction() {
    await think.cache('column', null);
    await think.cache('config', null);
  }

  async clearCacheAction() {
    const { type, list } = this.get();
    const APIURL = `https://cdn.tencentcloudapi.com/?Action=${type === 'path' ? 'PurgePathCache' : 'PurgeUrlsCache'}`;
    await axios.post(APIURL,
      {
        headers: {
          'X-TC-Action': '',
          'X-TC-Region': '',
          'X-TC-Timestamp': 0,
          'X-TC-Version': '2018-06-06',
          'Authorization': ''
        },
        params: {
          FlushType: 'flush',
          ...list.map((item, index) => {
            const format = {};
            const key = type === 'path' ? `Paths.${index}` : `Urls.${index}`;
            format[key] = item;
            return format;
          })
        }
      }
    ).then(response => {
      console.log(response.data);
    });
  }
};
