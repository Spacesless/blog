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
    // 不能使用 ctx.origin：它取自请求的 Origin 头，admin 前端经代理转发后
    // Origin 仍为前端地址（如 http://localhost:3001），会导致站点地址错误。
    // 这里基于 protocol + host 构造 server 自身地址（代理 changeOrigin 后 host 即 server 地址）。
    return `${this.ctx.protocol}://${this.ctx.host}`;
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
