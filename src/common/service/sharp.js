const path = require('path');
const sharp = require('sharp');

module.exports = class extends think.Service {
  /**
   * 创建目录
   * @param {String} dest 输入目录
   */
  mkdirDest(dest) {
    const destDir = path.dirname(dest);
    // 判断目录是否存在，没有则创建目录
    if (!think.isExist(destDir)) {
      return think.mkdir(destDir);
    }
    return true;
  }

  /**
   * 调整图像大小
   * @param {String} src 源图片地址
   * @param {Object} resizeOpts 裁剪图片参数 { width, height, fit, position, background }
   * @summary fit {0:'cover', 1:'contain', 2:'fill', 3: 'inside', 4: 'outside'}
   * cover：裁剪以覆盖两个提供的尺寸（默认值）。
   * contain：嵌入两个提供的尺寸。
   * fill：忽略输入的纵横比并拉伸到两个提供的尺寸。
   * inside：保留纵横比，将图像调整为尽可能大，同时确保其尺寸小于或等于指定的尺寸。
   * outside：保留纵横比，将图像调整为尽可能小，同时确保其尺寸大于或等于指定的尺寸。
   * @summary {String} position top，right top，right，right bottom，bottom，left bottom，left，left top
   * @summary background 背景颜色 { r, g, b, alpha }
   * @param {Object} outputOpts 目标图片参数 { quality: jpg/webp的压缩质量, lossless: webp无损压缩, compressionLevel: png的zlib压实级别 }
   * @see https://sharp.pixelplumbing.com/api-output
   */
  async resizeAndCrop(src, resizeOpts, outputOpts) {
    const { width, height, fit, position, background } = resizeOpts;
    const { format } = outputOpts; // 文件格式

    let result;

    const fileSrc = path.join(think.RESOURCE_PATH, src);
    // 源文件不存在或宽高未提供
    if (!think.isExist(fileSrc) || (!width && !height)) {
      return '';
    }

    const destDirname = `${path.dirname(src)}/thumb`;
    const dest = `${destDirname}/${path.basename(src)}@${width}x${height}.${format}`;
    const destAbsolutePath = path.join(think.RESOURCE_PATH, dest);

    if (think.isExist(path.join(think.RESOURCE_PATH, dest))) {
      // 如果已经存在则直接返回
      return dest;
    } else {
      const isMkdir = this.mkdirDest(destAbsolutePath);
      if (!isMkdir) {
        // 创建目录失败
        return '';
      }
    }

    // 先调整图像大小
    const fitEnum = ['cover', 'contain', 'fill', 'inside', 'outside'];
    const hasBackgroundEnum = ['png', 'webp', 'tile'];
    const image = await sharp(fileSrc)
      .resize(width, height, {
        fit: fitEnum[fit] || 'cover',
        position,
        background: background || (
          hasBackgroundEnum.includes(format)
            ? { r: 255, g: 255, b: 255, alpha: 0 }
            : { r: 255, g: 255, b: 255, alpha: 1 }
        )
      });

    // 再根据输出格式生成文件
    switch (format) {
      case 'png':
        result = await image.png(outputOpts)
          .toFile(destAbsolutePath)
          .catch(error => console.error(error, fileSrc));
        break;
      case 'webp':
        result = await image.webp(outputOpts)
          .toFile(destAbsolutePath)
          .catch(error => console.error(error, fileSrc));
        break;
      case 'jpg':
      case 'jpeg':
        result = await image.jpeg(think.extend(outputOpts, {
          chromaSubsampling: '4:4:4',
          mozjpeg: true
        })).toFile(destAbsolutePath)
          .catch(error => console.error(error, fileSrc));
        break;
    }

    return result ? dest : '';
  }
};