# VS Code 高效使用

Visual Studio Code（简称 VS Code）是微软出品的一款**免费、开源、跨平台**的现代化代码编辑器，凭借丰富的扩展生态成为前端与全栈开发者的首选。

## 安装与基础设置

- 官网下载：[https://code.visualstudio.com/](https://code.visualstudio.com/)
- 推荐安装 **中文语言包**：`Chinese (Simplified) Language Pack`

### 常用快捷键

| 操作 | Windows / Linux | macOS |
| ---- | --------------- | ----- |
| 打开命令面板 | `Ctrl + Shift + P` | `Cmd + Shift + P` |
| 快速打开文件 | `Ctrl + P` | `Cmd + P` |
| 全局搜索 | `Ctrl + Shift + F` | `Cmd + Shift + F` |
| 行内搜索 | `Ctrl + F` | `Cmd + F` |
| 切换侧边栏 | `Ctrl + B` | `Cmd + B` |
| 切换终端 | `` Ctrl + ` `` | `` Cmd + ` `` |
| 代码格式化 | `Shift + Alt + F` | `Shift + Option + F` |
| 重命名符号 | `F2` | `F2` |
| 多光标选择 | `Ctrl + Alt + ↑/↓` | `Cmd + Option + ↑/↓` |
| 注释切换 | `Ctrl + /` | `Cmd + /` |
| 跳转到行 | `Ctrl + G` | `Ctrl + G` |

## 推荐扩展

### 通用类

- **Chinese (Simplified) Language Pack** —— 中文界面
- **Material Icon Theme** —— 漂亮的文件图标
- **One Dark Pro** —— 经典暗色主题
- **Error Lens** —— 行内直观显示错误
- **Todo Tree** —— 标记与汇总 TODO

### 前端类

- **Volar** —— Vue3 官方推荐
- **ESLint** + **Prettier** —— 代码规范与格式化
- **Stylelint** —— 样式规范
- **Live Server** —— 静态页面热刷新
- **Auto Rename Tag** —— 自动补全闭合标签

### 后端类

- **Spring Boot Extension Pack** —— Spring Boot 全家桶
- **REST Client** —— 类 Postman 的轻量工具
- **Docker** —— Dockerfile 语法高亮与提示
- **Database Client** —— 多数据库 GUI

## 工作区设置

将团队统一配置写入 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "files.eol": "\n",
  "eslint.validate": ["javascript", "typescript", "vue"]
}
```

推荐扩展写入 `.vscode/extensions.json`，克隆项目后 VS Code 会自动提示安装：

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Vue.volar"
  ]
}
```

## 代码片段（Snippets）

以 Vue3 单文件组件为例，配置 `vue.json`：

```json
{
  "Vue3 SFC": {
    "prefix": "v3",
    "body": [
      "<script setup lang=\"ts\">",
      "$1",
      "</script>",
      "",
      "<template>",
      "  <div>$0</div>",
      "</template>",
      "",
      "<style scoped>",
      "</style>"
    ],
    "description": "快速生成 Vue3 SFC 模板"
  }
}
```

## 调试技巧

### Node.js 调试

`.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run Server",
      "program": "${workspaceFolder}/server.js"
    }
  ]
}
```

按 `F5` 启动断点调试。

### Vue3 调试

安装 `Volar` 扩展后，在 `<script setup>` 中可直接打断点；浏览器中配合 `vue-devtools` 扩展使用。

## 远程开发

VS Code 通过 **Remote - SSH** 扩展，可直接连接远程服务器开发：

1. 安装 `Remote - SSH` 扩展
2. 命令面板执行 `Remote-SSH: Connect to Host...`
3. 输入 `user@host` 即可在本地编辑远程文件

## 性能优化

::: tip 提示
- 关闭不用的扩展（特别是 CPU 占用高的如 `GitLens`）
- 在 `settings.json` 中设置 `"files.watcherExclude"`，减少文件监听压力
- 关闭自动保存或调大自动保存间隔
:::

## 小结

VS Code 的核心是**编辑 + 扩展 + 终端**。熟练使用命令面板与快捷键能让效率翻倍。
