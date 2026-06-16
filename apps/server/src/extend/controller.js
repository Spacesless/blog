const isProd = think.env === "production";
const CDNdomain = "//cdn.timelessq.com";

function getUrlPrefix() {
  const { controller } = this.ctx;
  // admin后台管理不需要CDN
  const isUseCdn = !controller.includes("admin");
  return isProd && isUseCdn ? CDNdomain : this.siteurl;
}

module.exports = {
  /**
   * 网站地址
   * @summary node服务端的地址，首页、图片等资源都依赖该地址
   */
  get siteurl() {
    // Koa 3.x: ctx.origin 返回请求头中的 origin，可能为 null。
    // 这里使用 protocol + host 构造站点地址（协议前缀被移除以兼容 // 前缀引用）。
    const origin = this.ctx.origin || `${this.ctx.protocol}://${this.ctx.host}`;
    return origin.replace(/http:|https:/, "");
  },

  /**
   * 获取绝对路径
   * @param {String} src 源路径
   * @returns {String}
   */
  getAbsolutePath(src) {
    const prefix = getUrlPrefix.call(this);
    return src ? prefix + src : "";
  },

  /**
   * 获取内容图片绝对地址
   * @param {String} content 内容
   * @returns {String}
   */
  getContentAbsolutePath(content) {
    const prefix = getUrlPrefix.call(this);
    return content
      ? content.replace(
          new RegExp('src="/upload', "gi"),
          `src="${prefix}/upload`,
        )
      : "";
  },
};
