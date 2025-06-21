CREATE TABLE `saas_restaurant`.`branch`  (
  `branch_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分店ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `branch_name` varchar(255) NULL COMMENT '分店名称',
  `address` text NULL COMMENT '分店地址',
  `phone` varchar(255) NULL COMMENT '联系电话',
  `manager_id` int UNSIGNED NULL COMMENT '店长（关联用户表）',
  `status` varchar(50) NULL COMMENT '营业状态',
  `opening_hours` text NULL COMMENT '营业时间配置',
  `capacity` int UNSIGNED NULL COMMENT '最大同时就餐人数',
  `rate` varchar(50) NULL COMMENT '评分',
  `last_check` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上次巡检',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  PRIMARY KEY (`branch_id`)
);

CREATE TABLE `saas_restaurant`.`consumption_record`  (
  `record_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `amount` varchar(255) NULL COMMENT '消费量',
  `order_items` varchar(255) NULL COMMENT '菜品',
  `member_id` int UNSIGNED NULL COMMENT '会员ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `points` varchar(255) NULL COMMENT '积分',
  PRIMARY KEY (`record_id`)
);

CREATE TABLE `saas_restaurant`.`dish`  (
  `dish_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '菜品ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `dish_category_id` int UNSIGNED NULL COMMENT '菜品分类ID',
  `dish_name` varchar(255) NULL COMMENT '菜品名称',
  `dish_price` varchar(255) NULL COMMENT '销售价格',
  `cost_price` varchar(255) NULL COMMENT '成本价',
  `origin_price` varchar(255) NULL COMMENT '原价',
  `description` text NULL COMMENT '菜品描述',
  `sales` int UNSIGNED NULL COMMENT '销量',
  `stock` int UNSIGNED NULL COMMENT '库存数量',
  `cover_img` varchar(255) NULL COMMENT '封面图URL',
  `status` varchar(50) NULL COMMENT '销售状态',
  `sort_order` int NULL COMMENT '排序权重（权重值越大越靠前）',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`dish_id`)
);

CREATE TABLE `saas_restaurant`.`dish_category`  (
  `category_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '菜品分类ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `parent_id` int UNSIGNED NULL COMMENT '父级ID',
  `category_name` varchar(255) NULL COMMENT '菜品分类名称',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `sort_order` int NULL COMMENT '同级分类排序',
  `is_deleted` tinyint(1) NULL COMMENT '软删除',
  PRIMARY KEY (`category_id`)
);

CREATE TABLE `saas_restaurant`.`inventory`  (
  `inventory_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '库存ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `quantity` int NULL COMMENT '当前可用库存数量',
  `item_name` varchar(255) NULL COMMENT '物料名称',
  `item_category` varchar(255) NULL COMMENT '物料类型',
  `item_cost` varchar(255) NULL COMMENT '采购价',
  `min_stock` int NULL COMMENT '库存预警最小值',
  `max_stock` int NULL COMMENT '库存预警最大值',
  `supplier` varchar(255) NULL COMMENT '供应商',
  `status` varchar(255) NULL COMMENT '状态',
  `location` varchar(255) NULL COMMENT '存放位置',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  PRIMARY KEY (`inventory_id`)
);

CREATE TABLE `saas_restaurant`.`inventory_record`  (
  `record_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '库存记录ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `record_type` varchar(50) NULL COMMENT '记录类型',
  `quantity` varchar(255) NULL COMMENT '数量',
  `item_id` int UNSIGNED NULL COMMENT '物料ID',
  `operator_id` int UNSIGNED NULL COMMENT '操作人ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `remark` text NULL COMMENT '备注',
  PRIMARY KEY (`record_id`)
);

CREATE TABLE `saas_restaurant`.`marketing_campaign`  (
  `campaign_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '营销方案ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `campaign_name` varchar(255) NULL COMMENT '营销方案名称',
  `status` varchar(50) NULL COMMENT '方案状态',
  `level_id` int UNSIGNED NULL COMMENT '适用会员等级',
  `campaign_content` text NULL COMMENT '活动内容',
  `campaign_start` timestamp NULL COMMENT '活动开始时间',
  `campaign_end` timestamp NULL COMMENT '活动结束时间',
  `created_by` int UNSIGNED NULL COMMENT '创建者（关联用户表）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NULL COMMENT '软删除标记',
  PRIMARY KEY (`campaign_id`)
);

CREATE TABLE `saas_restaurant`.`member`  (
  `member_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会员ID',
  `tenant_id` int UNSIGNED NULL COMMENT '所属租户ID',
  `level_id` int UNSIGNED NULL COMMENT '关联会员等级表ID',
  `username` varchar(255) NULL COMMENT '会员用户名',
  `password` varchar(255) NULL COMMENT '会员密码',
  `phone` varchar(255) NULL COMMENT '会员手机号',
  `points` int UNSIGNED NULL COMMENT '当前可用积分',
  `total_points` int UNSIGNED NULL COMMENT '历史累计积分',
  `total_spent` varchar(255) NULL COMMENT '累计消费金额',
  `expire_date` timestamp NULL COMMENT '会员有效期',
  `status` varchar(50) NULL COMMENT '会员状态',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  PRIMARY KEY (`member_id`)
);

CREATE TABLE `saas_restaurant`.`member_level`  (
  `level_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会员等级ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `level_name` varchar(255) NULL COMMENT '等级名称',
  `required_points` int UNSIGNED NULL COMMENT '升级所需要的积分',
  `required_spent` varchar(255) NULL COMMENT '升级所需累计消费金额',
  `discount_rate` varchar(255) NULL COMMENT '折扣率',
  `icon_url` varchar(255) NULL COMMENT '等级图标',
  `benefits` json NULL COMMENT '等级权益',
  PRIMARY KEY (`level_id`)
);

CREATE TABLE `saas_restaurant`.`order_table`  (
  `order_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `user_id` int UNSIGNED NULL COMMENT '用户ID',
  `total_amount` varchar(255) NULL COMMENT '订单总金额（不含优惠）',
  `discount_ammout` varchar(255) NULL COMMENT '优惠金额',
  `payment_method` varchar(255) NULL COMMENT '支付方式',
  `payment_status` varchar(50) NULL COMMENT '支付状态',
  `order_status` varchar(50) NULL COMMENT '订单状态',
  `delivery_address` varchar(255) NULL COMMENT '配送地址',
  `order_detail` json NULL COMMENT '订单详情',
  `remark` text NULL COMMENT '备注',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  PRIMARY KEY (`order_id`)
);

CREATE TABLE `saas_restaurant`.`permission`  (
  `permission_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `menu_path` varchar(255) NULL COMMENT '菜单路径',
  `permission_code` varchar(255) NULL COMMENT '权限代码',
  `permission_name` varchar(255) NULL COMMENT '权限名称',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记',
  PRIMARY KEY (`permission_id`)
);

CREATE TABLE `saas_restaurant`.`role`  (
  `role_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `role_name` varchar(255) NULL COMMENT '角色名称',
  `description` varchar(255) NULL COMMENT '角色描述',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  `status` varchar(50) NULL COMMENT '角色状态',
  PRIMARY KEY (`role_id`)
);

CREATE TABLE `saas_restaurant`.`role_permission`  (
  `role_permission_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色关联权限记录ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `role_id` int UNSIGNED NULL COMMENT '角色ID',
  `permission_id` int UNSIGNED NULL COMMENT '权限ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  PRIMARY KEY (`role_permission_id`)
);

CREATE TABLE `saas_restaurant`.`system_administrator`  (
  `admin_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '系统管理员ID',
  `username` varchar(255) NULL COMMENT '用户名',
  `password` varchar(255) NULL COMMENT '密码',
  PRIMARY KEY (`admin_id`)
);

CREATE TABLE `saas_restaurant`.`tenant`  (
  `tenant_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '租户ID',
  `tenant_name` varchar(255) NULL COMMENT '租户名称',
  `email` varchar(255) NULL COMMENT '租户邮箱',
  `phone` varchar(255) NULL COMMENT '租户手机号',
  `status` varchar(50) NULL COMMENT '租户状态',
  `tenant_token` varchar(255) NULL COMMENT '租户令牌',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  PRIMARY KEY (`tenant_id`)
);

CREATE TABLE `saas_restaurant`.`user`  (
  `user_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `username` varchar(255) NULL COMMENT '用户名',
  `password` varchar(255) NULL COMMENT '密码',
  `email` varchar(255) NULL COMMENT '用户邮箱',
  `phone` varchar(255) NULL COMMENT '手机号',
  `avatar_url` varchar(255) NULL COMMENT '用户头像URL',
  `gender` varchar(255) NULL COMMENT '用户性别',
  `birthday` varchar(255) NULL COMMENT '用户生日',
  `province` varchar(255) NULL COMMENT '用户所在省',
  `city` varchar(255) NULL COMMENT '用户所在市',
  `address` varchar(255) NULL COMMENT '用户所在详细地址',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '账号创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',
  `last_login` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次登录时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  `status` varchar(50) NULL COMMENT '账户状态',
  PRIMARY KEY (`user_id`)
);

CREATE TABLE `saas_restaurant`.`user_role`  (
  `user_role_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户关联角色表记录ID',
  `tenant_id` int UNSIGNED NULL COMMENT '租户ID',
  `user_id` int UNSIGNED NULL COMMENT '用户ID',
  `role_id` int UNSIGNED NULL COMMENT '角色ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL COMMENT '软删除标记（0：未删除，1：已删除）',
  PRIMARY KEY (`user_role_id`)
);

ALTER TABLE `saas_restaurant`.`branch` ADD CONSTRAINT `FK_branch_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`branch` ADD CONSTRAINT `FK_branch_manager_id` FOREIGN KEY (`manager_id`) REFERENCES `saas_restaurant`.`user` (`user_id`);
ALTER TABLE `saas_restaurant`.`consumption_record` ADD CONSTRAINT `FK_consumption_record_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`consumption_record` ADD CONSTRAINT `FK_consumption_record_member_id` FOREIGN KEY (`member_id`) REFERENCES `saas_restaurant`.`member` (`member_id`);
ALTER TABLE `saas_restaurant`.`dish` ADD CONSTRAINT `FK_dish_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`dish` ADD CONSTRAINT `FK_dish_dish_category_id` FOREIGN KEY (`dish_category_id`) REFERENCES `saas_restaurant`.`dish_category` (`category_id`);
ALTER TABLE `saas_restaurant`.`dish_category` ADD CONSTRAINT `FK_dish_category_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`dish_category` ADD CONSTRAINT `FK_dish_category_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `saas_restaurant`.`dish_category` (`category_id`);
ALTER TABLE `saas_restaurant`.`inventory` ADD CONSTRAINT `FK_inventory_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`inventory_record` ADD CONSTRAINT `FK_inventory_record_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`inventory_record` ADD CONSTRAINT `FK_inventory_record_operator_id` FOREIGN KEY (`operator_id`) REFERENCES `saas_restaurant`.`user` (`user_id`);
ALTER TABLE `saas_restaurant`.`inventory_record` ADD CONSTRAINT `FK_inventory_record_item_id` FOREIGN KEY (`item_id`) REFERENCES `saas_restaurant`.`inventory` (`inventory_id`);
ALTER TABLE `saas_restaurant`.`marketing_campaign` ADD CONSTRAINT `FK_marketing_campaign_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`marketing_campaign` ADD CONSTRAINT `FK_marketing_campaign_level_id` FOREIGN KEY (`level_id`) REFERENCES `saas_restaurant`.`member_level` (`level_id`);
ALTER TABLE `saas_restaurant`.`member` ADD CONSTRAINT `FK_member_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`member` ADD CONSTRAINT `FK_member_level_id` FOREIGN KEY (`level_id`) REFERENCES `saas_restaurant`.`member_level` (`level_id`);
ALTER TABLE `saas_restaurant`.`member_level` ADD CONSTRAINT `FK_member_level_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`order_table` ADD CONSTRAINT `FK_ordertable_user_id` FOREIGN KEY (`user_id`) REFERENCES `saas_restaurant`.`user` (`user_id`);
ALTER TABLE `saas_restaurant`.`order_table` ADD CONSTRAINT `FK_ordertable_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`permission` ADD CONSTRAINT `FK_permission_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`role` ADD CONSTRAINT `FK_role_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`role_permission` ADD CONSTRAINT `FK_role_permission_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`role_permission` ADD CONSTRAINT `FK_role_permission_role_id` FOREIGN KEY (`role_id`) REFERENCES `saas_restaurant`.`role` (`role_id`);
ALTER TABLE `saas_restaurant`.`role_permission` ADD CONSTRAINT `FK_role_permission_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `saas_restaurant`.`permission` (`permission_id`);
ALTER TABLE `saas_restaurant`.`user` ADD CONSTRAINT `FK_user_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`user_role` ADD CONSTRAINT `FK_user_role_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `saas_restaurant`.`tenant` (`tenant_id`);
ALTER TABLE `saas_restaurant`.`user_role` ADD CONSTRAINT `FK_user_role_user_id` FOREIGN KEY (`user_id`) REFERENCES `saas_restaurant`.`user` (`user_id`);
ALTER TABLE `saas_restaurant`.`user_role` ADD CONSTRAINT `FK_user_role_role_id` FOREIGN KEY (`role_id`) REFERENCES `saas_restaurant`.`role` (`role_id`);

