# MongoDB 文档型数据库

MongoDB 是一款面向文档的 NoSQL 数据库，使用类似 JSON 的 BSON 格式存储数据，具有高扩展性、灵活的数据模型。

## 核心概念

| SQL 术语 | MongoDB 术语 |
| -------- | ------------ |
| 数据库 (database) | database |
| 表 (table) | 集合 (collection) |
| 行 (row) | 文档 (document) |
| 列 (column) | 字段 (field) |
| 主键 (primary key) | `_id` |

## 安装

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb

# 客户端连接
mongosh
```

## 基本操作

### 数据库与集合

```javascript
// 切换 / 创建数据库
use school

// 查看所有数据库
show dbs

// 创建集合（也可隐式创建）
db.createCollection("students")

// 查看集合
show collections

// 删除集合
db.students.drop()
```

### 文档的 CRUD

#### 新增（Insert）

```javascript
// 插入单个
db.students.insertOne({
  name: "Alice",
  age: 20,
  major: "Computer Science",
  tags: ["math", "coding"],
  createAt: new Date()
})

// 插入多个
db.students.insertMany([
  { name: "Bob",   age: 22, major: "Math" },
  { name: "Carol", age: 21, major: "Physics" }
])
```

#### 查询（Find）

```javascript
// 全部
db.students.find()

// 格式化输出
db.students.find().pretty()

// 条件查询
db.students.find({ age: { $gte: 20 } })

// 多条件
db.students.find({ age: 20, major: "Math" })

// 投影（指定返回字段）
db.students.find({}, { name: 1, _id: 0 })

// 排序
db.students.find().sort({ age: -1 })

// 分页
db.students.find().skip(0).limit(10)
```

#### 更新（Update）

```javascript
// 更新单个
db.students.updateOne(
  { name: "Alice" },
  { $set: { age: 21 } }
)

// 更新多个
db.students.updateMany(
  { major: "Math" },
  { $set: { major: "Mathematics" } }
)

// 字段自增
db.students.updateOne(
  { name: "Alice" },
  { $inc: { score: 5 } }
)
```

#### 删除（Remove）

```javascript
// 删除单个
db.students.deleteOne({ name: "Bob" })

// 删除多个
db.students.deleteMany({ age: { $lt: 18 } })
```

## 查询操作符

### 比较

| 操作符 | 含义 |
| ------ | ---- |
| `$eq` | 等于 |
| `$ne` | 不等于 |
| `$gt` | 大于 |
| `$gte` | 大于等于 |
| `$lt` | 小于 |
| `$lte` | 小于等于 |
| `$in` | 在数组中 |
| `$nin` | 不在数组中 |

### 逻辑

```javascript
db.students.find({
  $and: [
    { age: { $gte: 18 } },
    { major: "Computer Science" }
  ]
})
```

`$or` / `$not` / `$nor` 同理。

### 元素

```javascript
// 字段存在
db.students.find({ email: { $exists: true } })
```

## 聚合管道

聚合管道是 MongoDB 的**数据处理流水线**，类似 SQL 的 GROUP BY。

```javascript
db.students.aggregate([
  // 阶段1：过滤
  { $match: { age: { $gte: 18 } } },
  // 阶段2：分组
  { $group: {
      _id: "$major",
      count: { $sum: 1 },
      avgAge: { $avg: "$age" }
  }},
  // 阶段3：排序
  { $sort: { count: -1 } },
  // 阶段4：限制
  { $limit: 5 }
])
```

常用阶段：

- `$match`：过滤
- `$group`：分组
- `$project`：投影
- `$sort`：排序
- `$limit` / `$skip`：分页
- `$lookup`：关联（类似 JOIN）
- `$unwind`：展开数组

### $lookup 关联查询

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  }
])
```

## 索引

```javascript
// 创建单字段索引
db.students.createIndex({ name: 1 })   // 1 升序，-1 降序

// 复合索引
db.students.createIndex({ name: 1, age: -1 })

// 唯一索引
db.students.createIndex({ email: 1 }, { unique: true })

// 查看索引
db.students.getIndexes()

// 删除索引
db.students.dropIndex("name_1")
```

## 复制集（Replica Set）

生产环境必须使用复制集，提供高可用：

- **Primary**：主节点，处理写
- **Secondary**：从节点，同步数据，可读
- **Arbiter**：仲裁节点，不存数据

至少需要 **3 个节点**（1 主 2 从）。

## 分片（Sharding）

数据量超大时使用，将数据拆分到多个分片：

- **Config Server**：存储集群元数据
- **Mongos**：路由进程
- **Shard**：分片节点（每个分片都是复制集）

分片键选择非常关键，影响数据分布与查询性能。

## 数据建模建议

::: tip 提示
- **嵌入式**：适合"一对少量"且子文档不会独立查询
- **引用式**：适合"一对多"且子文档需要独立查询
- 避免无限增长的数组
- 适度反范式化以提高查询性能
:::

## 小结

MongoDB 以其**灵活的文档模型**和**水平扩展能力**在大数据、敏捷开发场景中占据一席之地。
