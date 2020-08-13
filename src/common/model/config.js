module.exports = class extends think.Model {
  /**
   * 获取config表配置
   * @return {Object} config表配置信息
   */
  async getConfig() {
    const rows = await this.cache('config', { timeout: 7 * 24 * 3600 * 1000 }).select()
    const ret = {}
    rows.forEach(item => {
      ret[item.name] = item.value
    })

    return ret
  }
  /**
   * 更新config表配置
   * @return {Object} config表配置信息
   */
  async updateConfig(data) {
    const promises = []
    for (const name in data) {
      const value = data[name]
      const exist = await this.where({ name }).count('name')
      let step
      if (exist) {
        step = this.where({ name }).update({ value })
      }
      promises.push(step)
    }
    const rows = await Promise.all(promises)
    const ret = {}
    rows.forEach(item => {
      ret[item.name] = item.value
    })

    await think.cache('config', null)
    return ret
  }
}
