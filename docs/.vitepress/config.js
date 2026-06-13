import { defineConfig } from 'vitepress'

/**
 * VitePress 主配置文件
 *
 * 三大模块（对应顶部导航）：
 *   - 开发工具：/dev-tools/
 *   - 数据库  ：/database/
 *   - 框架    ：/framework/
 *
 * 站点标题、主题、Markdown、搜索等配置均在此集中管理。
 */
export default defineConfig({
  // 站点根路径，部署到子目录时改成 '/your-repo/'
  ignoreDeadLinks: true,
  base: '/vite/',

  // 站点标题（同时用于浏览器标签与 SEO）
  title: '技术文档导航',
  // 站点描述
  description: '一份面向开发者的精选技术文档，涵盖开发工具、数据库与主流框架。',
  // 站点语言，影响代码高亮与分词
  lang: 'zh-CN',
  // 在 head 注入的额外内容（图标等）
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],

  // 关闭 VitePress 的 "Edit on GitHub" 等链接，按需开启
  cleanUrls: true,

  // 主题相关配置
  themeConfig: {
    // 站点 Logo（显示在左上角）
    logo: { src: '/logo.svg', alt: '技术文档' },

    // 顶部导航：三大分类 + 下拉子菜单
    nav: [
          {
        text: 'javaSE',
        items: [
          { text: '数组', link: '/javase/shuzhu' },
          { text: 'jdbc', link: '/javase/jdbc' },     
        ],
      },
      {
        text: '开发工具',
        items: [
          { text: 'Git', link: '/dev-tools/git' },
          { text: 'Docker', link: '/dev-tools/docker' },
          { text: 'VS Code', link: '/dev-tools/vscode' },
          { text: 'Postman', link: '/dev-tools/postman' },
        ],
      },
      {
        text: '数据库',
        items: [
          { text: 'MySQL', link: '/database/mysql' },
          { text: 'Redis', link: '/database/redis' },
          { text: 'MongoDB', link: '/database/mongodb' },
        ],
      },
      {
        text: '框架',
        items: [
          { text: 'Spring Boot', link: '/framework/spring-boot' },
          { text: 'Vue3', link: '/framework/vue3' },
          { text: 'React', link: '/framework/react' },
        ],
      },
      { text: '首页', link: '/' },
    ],

    // 侧边栏：按分组展示，支持折叠（collapsed）
    sidebar: {
       '/javase/': [
        {
          text: 'javase',
          collapsed: false,
          items: [
         { text: '数组', link: '/javase/shuzhu' },
          { text: 'jdbc', link: '/javase/jdbc' },    
          ],
        },
      ],
      '/dev-tools/': [
        {
          text: '开发工具',
          collapsed: false,
          items: [
            { text: 'Git 入门到精通', link: '/dev-tools/git' },
            { text: 'Docker 容器化', link: '/dev-tools/docker' },
            { text: 'VS Code 高效使用', link: '/dev-tools/vscode' },
            { text: 'Postman 接口调试', link: '/dev-tools/postman' },
            { text: 'VitePress + GitHub Pages 部署总结', link: '/vitepress-githupgaess' },
          ],
        },
      ],
      '/database/': [
        {
          text: '数据库',
          collapsed: false,
          items: [
            { text: 'MySQL 基础与进阶', link: '/database/mysql' },
            { text: 'Redis 缓存实战', link: '/database/redis' },
            { text: 'MongoDB 文档型数据库', link: '/database/mongodb' },
          ],
        },
      ],
      '/framework/': [
        {
          text: '框架',
          collapsed: false,
          items: [
            { text: 'Spring Boot 快速上手', link: '/framework/spring-boot' },
            { text: 'Vue3 组合式 API', link: '/framework/vue3' },
            { text: 'React Hooks 指南', link: '/framework/react' },
          ],
        },
      ],
    },

    // 本地全文搜索配置
    search: {
      provider: 'local',
      options: {
        // 详细配置参考 vitepress 文档
        miniSearch: {
          // 搜索选项
          searchOptions: {
            // 模糊搜索（0 = 完全匹配，1 = 全部匹配）
            fuzzy: 0.2,
            // 前缀搜索
            prefix: true,
            // 提升字段权重
            boost: { title: 4, text: 1, titles: 2 },
          },
        },
      },
    },

    // 右侧目录大纲配置：自动提取 H1~H3
    outline: {
      level: [1, 2, 3],
      label: '本页目录',
    },

    // 启用明暗主题切换
    appearance: true,

    // 启用上一页 / 下一页导航
    docFooter: { prev: '上一篇', next: '下一篇' },

    // 社交链接（按需增删）
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' },
    ],

    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024-present',
    },

    // 编辑链接（可选）
    // editLink: { pattern: 'https://github.com/xxx/edit/main/docs/:path', text: '在 GitHub 上编辑此页' },
  },

  // Markdown 配置：行号、代码高亮、容器等
  markdown: {
    // 显示代码块行号
    lineNumbers: true,
    // 主题（基于 Shiki）
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    // 自定义容器（提示框样式）
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详情',
    },
    // 代码块配置：自动包裹，外部 import 等等
    code: {
      // 主题高亮行（可在 md 中使用 // [!code highlight]）
      highlights: undefined,
      // 启用行号主题
      lineNumbers: true,
      // 是否支持 shiki 主题
      themeReveal: false,
    },
  },

  // 站点构建后行为
  buildEnd: undefined,

  // 关闭（或开启）Mermaid、TeX 等扩展
  // vite: { server: { port: 5173 } }
})
