# Git Hooks 与 Commitizen 工作流程解释

## 问题描述

当执行 `pnpm commit` 命令时，系统不仅运行了 commitizen/cz-git 生成提交信息模板，还执行了 `.husky/pre-commit` 钩子中的内容，这让您感到困惑：为什么调用 commitizen 会触发 Git 的 pre-commit 钩子？

## Git Hooks 工作原理

### Git Hooks 简介

Git Hooks（Git 钩子）是 Git 版本控制系统提供的一种机制，允许在特定的 Git 操作（如提交、推送、合并等）前后自动执行预定义的脚本。这些脚本可以用来进行代码检查、测试、格式化等操作，确保代码质量和提交规范。

### 钩子的位置和类型

Git Hooks 脚本通常存储在项目的 `.git/hooks/` 目录下。使用 husky 等工具后，钩子脚本会被存储在项目根目录的 `.husky/` 目录下，并通过符号链接或其他方式与 Git 钩子关联。

常用的钩子类型包括：
- `pre-commit`：在执行 `git commit` 命令前触发
- `commit-msg`：在提交信息创建后但提交完成前触发
- `pre-push`：在执行 `git push` 命令前触发

## Pre-commit 钩子的触发机制

`pre-commit` 钩子是在执行 `git commit` 命令时自动触发的，无论使用何种方式调用 `git commit`。它的触发与调用 `git commit` 的方式无关，只与 `git commit` 命令本身有关。

## Commitizen 与 CZ-Git 工作流程

### Commitizen 简介

Commitizen 是一个用于规范化 Git 提交信息的工具，它提供了交互式界面来生成符合特定格式的提交信息。在您的项目中，使用了 cz-git 作为 Commitizen 的适配器。

### 项目中的配置

在 `package.json` 文件中，您的项目做了如下配置：

```json
{
  "scripts": {
    "commit": "npx cz"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

## 为什么 pnpm commit 会触发 pre-commit 钩子？

**核心原因：** 当您执行 `pnpm commit` 时，实际上发生了以下流程：

1. `pnpm commit` 执行 `package.json` 中定义的 `"npx cz"` 脚本
2. `npx cz` 启动 Commitizen，使用配置的 cz-git 适配器
3. cz-git 提供交互式界面，引导您填写提交信息模板
4. **当您完成交互式输入并确认后，Commitizen 会内部调用 `git commit` 命令**，将生成的提交信息传递给 Git
5. **由于执行了 `git commit` 命令，Git 自动触发了 pre-commit 钩子**，执行 `.husky/pre-commit` 中的 `npm test` 命令

### 关键理解

- Commitizen（包括 cz-git）并不是替代 `git commit`，而是在 `git commit` 之前提供一个交互式界面来生成标准化的提交信息
- 最终，**所有的提交操作都需要通过 Git 的 `git commit` 命令来完成**，这就是为什么会触发 Git 钩子

## 完整工作流程图

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  执行 pnpm commit │ ──> │ 启动 npx cz    │ ──> │ Commitizen/     │
│                 │     │                 │     │ CZ-Git 交互式输入 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  提交成功或失败   │ <── │ Git 执行提交操作 │ <── │ Commitizen 调用 │
│                 │     │                 │     │ git commit 命令 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                │
                                │ 触发
                                ▼
                        ┌─────────────────┐
                        │                 │
                        │ 执行 pre-commit │
                        │ 钩子 (npm test) │
                        │                 │
                        └─────────────────┘
```

## 总结

1. `pnpm commit` 启动了 Commitizen 的交互式界面
2. Commitizen 生成标准化的提交信息后，必须调用 `git commit` 命令来完成实际的提交操作
3. 由于调用了 `git commit` 命令，Git 自动触发了 pre-commit 钩子
4. pre-commit 钩子执行了 `.husky/pre-commit` 文件中定义的 `npm test` 命令

这是 Git hooks 和 Commitizen 工作流程的正常行为，确保了在提交前可以执行必要的检查和验证。