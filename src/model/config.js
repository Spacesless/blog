module.exports = class extends think.Model {
  /**
   * 获取config表配置
   * @return {Object} config表配置信息
   */
  async getCacheConfig() {
    const rows = await this.cache('config', { timeout: 90 * 24 * 3600 * 1000 }).select();
    const result = {};
    rows.forEach(item => {
      result[item.key] = item.value;
    });

    return result;
  }
};
