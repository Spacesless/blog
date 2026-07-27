/**
 * slugify 工具：将任意标题转换为 URL 友好的 slug
 * 规则：trim → 小写 → 去重音 → 非 [a-z0-9]+ 替换为 - → 去首尾 - → 截断至 80 字符
 * 中文等非 ASCII 字符会被剥离；如结果为空，由调用方提供兜底
 */

const MAX_LENGTH = 80;
const SLUG_PATTERN = /^[a-z0-9-]{1,80}$/;

/**
 * 基础 slugify 转换（不查重）
 * @param {String} input 原始字符串
 * @returns {String} 转换后的 slug（可能为空）
 */
function toSlug(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // 去除重音符号
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // 非 ASCII 字母数字 ⇒ -
    .replace(/^-+|-+$/g, '') // 去首尾 -
    .slice(0, MAX_LENGTH)
    .replace(/-+$/g, '');
}

/**
 * 校验 slug 是否合法
 * @param {String} slug
 * @returns {Boolean}
 */
function isValidSlug(slug) {
  return SLUG_PATTERN.test(slug);
}

/**
 * 确保 slug 在数据表中唯一，冲突时追加 -2, -3 ...
 * @param {Object} model think.Model 实例
 * @param {String} baseSlug 基础 slug
 * @param {Number|String} excludeId 更新时需排除的自身 id
 * @returns {Promise<String>} 最终可用的唯一 slug
 */
async function ensureUniqueSlug(model, baseSlug, excludeId) {
  let slug = baseSlug;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const where = { pathname: slug };
    if (excludeId) {
      where.id = ['!=', excludeId];
    }
    const exist = await model.where(where).field('id').find();
    if (think.isEmpty(exist)) return slug;
    const tail = `-${suffix}`;
    slug = baseSlug.slice(0, MAX_LENGTH - tail.length) + tail;
    suffix++;
  }
}

/**
 * 根据 title 生成唯一 slug；若 title 转换后为空，使用 fallbackPrefix-id 兜底
 * @param {Object} options
 * @param {Object} options.model think.Model 实例
 * @param {String} options.title 标题
 * @param {String} options.fallbackPrefix 兜底前缀，例如 'article' / 'bangumi'
 * @param {Number|String} [options.fallbackId] 已知 id（更新时），用作兜底
 * @param {Number|String} [options.excludeId] 更新时需排除的自身 id
 * @returns {Promise<String>}
 */
async function generateSlug({ model, title, fallbackPrefix, fallbackId, excludeId }) {
  let base = toSlug(title);
  if (!base) {
    base = fallbackId ? `${fallbackPrefix}-${fallbackId}` : fallbackPrefix;
  }
  return ensureUniqueSlug(model, base, excludeId);
}

module.exports = {
  toSlug,
  isValidSlug,
  ensureUniqueSlug,
  generateSlug
};
