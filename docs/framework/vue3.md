# Vue3 组合式 API

Vue 3 是一次**完全重写**的版本，于 2020 年 9 月发布。核心变化是引入了**组合式 API**（Composition API），让代码组织更灵活、复用更方便。

## 创建项目

```bash
# 使用官方脚手架
npm create vue@latest my-app

# 或使用 Vite
npm create vite@latest my-app -- --template vue
```

## 模板语法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello Vue 3')
const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">点击了 {{ count }} 次</button>
</template>
```

## 响应式基础

### ref vs reactive

- `ref`：可包装任意类型，访问值需要 `.value`（在模板中自动解包）
- `reactive`：仅支持对象类型，访问属性不需要 `.value`

```ts
import { ref, reactive } from 'vue'

const num = ref(0)              // 基础类型用 ref
const state = reactive({        // 对象用 reactive
  name: 'Alice',
  age: 20
})

// 模板中
// {{ num }}      -- 自动解包
// {{ state.name }}
```

### computed（计算属性）

```ts
import { ref, computed } from 'vue'

const count = ref(1)
const double = computed(() => count.value * 2)
```

### watch（侦听器）

```ts
import { ref, watch } from 'vue'

const name = ref('')

// 基础用法
watch(name, (newVal, oldVal) => {
  console.log(newVal, oldVal)
})

// 立即执行
watch(name, (val) => {}, { immediate: true })

// 深度监听
watch(state, (val) => {}, { deep: true })
```

## 生命周期

选项式 API 与组合式 API 的对应关系：

| 选项式 | 组合式 |
| ------ | ------ |
| `beforeCreate` | `setup()` |
| `created` | `setup()` |
| `onBeforeMount` | `onBeforeMount` |
| `onMounted` | `onMounted` |
| `onBeforeUpdate` | `onBeforeUpdate` |
| `onUpdated` | `onUpdated` |
| `onUnmounted` | `onUnmounted` |

```ts
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('组件已挂载')
})

onUnmounted(() => {
  console.log('组件已卸载')
})
```

## 组件通信

### Props（父 → 子）

```vue
<!-- Parent.vue -->
<Child :title="msg" />
```

```vue
<!-- Child.vue -->
<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <h2>{{ title }}</h2>
</template>
```

### Emit（子 → 父）

```vue
<!-- Child.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

const onClick = () => emit('change', 'new value')
</script>

<template>
  <button @click="onClick">Click</button>
</template>
```

```vue
<!-- Parent.vue -->
<Child @change="handleChange" />
```

### v-model 双向绑定

```vue
<!-- Parent.vue -->
<Child v-model:title="msg" />
```

```vue
<!-- Child.vue -->
<script setup lang="ts">
defineProps<{ title: string }>()
defineEmits<{ (e: 'update:title', value: string): void }>()
</script>
```

## 组合式函数（Composables）

把可复用的逻辑抽到独立文件：

```ts
// useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

```vue
<script setup>
import { useMouse } from './useMouse'
const { x, y } = useMouse()
</script>

<template>
  <p>x: {{ x }}, y: {{ y }}</p>
</template>
```

## 路由（vue-router 4）

```ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/',         component: () => import('./Home.vue') },
  { path: '/about',    component: () => import('./About.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
```

## 状态管理（Pinia）

```ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ name: 'Alice', age: 20 }),
  getters: {
    doubleAge: (state) => state.age * 2
  },
  actions: {
    grow() { this.age++ }
  }
})
```

```vue
<script setup>
import { useUserStore } from './stores/user'
const user = useUserStore()
</script>

<template>
  <p>{{ user.name }} - {{ user.age }}</p>
  <button @click="user.grow">+1</button>
</template>
```

## 性能优化

::: tip 提示
- 使用 `v-show` 替代频繁切换的 `v-if`
- 列表渲染必须加 `:key`
- 路由懒加载 `() => import('./Page.vue')`
- 必要时使用 `shallowRef` / `shallowReactive` 减少深响应开销
- 使用 `<KeepAlive>` 缓存组件
:::

## 小结

Vue3 组合式 API 让**逻辑复用**与**类型推导**达到了新的高度。掌握 `ref` / `reactive` / `computed` / `watch` 即可应对大部分业务场景。
