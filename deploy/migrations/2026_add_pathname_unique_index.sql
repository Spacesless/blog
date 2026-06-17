-- ============================================================
-- 为 tl_article 与 tl_bangumi 的 pathname 字段添加唯一索引
-- 用作 Slugify ID（友好 URL slug）
-- 说明：MySQL 唯一索引允许多个 NULL 值，存量 pathname 为 NULL 的记录互不冲突
-- ============================================================

ALTER TABLE `tl_article` ADD UNIQUE INDEX `uniq_pathname` (`pathname`);
ALTER TABLE `tl_bangumi` ADD UNIQUE INDEX `uniq_pathname` (`pathname`);
