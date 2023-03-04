/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 50738
 Source Host           : localhost:3306
 Source Schema         : demo

 Target Server Type    : MySQL
 Target Server Version : 50738
 File Encoding         : 65001

 Date: 04/03/2023 15:43:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tl_article
-- ----------------------------
DROP TABLE IF EXISTS `tl_article`;
CREATE TABLE `tl_article`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `keywords` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '关键字',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '描述',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `word_count` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '字数统计',
  `category_id` int(11) NOT NULL COMMENT '栏目id',
  `imgurl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '缩略图',
  `hits` int(11) NOT NULL DEFAULT 0 COMMENT '访问量',
  `tag` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标签',
  `addtime` datetime(0) NULL DEFAULT NULL COMMENT '添加时间',
  `updatetime` datetime(0) NOT NULL COMMENT '更新时间',
  `pathname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'url的pathname',
  `comment_count` int(11) NOT NULL DEFAULT 0 COMMENT '评论数',
  `is_recycle` tinyint(11) NOT NULL DEFAULT 0 COMMENT '0-不回收，1-回收',
  `is_show` tinyint(11) NOT NULL DEFAULT 1 COMMENT '0-前台隐藏，1-前台显示',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 73 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tl_article
-- ----------------------------
INSERT INTO `tl_article` VALUES (72, 'Hello world', '', '这是一篇示例文章，包括文字、代码、链接、图片、列表、表格等内容', '<p>这是一篇示例文章，包括文字、代码、链接、图片、列表、表格等内容</p>\n<h2>1. 链接</h2>\n<p><a href=\"https://www.timelessq.com\" target=\"_blank\" rel=\"noopener\">https://www.timelessq.com</a></p>\n<h2>2. 图片</h2>\n<p><img src=\"/upload/202210/1f9decc3d2185b92.jpg\" width=\"1360\" height=\"880\" /></p>\n<h2>3. 列表</h2>\n<ul>\n<li>富文本编辑器</li>\n<li>代码</li>\n</ul>\n<h2>4. 代码</h2>\n<pre class=\"language-javascript\"><code>console.log(\'Hello world\')</code></pre>\n<h2>5. 表格</h2>\n<table style=\"border-collapse: collapse; width: 100.004%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 33.3104%;\">列1</td>\n<td style=\"width: 33.3104%;\">列2</td>\n<td style=\"width: 33.3104%;\">列3</td>\n</tr>\n<tr>\n<td style=\"width: 33.3104%;\">1</td>\n<td style=\"width: 33.3104%;\">2</td>\n<td style=\"width: 33.3104%;\">3</td>\n</tr>\n</tbody>\n</table>', 61, 4, '/upload/202210/45035f5d0edffa13.jpg', 0, '', '2023-03-04 10:13:58', '2023-03-04 10:13:58', NULL, 0, 0, 1);

-- ----------------------------
-- Table structure for tl_bangumi
-- ----------------------------
DROP TABLE IF EXISTS `tl_bangumi`;
CREATE TABLE `tl_bangumi`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `keywords` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '关键字',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `total` int(11) NOT NULL DEFAULT 0 COMMENT '总集数',
  `current` int(11) NOT NULL DEFAULT 0 COMMENT '当前观看集数',
  `showtime` date NULL DEFAULT NULL COMMENT '放映时间',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '0-未上映，1-连载中，2-已完结',
  `ratings` float(11, 1) NOT NULL DEFAULT 0.0 COMMENT '推荐指数10分制',
  `songs` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '主题曲',
  `category_id` int(11) NOT NULL COMMENT '栏目id',
  `imgurl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '缩略图',
  `hits` int(11) NOT NULL DEFAULT 0 COMMENT '访问量',
  `tag` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标签',
  `addtime` datetime(0) NULL DEFAULT NULL COMMENT '添加时间',
  `updatetime` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `pathname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'url的pathname',
  `comment_count` int(11) NOT NULL DEFAULT 0 COMMENT '评论数',
  `is_recycle` int(11) NOT NULL DEFAULT 0 COMMENT '0-不回收，1-回收',
  `is_show` int(11) NOT NULL DEFAULT 1 COMMENT '0-前台隐藏，1-前台显示',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 150 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tl_bangumi
-- ----------------------------
INSERT INTO `tl_bangumi` VALUES (149, '孤独摇滚', NULL, '绰号“小孤独”的后藤独，是一个喜爱吉他的孤独少女。经常在家里独自弹奏吉他，但因为一些事情，加入了伊地知虹夏领衔的“纽带乐队”。不敢在他人面前演奏的后藤，能否成为一个出色的乐队成员呢……', '', 12, 12, '2022-10-08', 2, 10.0, NULL, 11, '/upload/202210/7e121906a669fc30.jpg', 0, '音乐|日常', '2023-03-04 10:19:30', '2023-03-04 10:19:30', NULL, 0, 0, 1);

-- ----------------------------
-- Table structure for tl_banner
-- ----------------------------
DROP TABLE IF EXISTS `tl_banner`;
CREATE TABLE `tl_banner`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `imgurl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片',
  `sort` int(11) NULL DEFAULT NULL COMMENT '排序',
  `is_show` tinyint(11) NOT NULL DEFAULT 1 COMMENT '0-前台隐藏，1-前台展示',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tl_banner
-- ----------------------------
INSERT INTO `tl_banner` VALUES (1, '正在听古风歌曲', '/upload/202210/be0234298e530ef0.png', 1, 1);

-- ----------------------------
-- Table structure for tl_category
-- ----------------------------
DROP TABLE IF EXISTS `tl_category`;
CREATE TABLE `tl_category`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 1,
  `type` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_order` int(11) NULL DEFAULT NULL,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `keywords` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `version` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `params` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_nav` tinyint(11) NOT NULL DEFAULT 1,
  `is_show` tinyint(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 109 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tl_category
-- ----------------------------
INSERT INTO `tl_category` VALUES (1, '文章笔记', '', 0, 1, 'article', 0, 'icon-shuji', '个人博客|web前端|PHP|编程开发|计算机基础', '', NULL, '', NULL, '', 1, 1);
INSERT INTO `tl_category` VALUES (2, '追番刷剧', '', 0, 1, 'bangumi', 3, 'icon-dianshi', '追番|动漫|成长', '', NULL, '', NULL, '', 1, 1);
INSERT INTO `tl_category` VALUES (3, '工具', '', 0, 1, 'tool', 2, 'icon-gongju', 'web工具|web小程序|在线工具', '', NULL, '', NULL, '', 1, 1);
INSERT INTO `tl_category` VALUES (4, '工作', '', 1, 2, 'article', 0, NULL, 'web前端|Html5|javascript', '', NULL, '', NULL, '', 1, 1);
INSERT INTO `tl_category` VALUES (11, '国创', '', 2, 2, 'bangumi', 0, NULL, '', '', NULL, '', NULL, '', 1, 1);
INSERT INTO `tl_category` VALUES (12, '番剧', '', 2, 2, 'bangumi', 1, NULL, '', '', NULL, '', NULL, '', 1, 1);
INSERT INTO `tl_category` VALUES (14, 'Spine', 'spine', 3, 2, 'tool', 4, NULL, '', '碧蓝航线Spine动画', NULL, 'v1.0.0', NULL, '{\"seleteSkeleton\":\"lafei_4\",\"selectAnimation\":\"dance\"}', 0, 1);
INSERT INTO `tl_category` VALUES (15, 'Live2d', 'live2d', 3, 2, 'tool', 5, NULL, '', 'Live2D Cubism SDK v2看板娘', NULL, 'v1.0.1', NULL, '', 0, 1);
INSERT INTO `tl_category` VALUES (17, '我的音乐', 'music', 3, 2, 'tool', 0, NULL, '', '个人QQ音乐歌单、乐库', NULL, 'v2.1.0', NULL, '', 0, 1);
INSERT INTO `tl_category` VALUES (5, '关于', 'about', 0, 1, 'page', 5, 'icon-guanyu', '', '', '<p>这是一个自个开发的博客</p>\n<h2>未来计划</h2>\n<ul>\n<li>网站性能优化</li>\n<li>新增个性化404页面</li>\n<li>升级到Nuxt@3版本</li>\n<li>优化Api附属站，小工具</li>\n</ul>', '', NULL, '', 1, 1);
INSERT INTO `tl_category` VALUES (16, '我的B站', 'bilibili', 3, 2, 'tool', 2, NULL, NULL, '哔哩哔哩收藏夹、关注', NULL, 'v1.0.0', NULL, '', 0, 1);
INSERT INTO `tl_category` VALUES (7, '我的足迹', 'track', 3, 2, 'tool', 1, NULL, NULL, '我的足迹，点亮城市、打卡', NULL, 'v1.0.0', NULL, '[\n  {\n    \"name\": \"北京市\",\n    \"provCode\": 110000,\n    \"children\": [\n      {\n        \"name\": \"市区\",\n        \"cityCode\": 110000,\n        \"children\": [\n          {\n            \"name\": \"天安门广场\",\n            \"coordinates\": [\n              116.397755,\n              39.903179\n            ]\n          },\n          {\n            \"name\": \"人民英雄纪念碑\",\n            \"coordinates\": [\n              116.397691,\n              39.904632\n            ]\n          },\n          {\n            \"name\": \"毛主席纪念堂\",\n            \"coordinates\": [\n              116.397815,\n              39.902517\n            ]\n          },\n          {\n            \"name\": \"景山公园\",\n            \"coordinates\": [\n              116.396551,\n              39.925875\n            ]\n          },\n          {\n            \"name\": \"南锣鼓巷\",\n            \"coordinates\": [\n              116.403004,\n              39.937247\n            ]\n          },\n          {\n            \"name\": \"什刹海\",\n            \"coordinates\": [\n              116.385307,\n              39.941853\n            ]\n          },\n          {\n            \"name\": \"圆明园\",\n            \"coordinates\": [\n              116.300442,\n              40.009143\n            ]\n          },\n          {\n            \"name\": \"水立方\",\n            \"coordinates\": [\n              116.3904,\n              39.99283\n            ]\n          },\n          {\n            \"name\": \"鸟巢\",\n            \"coordinates\": [\n              116.395983,\n              39.993447\n            ]\n          },\n          {\n            \"name\": \"颐和园\",\n            \"coordinates\": [\n              116.275115,\n              39.999686\n            ]\n          },\n          {\n            \"name\": \"天坛\",\n            \"coordinates\": [\n              116.410829,\n              39.881913\n            ]\n          },\n          {\n            \"name\": \"清华大学\",\n            \"coordinates\": [\n              116.326836,\n              40.00366\n            ]\n          },\n          {\n            \"name\": \"北京大学\",\n            \"coordinates\": [\n              116.310905,\n              39.992806\n            ]\n          },\n          {\n            \"name\": \"八达岭长城\",\n            \"coordinates\": [\n              116.016802,\n              40.356188\n            ]\n          }\n        ]\n      }\n    ]\n  },\n  {\n    \"name\": \"广东省\",\n    \"provCode\": 440000,\n    \"children\": [\n      {\n        \"name\": \"广州市\",\n        \"cityCode\": 440100,\n        \"children\": [\n          {\n            \"name\": \"长隆欢乐世界\",\n            \"coordinates\": [\n              113.329882,\n              22.998965\n            ]\n          },\n          {\n            \"name\": \"长隆野生动物世界\",\n            \"coordinates\": [\n              113.315274,\n              23.002125\n            ]\n          },\n          {\n            \"name\": \"广州塔\",\n            \"coordinates\": [\n              113.324553,\n              23.106414\n            ]\n          }\n        ]\n      }\n    ]\n  }\n]', 0, 1);
INSERT INTO `tl_category` VALUES (8, 'API Service', '', 3, 2, 'tool', 1, NULL, NULL, '公共Api服务', NULL, 'v1.1.2', 'https://api.timelessq.com', '', 0, 1);
INSERT INTO `tl_category` VALUES (9, 'Bad Apple', 'bad-apple', 3, 2, 'tool', 8, NULL, NULL, '万物皆可bad apple', NULL, 'v1.0.0', NULL, '', 0, 1);
INSERT INTO `tl_category` VALUES (6, '友情链接', 'link', 0, 1, 'page', 6, 'icon-lianjie', NULL, NULL, NULL, NULL, NULL, '', 1, 1);
INSERT INTO `tl_category` VALUES (13, '壁纸', 'wallpaper', 3, 2, 'tool', 7, NULL, NULL, 'Bing每日图片、个人收藏壁纸', NULL, 'v1.0.0', NULL, ' ', 0, 1);
INSERT INTO `tl_category` VALUES (10, '归档', 'archives', 0, 1, 'page', 4, 'icon-guidang', NULL, NULL, NULL, NULL, NULL, ' ', 1, 1);

-- ----------------------------
-- Table structure for tl_comment
-- ----------------------------
DROP TABLE IF EXISTS `tl_comment`;
CREATE TABLE `tl_comment`  (
  `id` mediumint(11) NOT NULL AUTO_INCREMENT,
  `topic_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '所在页的id',
  `topic_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `topic_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `reply_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `type` tinyint(10) NOT NULL DEFAULT 1,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `addtime` datetime(0) NOT NULL,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_admin` int(10) NOT NULL DEFAULT 0,
  `is_show` int(10) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tl_config
-- ----------------------------
DROP TABLE IF EXISTS `tl_config`;
CREATE TABLE `tl_config`  (
  `key` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `value` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  UNIQUE INDEX `key`(`key`) USING BTREE
) ENGINE = MyISAM CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tl_config
-- ----------------------------
INSERT INTO `tl_config` VALUES ('sitename', '示例网站', '');
INSERT INTO `tl_config` VALUES ('keywords', '博客|二次元|壁纸|动画', '');
INSERT INTO `tl_config` VALUES ('description', '一个网站', '');
INSERT INTO `tl_config` VALUES ('logo', '', '');
INSERT INTO `tl_config` VALUES ('icp_beian', '桂ICP备xxx号-1', 'ICP备案号');
INSERT INTO `tl_config` VALUES ('police_beian', '桂公网安备xxx号', '公网安备案号');
INSERT INTO `tl_config` VALUES ('image_fit', '0', '');
INSERT INTO `tl_config` VALUES ('article_width', '680', '');
INSERT INTO `tl_config` VALUES ('article_height', '440', '');
INSERT INTO `tl_config` VALUES ('is_silent', '0', '0-关闭哀悼模式，1-打开哀悼模式');
INSERT INTO `tl_config` VALUES ('bangumi_width', '330', '');
INSERT INTO `tl_config` VALUES ('bangumi_height', '440', '');
INSERT INTO `tl_config` VALUES ('home_bangumi_num', '6', NULL);
INSERT INTO `tl_config` VALUES ('home_article_num', '12', NULL);
INSERT INTO `tl_config` VALUES ('article_num', '10', '');
INSERT INTO `tl_config` VALUES ('bangumi_num', '20', '');
INSERT INTO `tl_config` VALUES ('live2d_model', '101', NULL);
INSERT INTO `tl_config` VALUES ('live2d_texture', '5', NULL);

-- ----------------------------
-- Table structure for tl_link
-- ----------------------------
DROP TABLE IF EXISTS `tl_link`;
CREATE TABLE `tl_link`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `website` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `logo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `addtime` datetime(0) NOT NULL,
  `no_order` int(11) NULL DEFAULT 0,
  `is_show` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tl_link
-- ----------------------------
INSERT INTO `tl_link` VALUES (11, 'Timeless\'s博客', 'https://www.timelessq.com/', 'https://www.timelessq.com/static/avatar.jpg', '花开成景，花落成诗', '2023-03-04 13:27:22', 1, 1);

-- ----------------------------
-- Table structure for tl_user
-- ----------------------------
DROP TABLE IF EXISTS `tl_user`;
CREATE TABLE `tl_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `register_time` datetime(0) NULL DEFAULT NULL,
  `login_ip` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `login_time` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tl_user
-- ----------------------------
INSERT INTO `tl_user` VALUES (1, 'demo', '$2a$08$iH/A9Ji/VArlPweLc.r29e2FGjND1uI48mSE4ZL1CmsJfmLGAbjZC', '../upload/201803/1521525003.png', 'demo', '66@qq.com', '2018-03-12 09:08:36', '127.0.0.1', '2023-03-04 09:46:41');

SET FOREIGN_KEY_CHECKS = 1;
