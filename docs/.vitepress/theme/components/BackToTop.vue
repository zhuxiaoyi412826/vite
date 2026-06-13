<script setup>
/**
 * 回到顶部按钮
 * - 监听页面滚动，超过阈值时淡入显示
 * - 平滑滚动回顶部
 * - 兼容明暗主题
 */
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
// 滚动超过该像素后显示按钮
const THRESHOLD = 300

// 滚动事件处理：切换显示状态
const onScroll = () => {
  visible.value = window.scrollY > THRESHOLD
}

// 点击回到顶部，平滑滚动
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // 初始化一次，避免刷新页面时按钮状态错位
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <transition name="fade">
    <button
      v-if="visible"
      class="back-to-top"
      aria-label="回到顶部"
      title="回到顶部"
      @click="scrollToTop"
    >
      <!-- 简化的 SVG 向上箭头 -->
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 4l-8 8h5v8h6v-8h5z"
        />
      </svg>
    </button>
  </transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 32px;
  z-index: 100;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.back-to-top:hover {
  transform: translateY(-2px);
  background: var(--vp-c-bg-mute);
}

.back-to-top:active {
  transform: translateY(0);
}

/* 移动端：适当缩小并靠近右下角 */
@media (max-width: 640px) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
    width: 36px;
    height: 36px;
  }
}

/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
