# Docker 容器化

Docker 是一种轻量级的操作系统虚拟化方案，它让开发者可以将应用及其依赖打包到一个**可移植的容器**中，实现"一次构建，处处运行"。

## 为什么需要 Docker

在没有 Docker 之前，开发者常被这些问题困扰：

- 本地能跑，线上就报错
- 多人协作时环境不一致
- 部署流程冗长、易出错

Docker 通过**镜像**和**容器**两个核心概念解决了上述问题。

## 核心概念

### 镜像（Image）

只读模板，用于创建容器。类似于面向对象中的"类"。

### 容器（Container）

镜像的运行实例。类似于"对象"。

### 仓库（Registry）

存放镜像的地方，公有仓库如 [Docker Hub](https://hub.docker.com/)。

## 安装 Docker

- **Windows / macOS**：下载 [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux (Ubuntu)**：

  ```bash
  curl -fsSL https://get.docker.com | bash
  sudo usermod -aG docker $USER   # 让当前用户免 sudo
  ```

## 快速上手

### 运行一个 Nginx 容器

```bash
# 后台启动，将主机 8080 映射到容器 80
docker run -d -p 8080:80 --name my-nginx nginx

# 查看运行中的容器
docker ps

# 访问测试
curl http://localhost:8080
```

### 常用命令

```bash
docker images              # 列出本地镜像
docker pull redis:7        # 拉取镜像
docker stop my-nginx       # 停止容器
docker start my-nginx      # 启动已停止的容器
docker rm my-nginx         # 删除容器
docker rmi nginx           # 删除镜像
docker logs -f my-nginx    # 查看日志（-f 跟踪）
docker exec -it my-nginx bash   # 进入容器
```

## Dockerfile 编写

下面是一个 Node 应用的示例：

```dockerfile
# 基础镜像
FROM node:20-alpine

# 工作目录
WORKDIR /app

# 复制依赖清单并安装
COPY package*.json ./
RUN npm install --production

# 复制源码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
```

```bash
# 构建镜像
docker build -t my-node-app:1.0 .

# 运行镜像
docker run -d -p 3000:3000 my-node-app:1.0
```

## Docker Compose

当应用包含多个服务时，使用 Compose 一次编排：

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - redis
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

```bash
docker compose up -d      # 启动
docker compose down       # 停止并清理
docker compose logs -f    # 查看日志
```

## 数据持久化

容器内的数据默认是临时的。可通过**卷（Volume）**持久化：

```bash
# 创建命名卷
docker volume create my-data

# 挂载到容器
docker run -d -v my-data:/var/lib/mysql mysql:8
```

## 网络模式

| 模式 | 说明 |
| ---- | ---- |
| `bridge` | 默认模式，容器间可通过容器名互通 |
| `host` | 直接使用主机网络，性能最佳 |
| `none` | 禁用网络 |

## 镜像优化技巧

::: tip 提示
- 使用 **alpine** 基础镜像，体积更小
- 合并多条 `RUN` 命令，减少层数
- 利用 **多阶段构建** 分离编译与运行环境
- 使用 `.dockerignore` 排除无关文件
:::

多阶段构建示例：

```dockerfile
# 阶段一：构建
FROM golang:1.22 AS builder
WORKDIR /src
COPY . .
RUN go build -o app

# 阶段二：运行
FROM alpine:3.20
COPY --from=builder /src/app /app
CMD ["/app"]
```

## 小结

Docker 已成为云原生时代的基石。掌握镜像构建、容器编排与数据持久化，足以应对大部分日常场景。
