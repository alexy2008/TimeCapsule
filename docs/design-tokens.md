# 设计令牌说明

## 概述

共享样式系统使用 CSS 自定义属性 (Custom Properties) 作为设计令牌，确保不同前端实现保持一致的视觉风格。

所有令牌定义在 `spec/styles/tokens.css` 中。

## 颜色系统

### 主色调

| 令牌 | 亮色值 | 暗色值 | 说明 |
|------|--------|--------|------|
| `--color-primary` | #6366f1 | #818cf8 | 主色（靛蓝） |
| `--color-primary-hover` | #4f46e5 | #6366f1 | 悬停状态 |
| `--color-primary-light` | #e0e7ff | #312e81 | 浅色变体 |

### 背景色

| 令牌 | 亮色值 | 暗色值 |
|------|--------|--------|
| `--color-bg` | #ffffff | #0f172a |
| `--color-bg-secondary` | #f8fafc | #1e293b |
| `--color-bg-tertiary` | #f1f5f9 | #334155 |

### 文字色

| 令牌 | 亮色值 | 暗色值 |
|------|--------|--------|
| `--color-text` | #0f172a | #f1f5f9 |
| `--color-text-secondary` | #475569 | #94a3b8 |
| `--color-text-tertiary` | #94a3b8 | #64748b |
| `--color-text-inverse` | #ffffff | #0f172a |

### 状态色

| 令牌 | 值 | 说明 |
|------|------|------|
| `--color-success` | #22c55e | 成功 |
| `--color-warning` | #f59e0b | 警告 |
| `--color-error` | #ef4444 | 错误 |
| `--color-info` | #3b82f6 | 信息 |

## 排版

- **字体族**: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif
- **等宽字体**: JetBrains Mono, Fira Code, monospace

### 字号

| 令牌 | 值 |
|------|------|
| `--text-xs` | 0.75rem |
| `--text-sm` | 0.875rem |
| `--text-base` | 1rem |
| `--text-lg` | 1.125rem |
| `--text-xl` | 1.25rem |
| `--text-2xl` | 1.5rem |
| `--text-3xl` | 1.875rem |

## 间距

使用 4px 基准的间距系统: `--space-1` (4px) 到 `--space-16` (64px)。

## 圆角

| 令牌 | 值 |
|------|------|
| `--radius-sm` | 0.25rem |
| `--radius-md` | 0.5rem |
| `--radius-lg` | 0.75rem |
| `--radius-xl` | 1rem |
| `--radius-full` | 9999px |

## 暗色模式

通过 `[data-theme="dark"]` 选择器覆盖亮色令牌值。前端实现需要:

1. 在 `<html>` 元素上设置 `data-theme` 属性
2. 将用户偏好保存到 `localStorage`

## 样式文件

| 文件 | 说明 |
|------|------|
| `spec/styles/tokens.css` | 设计令牌（颜色、排版、间距等） |
| `spec/styles/base.css` | CSS 重置和基础样式 |
| `spec/styles/components.css` | 共享组件样式（按钮、卡片、输入框等） |
| `spec/styles/layout.css` | 布局工具类（flex、grid、间距等） |
