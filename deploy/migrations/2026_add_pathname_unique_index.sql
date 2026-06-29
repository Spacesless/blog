-- ============================================================
-- 为 tl_article 与 tl_bangumi 的 pathname 字段添加唯一索引
-- 用作 Slugify ID（友好 URL slug）
-- 说明：MySQL 唯一索引允许多个 NULL 值，存量 pathname 为 NULL 的记录互不冲突
-- 注意：表为 MyISAM 引擎，单索引键最大 1000 字节；pathname 为 utf8mb4 varchar(255)
--       (255*4=1020 > 1000) 会触发 1071，故限制索引前缀长度为 191 (191*4=764)
-- ============================================================

ALTER TABLE `tl_article` ADD UNIQUE INDEX `uniq_pathname` (`pathname`(191));
ALTER TABLE `tl_bangumi` ADD UNIQUE INDEX `uniq_pathname` (`pathname`(191));
