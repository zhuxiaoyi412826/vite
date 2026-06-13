# 技术文档导航 📚

> 一份面向开发者的精选技术文档站点 —— 涵盖**开发工具、数据库、框架、Java 基础**等方向。
> 基于 [VitePress](https://vitepress.dev/) 构建，纯静态、极速加载、SEO 友好。

[![VitePress](https://img.shields.io/badge/VitePress-1.6-3eaf7c?logo=vitepress&logoColor=white)](https://vitepress.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ 站点特性

- 📐 **三栏布局**：顶部导航 + 左侧文章 + 中间正文 + 右侧目录大纲
- 🗂 **分组导航**：开发工具、数据库、框架、Java 基础四大模块，下拉子菜单
- 🔍 **本地全文搜索**：内置 MiniSearch，无需后端，`Ctrl + K` 一键唤起
- 🌗 **明暗主题**：跟随系统 + 手动切换
- 📑 **自动目录**：自动提取 H1~H3 标题，滚动联动高亮
- 📋 **代码高亮 + 一键复制**：Shiki 双主题，支持 100+ 语言
- 📱 **响应式**：桌面三栏 / 移动端抽屉式侧边栏
- ⬆️ **回到顶部**：滚动超过 300px 自动出现

## 🛠 技术栈

| 类别 | 技术 |
| --- | --- |
| 静态站点生成 | VitePress 1.6 |
| 视图框架 | Vue 3.5（组合式 API） |
| 代码高亮 | Shiki |
| 搜索 | MiniSearch（本地） |
| 部署 | GitHub Pages + GitHub Actions |

## 📂 项目结构

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署
├── docs/
│   ├── .vitepress/
│   │   ├── config.js           # 站点主配置（导航、侧边栏、搜索、主题）
│   │   └── theme/
│   │       ├── index.js        # 自定义主题入口
│   │       ├── components/
│   │       │   └── BackToTop.vue   # 回到顶部按钮
│   │       └── styles/
│   │           └── style.css   # 全局样式
│   ├── public/
│   │   └── logo.svg            # 站点 Logo
│   ├── index.md                # 首页
│   ├── dev-tools/              # 开发工具
│   │   ├── git.md
│   │   ├── docker.md
│   │   ├── vscode.md
│   │   └── postman.md
│   ├── database/               # 数据库
│   │   ├── mysql.md
│   │   ├── redis.md
│   │   └── mongodb.md
│   ├── framework/              # 框架
│   │   ├── spring-boot.md
│   │   ├── vue3.md
│   │   └── react.md
│   └── javase/                 # Java 基础
│       ├── jichu.md            # Java 基础
│       ├── fangfa.md           # 方法
│       ├── shuzhu.md           # 数组
│       └── duixiang.md         # 对象
├── .gitignore
├── package.json
└── README.md
```

## 🚀 快速开始

### 环境要求

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9（或 pnpm / yarn）

### 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run docs:dev
```

浏览器打开 [http://localhost:5173](http://localhost:5173) 即可访问。

## 📜 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run docs:dev` | 启动开发服务器（支持热更新） |
| `npm run docs:build` | 构建生产版本（产物在 `docs/.vitepress/dist`） |
| `npm run docs:preview` | 本地预览构建产物 |
| `npm run docs:deploy` | 构建并发布到 GitHub Pages（手动方式） |

## 🌐 部署

### 方式一：GitHub Actions（推荐 · 自动）

项目已内置 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)，**每次 push 到 `main` 分支即自动部署**。

**一次性配置：**

1. 修改 `docs/.vitepress/config.js` 顶部的 `base`：
   ```js
   // 个人主页（仓库名：username.github.io）
   base: '/'
   // 项目主页（仓库名：my-docs）
   base: '/my-docs/'
   ```

2. 在 GitHub 仓库设置：
   ```
   Settings → Pages → Build and deployment → Source → GitHub Actions
   ```

3. 推送到 main 分支即可触发自动部署。

### 方式二：手动部署

```bash
npm run docs:build
# 将 docs/.vitepress/dist 目录下的文件部署到任意静态服务器
```

可托管在：Vercel、Netlify、阿里云 OSS、腾讯云 COS、Nginx 等。

## ✍️ 如何贡献内容

### 新增一篇文章

1. 在对应分类目录下创建 Markdown 文件（**建议使用英文/拼音文件名**，避免中文 URL 编码问题）：
   ```bash
   docs/dev-tools/my-new-tool.md
   ```

2. 在 [`docs/.vitepress/config.js`](docs/.vitepress/config.js) 的 `themeConfig.nav` 与 `themeConfig.sidebar` 中追加条目：
   ```js
   // 顶部导航
   { text: '我的新工具', link: '/dev-tools/my-new-tool' }
   
   // 侧边栏
   '/dev-tools/': [
     { text: '我的新工具', link: '/dev-tools/my-new-tool' }
   ]
   ```

3. 文件第一行写标题：
   ```markdown
   # 我的新工具

   简介段落...
   ```

### 新增一个分类

在 `docs/` 下新建文件夹，例如 `docs/cloud-native/`，然后在 `config.js` 中：
- `nav` 数组追加 `{ text: '云原生', items: [...] }`
- `sidebar` 新增 `'/cloud-native/': [...]` 键

### 添加图片

将图片放入 `docs/public/img/...`，在 MD 中引用：
```markdown
![描述](/img/your-image.png)
```

## 🎨 自定义主题

主题相关文件位于 [`docs/.vitepress/theme/`](docs/.vitepress/theme)：

- **品牌色**：编辑 [`styles/style.css`](docs/.vitepress/theme/styles/style.css) 顶部的 `--vp-c-brand-1` CSS 变量
- **关闭回到顶部**：注释 [`index.js`](docs/.vitepress/theme/index.js) 中 `Layout` 内的 `doc-footer-before`
- **新增全局组件**：在 [`components/`](docs/.vitepress/theme/components) 下创建 `.vue` 文件，并在 `index.js` 中注册

## 📝 写作约定

- 每篇文章首行使用 `# 一级标题` 作为文章标题
- 章节使用 `## 二级标题`、`### 三级标题`
- 代码块必须指定语言以启用高亮：
  ````markdown
  ```java
  System.out.println("Hello");
  ```
  ````
- 提示框语法：
  ```markdown
  ::: tip 提示
  这是一条提示
  :::
  ```

## 🤝 贡献指南

欢迎通过 Issue 与 Pull Request 参与贡献：

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/awesome-doc`
3. 提交改动：`git commit -m "docs: 新增 xxx 章节"`
4. 推送分支：`git push origin feature/awesome-doc`
5. 发起 Pull Request

## 📄 许可证

本项目基于 [MIT](LICENSE) 协议开源。

## 🙏 致谢

- [VitePress](https://vitepress.dev/) —— 强大的静态站点生成器
- [Vue.js](https://vuejs.org/) —— 渐进式 JavaScript 框架
- [JavaGuide](https://javaguide.cn/) —— 设计参考

---

⭐ 如果这个项目对你有帮助，欢迎 Star 支持一下！
