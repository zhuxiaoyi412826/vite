# Redis 缓存实战

Redis（Remote Dictionary Server）是一个**基于内存**的高性能键值数据库，常用于缓存、排行榜、计数器、分布式锁等场景。

## 特点

- ⏱ **极致性能**：读 11 万次/秒，写 8 万次/秒
- 💾 **丰富数据结构**：String、Hash、List、Set、Sorted Set 等
- 🔁 **持久化**：RDB / AOF
- 🌐 **集群**：主从、哨兵、Cluster

## 安装与启动

```bash
# macOS
brew install redis
redis-server

# Linux (apt)
sudo apt install redis-server
sudo systemctl start redis

# 客户端连接
redis-cli
```

## 五大基础数据类型

### String

最简单的 key-value 类型，最大 512MB。

```bash
# 设置值
SET name "Alice"
GET name

# 计数器
SET views 0
INCR views       # 自增 1
INCRBY views 10  # 自增 10

# 过期时间（秒）
SETEX key 60 "value"
TTL key          # 查看剩余过期时间
```

### Hash

适合存储对象。

```bash
HSET user:1 name "Alice" age 20
HGET user:1 name
HGETALL user:1
```

### List

链表结构，可作为队列 / 栈。

```bash
LPUSH tasks "task1"
RPUSH tasks "task2"
LPOP tasks
LRANGE tasks 0 -1
```

### Set

无序集合，自动去重，支持交并差。

```bash
SADD tags "java" "redis" "db"
SMEMBERS tags
SINTER tag1 tag2   # 交集
SUNION tag1 tag2   # 并集
SDIFF tag1 tag2    # 差集
```

### Sorted Set (ZSet)

带权重的集合，常用于排行榜。

```bash
ZADD rank 100 "Alice" 90 "Bob" 95 "Carol"
ZREVRANGE rank 0 2 WITHSCORES
ZRANK rank "Alice"
```

## 高级数据类型

| 类型 | 用途 |
| ---- | ---- |
| `Bitmap` | 布隆过滤、签到统计 |
| `HyperLogLog` | 基数统计（UV） |
| `GEO` | 地理位置 |
| `Stream` | 消息队列（5.0+） |

## 持久化

### RDB（快照）

定时将内存数据写入 dump.rdb 文件。

```conf
# redis.conf
save 900 1     # 900 秒内至少 1 个 key 变更则触发
save 300 10
dbfilename dump.rdb
```

### AOF（追加日志）

记录每条写命令，默认丢失不超过 1 秒。

```conf
appendonly yes
appendfsync everysec
```

::: tip 提示
生产环境**建议 RDB + AOF 同时开启**。
:::

## 主从复制

实现读写分离与高可用。

```bash
# 在从节点执行
replicaof 192.168.1.100 6379
```

主从复制流程：

1. 从节点发送 `PSYNC` 请求同步
2. 主节点执行 `BGSAVE` 生成 RDB
3. 主节点将新写入命令缓存在缓冲区
4. 发送 RDB + 缓冲区命令到从节点
5. 从节点加载并重放

## 哨兵模式（Sentinel）

监控主从节点，自动故障转移：

```conf
# sentinel.conf
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
```

## Cluster 集群

通过分片（sharding）将数据分散到多个节点：

- 至少需要 **3 主 3 从** 6 个节点
- 数据按 **16384 个槽位**分配
- 客户端通过 CRC16 算法定位

```bash
# 创建集群
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 \
  127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
  --cluster-replicas 1
```

## 常见应用场景

### 1. 缓存

```java
// 伪代码
User user = redis.get("user:" + id);
if (user == null) {
    user = db.query("SELECT * FROM user WHERE id = ?", id);
    redis.setex("user:" + id, 3600, toJson(user));
}
return user;
```

### 2. 分布式锁

```bash
SET lock:order 1 NX EX 10
# 业务处理...
DEL lock:order
```

`NX`：仅当 key 不存在时设置；`EX 10`：设置 10 秒过期，防止死锁。

### 3. 排行榜

```bash
ZADD game:rank 1500 "player1" 1800 "player2"
ZREVRANGE game:rank 0 9 WITHSCORES
```

### 4. 限流

```bash
# 简单计数器
INCR rate:api:user:1
EXPIRE rate:api:user:1 60
# 若返回值 > 100 则限流
```

## 缓存问题

### 缓存穿透

查询一个**根本不存在**的数据，导致每次都打到 DB。

::: tip 解决方案
- 缓存空对象
- 布隆过滤器
:::

### 缓存击穿

**热点 key 失效**瞬间，大量请求打到 DB。

::: tip 解决方案
- 永不过期 + 异步刷新
- 互斥锁（`SETNX`）
:::

### 缓存雪崩

**大量 key 同时失效**或 Redis 宕机，请求全打到 DB。

::: tip 解决方案
- 过期时间加随机偏移
- 多级缓存
- 熔断降级
:::

## 小结

Redis 以其简单易用、性能卓越成为后端工程师的"瑞士军刀"。深入掌握数据结构与持久化机制，是用好 Redis 的关键。
