# MySQL 基础与进阶

MySQL 是世界上最流行的开源关系型数据库之一，被广泛应用于 Web 开发与数据分析领域。

## 安装

- **Windows**：官方 MSI 安装包
- **macOS**：`brew install mysql`
- **Linux**：`apt install mysql-server` 或 `yum install mysql-server`

## 连接与基本操作

```bash
# 登录（输入密码后进入交互终端）
mysql -u root -p
```

```sql
-- 查看所有数据库
SHOW DATABASES;

-- 创建数据库
CREATE DATABASE school DEFAULT CHARSET utf8mb4;

-- 切换数据库
USE school;

-- 查看所有表
SHOW TABLES;
```

## 数据类型

### 数值类型

| 类型 | 大小 | 用途 |
| ---- | ---- | ---- |
| `TINYINT` | 1 字节 | 小整数 |
| `INT` | 4 字节 | 常用整数 |
| `BIGINT` | 8 字节 | 大整数 |
| `DECIMAL(M, D)` | 变长 | 精确小数（金额） |

### 字符串类型

| 类型 | 长度 | 用途 |
| ---- | ---- | ---- |
| `CHAR(n)` | 1~255 | 定长 |
| `VARCHAR(n)` | 1~65535 | 变长 |
| `TEXT` | 64KB | 长文本 |

### 时间类型

- `DATE`：日期
- `TIME`：时间
- `DATETIME`：日期时间
- `TIMESTAMP`：时间戳

## 表的创建与约束

```sql
CREATE TABLE student (
  id        BIGINT       PRIMARY KEY AUTO_INCREMENT,
  name      VARCHAR(50)  NOT NULL,
  age       INT          DEFAULT 18,
  email     VARCHAR(100) UNIQUE,
  create_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

### 常见约束

- `PRIMARY KEY`：主键
- `NOT NULL`：非空
- `UNIQUE`：唯一
- `DEFAULT`：默认值
- `FOREIGN KEY`：外键

## CRUD 操作

### 新增（INSERT）

```sql
INSERT INTO student (name, age, email)
VALUES ('Alice', 20, 'alice@example.com');
```

### 查询（SELECT）

```sql
-- 全表查询
SELECT * FROM student;

-- 条件查询
SELECT name, age FROM student WHERE age >= 18;

-- 排序
SELECT * FROM student ORDER BY create_at DESC;

-- 分页
SELECT * FROM student LIMIT 0, 10;
```

### 更新（UPDATE）

```sql
UPDATE student SET age = 21 WHERE name = 'Alice';
```

### 删除（DELETE）

```sql
DELETE FROM student WHERE id = 1;

-- 清空表（不可回滚）
TRUNCATE TABLE student;
```

## 索引

索引是帮助 MySQL **高效获取数据**的数据结构，类比书籍的目录。

### 常见索引类型

- **普通索引**：无约束
- **唯一索引**：列值唯一
- **主键索引**：特殊的唯一索引
- **复合索引**：多列组合
- **全文索引**：用于文本搜索

### 创建索引

```sql
-- 普通索引
CREATE INDEX idx_name ON student (name);

-- 唯一索引
CREATE UNIQUE INDEX uniq_email ON student (email);

-- 复合索引（注意最左前缀原则）
CREATE INDEX idx_name_age ON student (name, age);
```

::: warning 警告
**索引并非越多越好**——索引会占用存储，并降低写入性能。
:::

### EXPLAIN 分析

```sql
EXPLAIN SELECT * FROM student WHERE name = 'Alice';
```

重点关注：

- `type`：访问类型（`const` / `ref` / `range` / `all`）
- `key`：实际使用的索引
- `rows`：预估扫描行数
- `Extra`：额外信息（如 `Using filesort`）

## 事务

事务是一组原子性的 SQL 语句，要么都成功，要么都失败。

### ACID 特性

- **Atomicity 原子性**：要么全做，要么全不做
- **Consistency 一致性**：事务前后数据满足业务约束
- **Isolation 隔离性**：并发事务互不干扰
- **Durability 持久性**：事务一旦提交，永久生效

### 隔离级别

| 级别 | 脏读 | 不可重复读 | 幻读 |
| ---- | ---- | ---------- | ---- |
| READ UNCOMMITTED | ✔ | ✔ | ✔ |
| READ COMMITTED | ✘ | ✔ | ✔ |
| REPEATABLE READ（默认） | ✘ | ✘ | ✔ |
| SERIALIZABLE | ✘ | ✘ | ✘ |

```sql
-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- 事务模板
START TRANSACTION;
UPDATE account SET balance = balance - 100 WHERE id = 1;
UPDATE account SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- ROLLBACK;  -- 出错时回滚
```

## 锁机制

### 全局锁

```sql
FLUSH TABLES WITH READ LOCK;   -- 整个库只读
UNLOCK TABLES;
```

### 表级锁

```sql
LOCK TABLES student READ;
UNLOCK TABLES;
```

### 行级锁

InnoDB 默认使用行锁，通过索引实现。

## 性能优化建议

::: tip 提示
- 避免 `SELECT *`，只查必要字段
- 小表驱动大表（`IN` / `EXISTS` 选择）
- 优先使用复合索引的最左前缀
- 减少 `LIKE '%xxx%'`，可使用全文索引
- 大批量写入分批提交
:::

## 小结

MySQL 的知识体系非常庞大，本章覆盖了最常用的部分。深入学习推荐阅读《高性能 MySQL》。
