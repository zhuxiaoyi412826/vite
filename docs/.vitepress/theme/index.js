import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BackToTop from './components/BackToTop.vue'
import './styles/style.css'

/**
 * 主题入口
 * - 继承 VitePress 默认主题
 * - 注册全局自定义组件：BackToTop（回到顶部）
 * - 注入自定义样式
 */
export default {
  extends: DefaultTheme,
  // 全局注册组件，MD 中可直接使用 <BackToTop />
  enhanceApp({ app }) {
    app.component('BackToTop', BackToTop)
  },
  // 包裹默认布局，在文档底部插槽插入回到顶部按钮
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // VitePress 默认布局提供了名为 'doc-footer-before' 的插槽
      'doc-footer-before': () => h(BackToTop),
    })
  },
}
