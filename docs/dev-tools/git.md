# Git 入门到精通

Git 是目前最流行的分布式版本控制系统，由 Linus Torvalds 于 2005 年创建。本章将系统性地讲解 Git 的核心概念与高频操作。

## 什么是版本控制

版本控制是一种记录文件内容变化，以便将来查阅特定版本修订情况的系统。它可以让你：

- 回溯到任意历史版本
- 比较变更差异
- 多人协同开发不冲突

## 安装与配置

### 安装

- **Windows**：下载 [Git for Windows](https://git-scm.com/)
- **macOS**：`brew install git`
- **Linux**：`apt install git` / `yum install git`

### 全局配置用户信息

```bash
# 提交时显示的作者名与邮箱（必填）
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"

# 默认编辑器
git config --global core.editor vim

# 默认分支名（推荐 main）
git config --global init.defaultBranch main
```

## 基本工作流

```bash
# 1. 初始化仓库
git init

# 2. 查看状态
git status

# 3. 添加到暂存区
git add .                  # 全部文件
git add src/index.js       # 指定文件

# 4. 提交到本地仓库
git commit -m "feat: 新增登录页面"

# 5. 关联远程仓库并推送
git remote add origin git@github.com:user/repo.git
git push -u origin main
```

## 核心概念

### 三大区域

| 区域 | 含义 | 常用命令 |
| ---- | ---- | -------- |
| 工作区 | 实际编辑的文件 | - |
| 暂存区 | 准备提交的文件快照 | `git add` |
| 版本库 | 已提交的历史 | `git commit` |

### 三大对象

- **commit**：指向一次提交
- **tree**：对应一个目录
- **blob**：对应一个文件

## 分支管理

```bash
# 创建并切换分支
git checkout -b feature/login

# 查看所有分支
git branch -a

# 合并分支（快进合并）
git checkout main
git merge feature/login

# 删除分支
git branch -d feature/login
```

## 常用命令速查

::: tip 提示
下方命令按照日常使用频率排序，建议熟记前 10 个。
:::

| 命令 | 作用 |
| ---- | ---- |
| `git status` | 查看状态 |
| `git diff` | 查看差异 |
| `git log --oneline --graph` | 可视化历史 |
| `git reset --hard HEAD^` | 回退到上一版本 |
| `git stash` | 暂存未提交改动 |
| `git stash pop` | 恢复暂存 |
| `git revert <commit>` | 撤销某次提交 |
| `git cherry-pick <commit>` | 拣选提交 |
| `git rebase -i HEAD~3` | 交互式变基 |
| `git reflog` | 查看引用日志（救命用） |

## 协作模型

### 集中式工作流

适合小团队，所有人共用 `main` 分支。

### GitHub Flow

1. 从 `main` 拉出特性分支
2. 在特性分支上提交
3. 发起 Pull Request
4. 评审通过后合并回 `main`

### Git Flow

分为 `master` / `develop` / `feature` / `release` / `hotfix` 五类分支，适合有版本发布节奏的产品。

## 常见问题

::: warning 警告
**请勿将敏感信息提交到仓库**（如 `.env`、私钥）。建议在项目根目录添加 `.gitignore`。
:::

- **冲突如何解决？**  编辑冲突文件后 `git add` + `git commit`。
- **误删分支怎么办？**  使用 `git reflog` 找到对应 commit，再 `git branch xxx <sha>` 重建。
- **如何修改最近一次提交信息？**  `git commit --amend`。

## 小结

掌握 Git 的关键在于理解其"快照"而非"差异"的存储模型，再结合日常命令反复练习即可熟练。
