module.exports = class extends think.Model {
  /**
   * 获取config表配置
   * @return {Object} config表配置信息
   */
  async getConfig() {
    const rows = await this.select();
    const result = {};
    rows.forEach(item => {
      result[item.key] = item.value;
    });

    return result;
  }

  /**
   * 更新config表配置
   * @return {Object} config表配置信息
   */
  async updateConfig(data) {
    const promises = [];
    for (const key in data) {
      const value = data[key];
      const exist = await this.where({ key }).count('key');
      let step;
      if (exist) {
        step = this.where({ key }).update({ value });
      }
      promises.push(step);
    }
    const rows = await Promise.all(promises);
    const result = {};
    rows.forEach(item => {
      result[item.key] = item.value;
    });

    await think.cache('config', null);
    return result;
  }
};
