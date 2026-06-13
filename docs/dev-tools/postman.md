# Postman 接口调试

Postman 是目前最流行的 API 调试与协作工具，本章将介绍其核心功能与实战技巧。

## 核心概念

### Request（请求）

由 URL、方法（GET / POST / PUT / DELETE 等）、Headers、Body 组成。

### Collection（集合）

一组请求的容器，可整体运行、共享。

### Environment（环境）

变量集合，方便在多套环境（开发 / 测试 / 生产）间切换。

## 安装

- 官网：[https://www.postman.com/downloads/](https://www.postman.com/downloads/)
- 跨平台，下载对应系统安装包即可

## 第一个请求

```http
GET https://jsonplaceholder.typicode.com/users/1
```

步骤：

1. 点击 **+** 新建请求
2. 选择方法 `GET`
3. 输入上述 URL
4. 点击 **Send**
5. 在下方查看响应 Body / Headers / 状态码

## 环境变量

新建 `Local` 环境，添加变量：

| Variable | Initial Value | Current Value |
| -------- | ------------- | ------------- |
| `baseUrl` | `https://api.example.com` | 同左 |
| `token` | `abc123` | 同左 |

请求中可通过 `{{baseUrl}}/users` 引用，多环境切换时只需修改变量值。

## 请求示例

### 带 Header 的 GET

```http
GET {{baseUrl}}/users
Authorization: Bearer {{token}}
```

### 提交 JSON 的 POST

```http
POST {{baseUrl}}/users
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com"
}
```

### 文件上传

Body 切换为 `form-data`，Key 输入 `file` 并将右侧类型选为 `File`，Value 选择本地文件。

## 集合与测试

将多个相关请求保存为 Collection 后，可使用 **Collection Runner** 一键执行：

```javascript
// 在 Tests 选项卡中编写断言
pm.test("状态码应为 200", () => {
  pm.response.to.have.status(200)
})

pm.test("返回用户名为 Alice", () => {
  const json = pm.response.json()
  pm.expect(json.name).to.eql("Alice")
})
```

## 脚本自动化

### Pre-request Script

在请求发送前执行，常用于生成签名：

```javascript
// 生成时间戳
pm.environment.set("timestamp", Date.now())

// 简单 MD5 签名（示例）
const crypto = require('crypto-js')
const raw = pm.environment.get("secret") + pm.environment.get("timestamp")
pm.environment.set("sign", crypto.MD5(raw).toString())
```

### Tests 脚本

在响应返回后执行，可串联测试场景。

## Mock Server

将 Collection 发布到云端，自动获得一个 Mock 地址：

```bash
POST https://<your-mock>.mock.pstmn.io/example
```

请求该地址即可获得预设的响应，便于前端并行开发。

## 监控

Postman **Monitors** 可定时（5 分钟一次起）执行 Collection，将结果通过邮件或 Webhook 推送，常用于线上健康检查。

## 团队协作

- **Workspace**：团队共享空间
- **API Documentation**：自动生成美观的接口文档
- **Git 同步**：Collection 支持导出为 JSON 纳入版本管理

## 替代方案

::: tip 提示
- **Apifox**：国产一体化工具，集文档、Mock、测试、自动化于一体
- **Insomnia**：轻量、界面简洁
- **Hoppscotch**：开源 Web 版
:::

## 小结

Postman 的精髓在于**集合 + 环境变量 + 脚本**。掌握这三板斧，便能高效完成日常接口调试与自动化测试。
