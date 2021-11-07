const path = require('path');
const { Nuxt, Builder } = require('nuxt');

module.exports = options => {
  const config = require(path.join(think.ROOT_PATH, 'config/nuxt.web.js'));
  config.dev = options.isDev;

  const nuxt = new Nuxt(config);

  if (options.isDev) {
    new Builder(nuxt).build();
  }

  const middleware = async(ctx, next) => {
    // Default 404
    ctx.status = options.status || 200;
    ctx.req.session = await ctx.session();
    await nuxt.render(ctx.req, ctx.res);

    let err = null;
    return next().catch(e => {
      err = e;
    }).then(() => {
      if (err) {
        return Promise.reject(err);
      }
      // 如果后续执行逻辑有错误，则将错误返回
      return new Promise((resolve, reject) => {
        return { resolve, reject };
      });
    });
  };
  return middleware;
};
