# VitePress 搭建个人文档 + GitHub Pages 自动化部署 总结

> 本文记录从 0 到 1 搭建 VitePress 文档站，并配置 GitHub Pages 自动部署的完整流程与踩坑记录。

## 一、项目背景

- **目标**：搭建一个类似 javaguide.cn 的技术文档阅读网站
- **技术栈**：VitePress 1.6 + Vue 3.5 + 纯静态站点
- **部署平台**：GitHub Pages（通过 GitHub Actions 自动部署）
- **Node 环境**：≥ 18.0.0

## 二、需求清单

| 类别 | 要求 |
| --- | --- |
| 布局 | 桌面三栏：顶部导航 + 左侧文章 + 中间正文 + 右侧目录 |
| 顶部导航 | 三大分类（开发工具 / 数据库 / 框架）下拉子菜单 |
| 左侧栏 | 文章分组、折叠展开、当前高亮、本地全文搜索 |
| 右侧栏 | 自动提取 H1~H3、锚点跳转、滚动联动高亮 |
| 正文 | Markdown 全语法、代码高亮、一键复制、图片自适应 |
| 全局 | 明暗主题切换、回到顶部、响应式适配移动端 |

## 三、项目结构

```text
d:\1\vite\
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署
├── docs/
│   ├── .vitepress/
│   │   ├── config.js           # 站点主配置
│   │   └── theme/
│   │       ├── index.js        # 自定义主题入口
│   │       ├── components/
│   │       │   └── BackToTop.vue
│   │       └── styles/
│   │           └── style.css
│   ├── public/
│   │   └── logo.svg
│   ├── index.md                # 首页
│   ├── dev-tools/              # 开发工具
│   ├── database/               # 数据库
│   ├── framework/              # 框架
│   └── javase/                 # Java 基础
├── .gitignore
├── package.json
└── README.md
```

## 四、搭建步骤

### 步骤 1：初始化项目

```bash
mkdir d:\1\vite
cd d:\1\vite
npm init -y
```

### 步骤 2：安装依赖

```bash
npm install -D vitepress@^1.6.3 vue@^3.5.13
```

### 步骤 3：创建 package.json 脚本

```json
{
  "name": "tech-docs-site",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "docs:dev": "vitepress dev docs --host",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs --host",
    "docs:deploy": "vitepress build docs && gh-pages -d docs/.vitepress/dist"
  },
  "devDependencies": {
    "vitepress": "^1.6.3",
    "vue": "^3.5.13"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 步骤 4：编写 VitePress 配置

文件路径 `docs/.vitepress/config.js`：

```js
import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: '技术文档导航',
  description: '一份面向开发者的精选技术文档',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],
  cleanUrls: true,
  themeConfig: {
    logo: { src: '/logo.svg', alt: '技术文档' },
    nav: [
      {
        text: 'javaSE',
        items: [
          { text: 'java基础', link: '/javase/jichu' },
          { text: '数组',   link: '/javase/shuzhu' },
          { text: '方法',   link: '/javase/fangfa' },
          { text: '对象',   link: '/javase/duixiang' },
        ],
      },
      { text: '开发工具', items: [
        { text: 'Git',     link: '/dev-tools/git' },
        { text: 'Docker',  link: '/dev-tools/docker' },
        { text: 'VS Code', link: '/dev-tools/vscode' },
        { text: 'Postman', link: '/dev-tools/postman' },
      ]},
      { text: '数据库', items: [
        { text: 'MySQL',   link: '/database/mysql' },
        { text: 'Redis',   link: '/database/redis' },
        { text: 'MongoDB', link: '/database/mongodb' },
      ]},
      { text: '框架', items: [
        { text: 'Spring Boot', link: '/framework/spring-boot' },
        { text: 'Vue3',        link: '/framework/vue3' },
        { text: 'React',       link: '/framework/react' },
      ]},
      { text: '首页', link: '/' },
    ],
    sidebar: {
      '/dev-tools/': [
        { text: '开发工具', items: [
          { text: 'Git 入门到精通',  link: '/dev-tools/git' },
          { text: 'Docker 容器化',   link: '/dev-tools/docker' },
          { text: 'VS Code 高效使用', link: '/dev-tools/vscode' },
          { text: 'Postman 接口调试', link: '/dev-tools/postman' },
        ]},
      ],
      '/database/': [
        { text: '数据库', items: [
          { text: 'MySQL 基础与进阶',  link: '/database/mysql' },
          { text: 'Redis 缓存实战',    link: '/database/redis' },
          { text: 'MongoDB 文档型数据库', link: '/database/mongodb' },
        ]},
      ],
      '/framework/': [
        { text: '框架', items: [
          { text: 'Spring Boot 快速上手', link: '/framework/spring-boot' },
          { text: 'Vue3 组合式 API',      link: '/framework/vue3' },
          { text: 'React Hooks 指南',     link: '/framework/react' },
        ]},
      ],
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 1, titles: 2 },
          },
        },
      },
    },
    outline: { level: [1, 2, 3], label: '本页目录' },
    appearance: true,
    docFooter: { prev: '上一篇', next: '下一篇' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024-present',
    },
  },
  markdown: {
    lineNumbers: true,
    theme: { light: 'github-light', dark: 'github-dark' },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详情',
    },
  },
})
```

### 步骤 5：自定义主题 —— 回到顶部

文件路径 `docs/.vitepress/theme/index.js`：

```js
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BackToTop from './components/BackToTop.vue'
import './styles/style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BackToTop', BackToTop)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-footer-before': () => h(BackToTop),
    })
  },
}
```

文件路径 `docs/.vitepress/theme/components/BackToTop.vue`：

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const THRESHOLD = 300

const onScroll = () => { visible.value = window.scrollY > THRESHOLD }
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <transition name="fade">
    <button
      v-if="visible"
      class="back-to-top"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M12 4l-8 8h5v8h6v-8h5z"/>
      </svg>
    </button>
  </transition>
</template>
```

### 步骤 6：编写 Markdown 内容

按照 `docs/<分类>/<文章>.md` 组织文件，**关键点**：文件名建议用英文/拼音，避免中文 URL 编码问题（见踩坑记录）。

### 步骤 7：本地启动验证

```bash
npm run docs:dev
# 浏览器访问 http://localhost:5173
```

## 五、Git 仓库初始化与推送

### 步骤 1：创建本地仓库

```bash
cd d:\1\vite
git init
git branch -M main
```

### 步骤 2：配置 .gitignore

```gitignore
node_modules/
docs/.vitepress/dist/
docs/.vitepress/cache/
docs/.vitepress/.temp/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.log
.env
.env.local
.DS_Store
Thumbs.db
```

### 步骤 3：首次提交

```bash
git add .
git commit -m "feat: 初始化 VitePress 站点"
```

### 步骤 4：关联 GitHub 仓库

```bash
git remote add origin https://github.com/zhuxiaoyi1412826/zhuxiaoyi1412826.github.io.git
git push -u origin main
```

## 六、GitHub Pages 自动化部署（核心）

### 步骤 1：创建工作流文件

文件路径 `.github/workflows/deploy.yml`：

```yaml
name: Deploy VitePress to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build VitePress site
        run: npm run docs:build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 步骤 2：GitHub 仓库设置

```
Settings → Pages → Build and deployment
   Source: 选 "GitHub Actions"
```

### 步骤 3：推送触发部署

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: 添加 GitHub Pages 部署工作流"
git push
```

### 步骤 4：查看部署进度

```
仓库页 → Actions 标签 → "Deploy VitePress to GitHub Pages"
```

两个 Job 都变绿 ✅ 后：

```text
访问 https://zhuxiaoyi1412826.github.io/
```

## 七、踩坑记录（重要）

### 坑 1：中文文件名导致 500 错误

**现象**：
```
GET /javase/%E6%96%B9%E6%B3%95.md?import  net::ERR_ABORTED 500
```

**原因**：Vite 开发服务器在 `?import` 机制下对非 ASCII 文件名解析失败。

**解决**：将文件名改为拼音/英文：
| 改前 | 改后 |
| --- | --- |
| `方法.md` | `fangfa.md` |
| `对象.md` | `duixiang.md` |
| `数组练习.md` | `shuzhu.md` |
| `java基础.md` | `jichu.md` |

**导航 / 侧边栏**中 `text` 字段保持中文显示，`link` 字段用英文路径。

### 坑 2：图片绝对路径引用本机文件

**现象**：
```
Failed to resolve import "/Users/DELL/Desktop/笔记/.../xxx.png"
```

**原因**：MD 中 `<img src="F:/资料/.../xxx.png" />` 引用本机绝对路径。

**解决**：
1. 将图片复制到 `docs/public/img/...`
2. MD 中改用站点相对路径：`/img/xxx.png`

### 坑 3：建议关闭 `cleanUrls`

若文件名含中文，**强烈建议**在 [config.js](file:///d:/1/vite/docs/.vitepress/config.js) 中：

```js
cleanUrls: false   // 改用 /javase/fangfa.html 形式
```

或保持文件名为英文（已采用此方案）。

### 坑 4：用错 GitHub Actions 模板

**现象**：在 GitHub 引导页点错了 "Publish Node.js Package" 模板。

**结果**：workflow 文件名变成 `npm-publish-github-packages.yml`，做的是 npm 包发布，不是站点部署。

**解决**：
1. 取消错误的 workflow 运行
2. 删除错误文件 `.github/workflows/npm-publish-github-packages.yml`
3. 创建正确的 `deploy.yml`（内容见步骤 6.1）

### 坑 5：base 路径配置错误

| 仓库类型 | 访问地址 | `base` 应填 |
| --- | --- | --- |
| 个人主页（`username.github.io`） | `https://username.github.io/` | `/` |
| 项目主页 | `https://username.github.io/repo/` | `/repo/` |

**判断方法**：看仓库名是否等于 `用户名.github.io`。

### 坑 6：首次推送后 Actions 引导页

**现象**：`nothing to commit, working tree clean` 后，Actions 仍显示 "Get started with GitHub Actions"。

**原因**：可能 workflow 文件创建时间晚于 commit，或 `.gitignore` 误过滤。

**解决**：通过 GitHub 网页直接创建 workflow 文件（"set up a workflow yourself"）。

## 八、验证清单

部署成功后，依次验证：

- [ ] 访问 `https://zhuxiaoyi1412826.github.io/` 能看到首页
- [ ] 顶部导航的 4 个下拉菜单都能展开
- [ ] 点击导航能跳转到对应文章
- [ ] 左侧 sidebar 高亮当前文章
- [ ] `Ctrl + K` 能唤起搜索
- [ ] 右侧目录显示 H1~H3 标题
- [ ] 点击目录项能锚点跳转
- [ ] 滚动正文，目录高亮跟随
- [ ] 代码块右上角有"复制"按钮
- [ ] 右上角主题切换按钮工作
- [ ] 滚动超过 300px，右下角出现"回到顶部"
- [ ] 浏览器窄到 < 768px 时，布局变为移动端

## 九、常用命令速查

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run docs:dev` | 启动开发服务器（热更新） |
| `npm run docs:build` | 生产构建 |
| `npm run docs:preview` | 本地预览构建产物 |
| `git add .` | 暂存所有变更 |
| `git commit -m "msg"` | 提交 |
| `git push` | 推送（自动触发部署） |
| `git log --oneline` | 查看提交历史 |

## 十、扩展方向

- 🌓 **Algolia DocSearch**：替换本地搜索，支持中文分词
- 🌐 **多语言**：用 `locales` 配置中英双语
- 📊 **评论系统**：集成 Giscus（基于 GitHub Discussions）
- 🔍 **SEO 优化**：自定义 `head` 注入 og:image、description
- 📈 **访问统计**：接入百度统计 / Google Analytics
- 🎨 **自定义首页 Hero**：用 `layout: home` 配合 features

## 十一、最终成果

- ✅ 个人文档站：`https://zhuxiaoyi1412826.github.io/`
- ✅ 源码仓库：自动部署，push 即发布
- ✅ 文章分类：开发工具 / 数据库 / 框架 / Java 基础
- ✅ 站内功能：搜索、目录、代码高亮、复制、明暗主题、回顶、响应式
- ✅ 工作流：build + deploy 全自动，2~3 分钟上线

> 💡 后续只需在 `docs/<分类>/` 下新增 `.md` 文件 + 在 `config.js` 的 sidebar 中加一项，`git push` 即可上线。
