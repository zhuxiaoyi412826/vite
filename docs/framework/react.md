# React Hooks 指南

React 是 Facebook（现 Meta）开源的用于构建用户界面的 JavaScript 库。从 16.8 版本起引入的 **Hooks** 彻底改变了状态管理与副作用处理方式。

## 创建项目

```bash
# 使用 Vite 官方模板
npm create vite@latest my-app -- --template react-ts

# 或使用官方脚手架
npx create-react-app my-app
```

## 第一个组件

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点击</button>
    </div>
  )
}
```

## 核心 Hooks

### useState

函数组件的"状态钩子"。

```tsx
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)
```

### useEffect

副作用钩子，在组件渲染后执行。

```tsx
useEffect(() => {
  // 副作用逻辑（如订阅、请求）
  document.title = `计数：${count}`

  // 返回清理函数
  return () => {
    // 组件卸载或依赖更新前执行
  }
}, [count])  // 依赖项，变化时重新执行
```

#### 三种执行时机

- **挂载时执行一次**：`useEffect(fn, [])`
- **每次渲染后执行**：`useEffect(fn)`
- **依赖变化时执行**：`useEffect(fn, [dep])`

### useContext

跨组件共享数据。

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light')

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  )
}

function Child() {
  const theme = useContext(ThemeContext)
  return <div className={theme}>Hello</div>
}
```

### useRef

获取 DOM 引用或保存可变值。

```tsx
const inputRef = useRef<HTMLInputElement>(null)

const focusInput = () => inputRef.current?.focus()

return <input ref={inputRef} />
```

### useMemo / useCallback

性能优化：缓存计算结果与函数引用。

```tsx
const expensive = useMemo(() => {
  return list.filter(item => item.active).map(transform)
}, [list])

const handleClick = useCallback((id: number) => {
  console.log(id)
}, [])
```

### useReducer

复杂状态逻辑的替代方案。

```tsx
type State = { count: number }
type Action = { type: 'inc' } | { type: 'dec' } | { type: 'reset' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc':   return { count: state.count + 1 }
    case 'dec':   return { count: state.count - 1 }
    case 'reset': return { count: 0 }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'inc' })}>+</button>
    </>
  )
}
```

## 自定义 Hook

把可复用的状态逻辑抽成函数：

```tsx
import { useState, useEffect } from 'react'

function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const update = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', update)
    return () => window.removeEventListener('mousemove', update)
  }, [])

  return pos
}
```

## 组件通信

### Props（父 → 子）

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}
```

### 回调函数（子 → 父）

```tsx
function Child({ onChange }: { onChange: (v: string) => void }) {
  return <input onChange={(e) => onChange(e.target.value)} />
}
```

### Children

```tsx
<Card>
  <p>这是传入的内容</p>
</Card>

function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>
}
```

## 路由（React Router 6）

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/',         element: <Home /> },
  { path: '/about',    element: <About /> },
  { path: '/users/:id', element: <User /> }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
```

## 全局状态（Zustand）

相比 Redux 简洁许多：

```ts
import { create } from 'zustand'

type UserState = {
  name: string
  setName: (v: string) => void
}

export const useUser = create<UserState>((set) => ({
  name: 'Alice',
  setName: (v) => set({ name: v })
}))
```

```tsx
function Profile() {
  const { name, setName } = useUser()
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}
```

## 性能优化

::: tip 提示
- 使用 `React.memo` 包装纯展示组件
- 列表渲染必须加 `key`
- 路由懒加载：`const Page = lazy(() => import('./Page'))`
- 必要时使用 `useMemo` / `useCallback`
- 大列表使用虚拟滚动（`react-window`）
:::

## Hooks 使用规则

::: warning 警告
- **只在顶层调用 Hooks**（不要在循环、条件、嵌套函数中调用）
- **只在 React 函数中调用 Hooks**（函数组件或自定义 Hook）
- 遵循这两条规则，React 才能正确管理 Hooks 的状态
:::

## 小结

Hooks 是 React 现代化的核心。掌握 `useState` / `useEffect` / `useContext` / `useRef` 即可应对绝大部分业务场景。
