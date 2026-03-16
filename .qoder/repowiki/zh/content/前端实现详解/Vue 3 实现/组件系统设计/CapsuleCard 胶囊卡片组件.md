# CapsuleCard 胶囊卡片组件

<cite>
**本文档引用的文件**
- [CapsuleCard.tsx](file://frontends/react-ts/src/components/CapsuleCard.tsx)
- [CapsuleCard.module.css](file://frontends/react-ts/src/components/CapsuleCard.module.css)
- [CapsuleCard.vue](file://frontends/vue3-ts/src/components/CapsuleCard.vue)
- [CapsuleCard.component.ts](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.ts)
- [CapsuleCard.component.html](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.html)
- [CapsuleCard.component.css](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.css)
- [CountdownClock.tsx](file://frontends/react-ts/src/components/CountdownClock.tsx)
- [CountdownClock.vue](file://frontends/vue3-ts/src/components/CountdownClock.vue)
- [CountdownClock.component.ts](file://frontends/angular-ts/src/app/components/countdown-clock/countdown-clock.component.ts)
- [CountdownClock.component.html](file://frontends/angular-ts/src/app/components/countdown-clock/countdown-clock.component.html)
- [CountdownClock.component.css](file://frontends/angular-ts/src/app/components/countdown-clock/countdown-clock.component.css)
- [useCountdown.ts](file://frontends/react-ts/src/hooks/useCountdown.ts)
- [useCountdown.ts](file://frontends/vue3-ts/src/composables/useCountdown.ts)
- [index.ts](file://frontends/react-ts/src/types/index.ts)
- [tokens.css](file://spec/styles/tokens.css)
- [base.css](file://spec/styles/base.css)
- [capsule-card.component.spec.ts](file://frontends/angular-ts/src/__tests__/components/capsule-card.component.spec.ts)
- [CapsuleCard.test.ts](file://frontends/vue3-ts/src/__tests__/components/CapsuleCard.test.ts)
</cite>

## 目录
1. [简介](#简介)
2. [项目结构](#项目结构)
3. [核心组件](#核心组件)
4. [架构概览](#架构概览)
5. [详细组件分析](#详细组件分析)
6. [倒计时功能集成](#倒计时功能集成)
7. [依赖关系分析](#依赖关系分析)
8. [性能考虑](#性能考虑)
9. [故障排除指南](#故障排除指南)
10. [结论](#结论)
11. [附录](#附录)

## 简介

CapsuleCard 是 HelloTime 项目中的核心展示组件，用于呈现时间胶囊的信息和状态。该组件在三个前端框架中都有实现：React、Vue 3 和 Angular，确保了跨平台的一致性体验。

**更新** 该组件现已集成了强大的倒计时功能，通过CountdownClock组件提供实时的开启时间倒计时和过期事件处理机制。

该组件的主要功能包括：
- 展示胶囊的基本信息（标题、创建者、胶囊码）
- 显示胶囊的状态（已开启/未到时间）
- 计算并显示剩余开启时间
- 条件渲染内容展示和锁定状态
- 提供美观的视觉反馈和响应式布局
- **新增** 集成倒计时功能，实时显示剩余时间
- **新增** 过期事件处理机制，支持到期后的回调通知

## 项目结构

HelloTime 项目采用多框架架构，CapsuleCard 组件在不同框架中有相应的实现：

```mermaid
graph TB
subgraph "前端架构"
subgraph "React 实现"
ReactTSX[CapsuleCard.tsx]
ReactCSS[CapsuleCard.module.css]
CountdownClockTSX[CountdownClock.tsx]
CountdownHook[useCountdown.ts]
end
subgraph "Vue 3 实现"
VueTSX[CapsuleCard.vue]
VueCountdown[CountdownClock.vue]
VueComposable[useCountdown.ts]
end
subgraph "Angular 实现"
AngularTS[CapsuleCard.component.ts]
AngularHTML[CapsuleCard.component.html]
AngularCSS[CapsuleCard.component.css]
AngularCountdown[CountdownClockComponent]
end
subgraph "共享资源"
Types[index.ts 类型定义]
Tokens[tokens.css 设计令牌]
Base[base.css 基础样式]
end
end
ReactTSX --> Types
VueTSX --> Types
AngularTS --> Types
ReactTSX --> CountdownClockTSX
VueTSX --> VueCountdown
AngularTS --> AngularCountdown
ReactTSX --> CountdownHook
VueTSX --> VueComposable
AngularTS --> AngularCountdown
ReactCSS --> Tokens
VueTSX --> Tokens
AngularCSS --> Tokens
ReactTSX --> Base
VueTSX --> Base
AngularTS --> Base
```

**图表来源**
- [CapsuleCard.tsx:1-54](file://frontends/react-ts/src/components/CapsuleCard.tsx#L1-L54)
- [CapsuleCard.vue:1-89](file://frontends/vue3-ts/src/components/CapsuleCard.vue#L1-L89)
- [CapsuleCard.component.ts:1-27](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.ts#L1-L27)

**章节来源**
- [CapsuleCard.tsx:1-54](file://frontends/react-ts/src/components/CapsuleCard.tsx#L1-L54)
- [CapsuleCard.vue:1-89](file://frontends/vue3-ts/src/components/CapsuleCard.vue#L1-L89)
- [CapsuleCard.component.ts:1-27](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.ts#L1-L27)

## 核心组件

### Capsule 类型定义

CapsuleCard 组件的核心数据结构是 Capsule 接口，定义如下：

```mermaid
erDiagram
CAPSULE {
string code
string title
string content
string creator
string openAt
string createdAt
boolean opened
}
CAPSULE ||--|| CAPSULE_CARD : "使用"
```

**图表来源**
- [index.ts:10-18](file://frontends/react-ts/src/types/index.ts#L10-L18)

### 组件 Props 接口

每个框架的 CapsuleCard 组件都遵循相同的 Props 接口设计：

| 属性名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| capsule | Capsule | 是 | 胶囊数据对象，包含所有胶囊相关信息 |
| **新增** onExpired | () => void \| undefined | 否 | React版本的过期回调函数 |
| **新增** expired | EventEmitter\<void\> | 否 | Angular版本的过期事件发射器 |

**章节来源**
- [index.ts:10-18](file://frontends/react-ts/src/types/index.ts#L10-L18)
- [CapsuleCard.tsx:5-8](file://frontends/react-ts/src/components/CapsuleCard.tsx#L5-L8)
- [CapsuleCard.vue:36-42](file://frontends/vue3-ts/src/components/CapsuleCard.vue#L36-L42)
- [CapsuleCard.component.ts:12-14](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.ts#L12-L14)

## 架构概览

### 组件架构模式

三个框架实现了相似的组件架构模式，但采用了各自框架的最佳实践：

```mermaid
graph LR
subgraph "React 架构"
ReactComp[函数组件]
ReactMemo[useMemo 优化]
ReactStyles[模块化 CSS]
ReactCountdown[CountdownClock 组件]
ReactHook[useCountdown Hook]
end
subgraph "Vue 3 架构"
VueComp[组合式 API]
VueComputed[computed 属性]
VueScoped[作用域样式]
VueCountdown[CountdownClock 组件]
VueComposable[useCountdown 组合式函数]
end
subgraph "Angular 架构"
AngularComp[类组件]
AngularGetter[getter 计算]
AngularInline[内联模板]
AngularCountdown[CountdownClockComponent]
AngularSignal[信号系统]
end
ReactComp --> ReactMemo
VueComp --> VueComputed
AngularComp --> AngularGetter
ReactMemo --> ReactStyles
VueComputed --> VueScoped
AngularGetter --> AngularInline
ReactComp --> ReactCountdown
VueComp --> VueCountdown
AngularComp --> AngularCountdown
ReactCountdown --> ReactHook
VueCountdown --> VueComposable
AngularCountdown --> AngularSignal
```

**图表来源**
- [CapsuleCard.tsx:19-31](file://frontends/react-ts/src/components/CapsuleCard.tsx#L19-L31)
- [CapsuleCard.vue:50-61](file://frontends/vue3-ts/src/components/CapsuleCard.vue#L50-L61)
- [CapsuleCard.component.ts:24-35](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.ts#L24-L35)

## 详细组件分析

### React 实现分析

#### 组件结构
React 版本使用函数组件配合 useMemo 进行性能优化，并集成了CountdownClock组件：

```mermaid
classDiagram
class CapsuleCard {
+Props props
+formatTime(iso : string) string
+timeRemaining string
}
class Props {
+Capsule capsule
+onExpired? : () => void
}
class Capsule {
+string code
+string title
+string content
+string creator
+string openAt
+string createdAt
+boolean opened
}
class CountdownClock {
+Props props
+useCountdown hook
+expired事件处理
}
CapsuleCard --> Props : "接收"
Props --> Capsule : "包含"
CapsuleCard --> CountdownClock : "集成"
```

**图表来源**
- [CapsuleCard.tsx:19-31](file://frontends/react-ts/src/components/CapsuleCard.tsx#L19-L31)
- [index.ts:10-18](file://frontends/react-ts/src/types/index.ts#L10-L18)
- [CountdownClock.tsx:14-21](file://frontends/react-ts/src/components/CountdownClock.tsx#L14-L21)

#### 时间计算逻辑
React 实现使用 useMemo 进行缓存优化：

```mermaid
flowchart TD
Start([开始计算]) --> GetDiff["计算时间差<br/>openAt - 当前时间"]
GetDiff --> CheckDiff{"时间差 <= 0?"}
CheckDiff --> |是| ReturnOpen["返回 '即将开启'"]
CheckDiff --> |否| CalcDays["计算天数<br/>diff / 86400000"]
CalcDays --> CalcHours["计算小时<br/>(diff % 86400000) / 3600000"]
CalcHours --> CalcMinutes["计算分钟<br/>(diff % 3600000) / 60000"]
CalcMinutes --> BuildParts["构建时间片段数组"]
BuildParts --> CheckDays{"天数 > 0?"}
CheckDays --> |是| AddDays["添加 '天' 片段"]
CheckDays --> |否| CheckHours
AddDays --> CheckHours["小时 > 0?"]
CheckHours --> |是| AddHours["添加 '小时' 片段"]
CheckHours --> |否| CheckMinutes
AddHours --> CheckMinutes["分钟 > 0?"]
CheckMinutes --> |是| AddMinutes["添加 '分钟' 片段"]
CheckMinutes --> |否| ReturnResult
AddMinutes --> ReturnResult["返回 '还剩 X 天 Y 小时 Z 分钟'"]
ReturnOpen --> End([结束])
ReturnResult --> End
```

**图表来源**
- [CapsuleCard.tsx:20-31](file://frontends/react-ts/src/components/CapsuleCard.tsx#L20-L31)

**章节来源**
- [CapsuleCard.tsx:19-54](file://frontends/react-ts/src/components/CapsuleCard.tsx#L19-L54)

### Vue 3 实现分析

#### 组合式 API 使用
Vue 3 版本采用组合式 API 的现代开发方式，并集成了CountdownClock组件：

```mermaid
sequenceDiagram
participant Comp as 组件实例
participant Computed as computed 属性
participant Countdown as CountdownClock组件
participant DOM as 视图更新
Comp->>Computed : 访问 timeRemaining
Computed->>Computed : 计算时间差
Computed->>Computed : 格式化时间字符串
Computed-->>DOM : 返回格式化结果
DOM-->>Countdown : 触发expired事件
Countdown-->>Comp : 事件冒泡
Comp-->>DOM : 更新视图
```

**图表来源**
- [CapsuleCard.vue:50-61](file://frontends/vue3-ts/src/components/CapsuleCard.vue#L50-L61)
- [CountdownClock.vue:37-41](file://frontends/vue3-ts/src/components/CountdownClock.vue#L37-L41)

**章节来源**
- [CapsuleCard.vue:1-89](file://frontends/vue3-ts/src/components/CapsuleCard.vue#L1-L89)

### Angular 实现分析

#### 类组件模式
Angular 版本使用传统的类组件模式，并集成了CountdownClockComponent：

```mermaid
classDiagram
class CapsuleCardComponent {
+Capsule capsule
+formatTime(iso : string) string
+expired EventEmitter
}
class Capsule {
+string code
+string title
+string content
+string creator
+string openAt
+string createdAt
+boolean opened
}
class CountdownClockComponent {
+string targetIso
+expired EventEmitter
+signals 系统
}
CapsuleCardComponent --> Capsule : "包含"
CapsuleCardComponent --> CountdownClockComponent : "集成"
```

**图表来源**
- [CapsuleCard.component.ts:11-36](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.ts#L11-L36)
- [CountdownClock.component.ts:14-66](file://frontends/angular-ts/src/app/components/countdown-clock/countdown-clock.component.ts#L14-L66)

**章节来源**
- [CapsuleCard.component.ts:1-27](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.ts#L1-L27)

### 条件渲染机制

组件实现了智能的条件渲染逻辑，根据胶囊状态动态显示内容：

```mermaid
flowchart TD
Start([组件渲染]) --> CheckOpened{"capsule.opened?"}
CheckOpened --> |是| CheckContent{"capsule.content?"}
CheckContent --> |是| ShowContent["显示内容区域"]
CheckContent --> |否| ShowLocked["显示锁定状态"]
CheckOpened --> |否| ShowLocked
ShowContent --> End([完成])
ShowLocked --> End
```

**图表来源**
- [CapsuleCard.tsx:52-62](file://frontends/react-ts/src/components/CapsuleCard.tsx#L52-L62)
- [CapsuleCard.vue:20-28](file://frontends/vue3-ts/src/components/CapsuleCard.vue#L20-L28)
- [CapsuleCard.component.html:19-30](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.html#19-L30)

**章节来源**
- [CapsuleCard.tsx:52-62](file://frontends/react-ts/src/components/CapsuleCard.tsx#L52-L62)
- [CapsuleCard.vue:20-28](file://frontends/vue3-ts/src/components/CapsuleCard.vue#L20-L28)
- [CapsuleCard.component.html:19-30](file://frontends/angular-ts/src/app/components/capsule-card/capsule-card.component.html#L19-L30)

## 倒计时功能集成

### CountdownClock 组件架构

CountdownClock 组件是 CapsuleCard 的重要组成部分，提供了实时的倒计时功能：

```mermaid
graph TB
subgraph "CountdownClock 架构"
CountdownClockTSX[React CountdownClock]
CountdownClockVue[Vue CountdownClock]
CountdownClockAngular[Angular CountdownClockComponent]
end
subgraph "共享逻辑"
useCountdownHook[React useCountdown Hook]
useCountdownComposable[Vue useCountdown Composable]
CountdownLogic[通用倒计时逻辑]
end
subgraph "事件处理"
ExpiredEvent[expired 事件]
DelayTimer[3秒延迟定时器]
CallbackHandler[回调处理器]
end
CountdownClockTSX --> useCountdownHook
CountdownClockVue --> useCountdownComposable
CountdownClockAngular --> CountdownLogic
useCountdownHook --> CountdownLogic
useCountdownComposable --> CountdownLogic
CountdownClockTSX --> ExpiredEvent
CountdownClockVue --> ExpiredEvent
CountdownClockAngular --> ExpiredEvent
ExpiredEvent --> DelayTimer
DelayTimer --> CallbackHandler
```

**图表来源**
- [CountdownClock.tsx:14-21](file://frontends/react-ts/src/components/CountdownClock.tsx#L14-L21)
- [CountdownClock.vue:33-41](file://frontends/vue3-ts/src/components/CountdownClock.vue#L33-L41)
- [CountdownClock.component.ts:44-61](file://frontends/angular-ts/src/app/components/countdown-clock/countdown-clock.component.ts#L44-L61)

### 过期事件处理机制

CountdownClock 组件实现了智能的过期事件处理机制：

```mermaid
sequenceDiagram
participant Timer as 定时器
participant Countdown as 倒计时逻辑
participant Event as 事件系统
participant Parent as 父组件
Timer->>Countdown : 每秒检查
Countdown->>Countdown : 计算剩余时间
Countdown->>Countdown : 检查是否过期
Countdown->>Event : 设置过期标志
Event->>Event : 启动3秒延迟定时器
Event->>Parent : 触发expired事件
Parent->>Parent : 执行回调函数
```

**图表来源**
- [CountdownClock.tsx:17-21](file://frontends/react-ts/src/components/CountdownClock.tsx#L17-L21)
- [CountdownClock.vue:37-41](file://frontends/vue3-ts/src/components/CountdownClock.vue#L37-L41)
- [CountdownClock.component.ts:49-53](file://frontends/angular-ts/src/app/components/countdown-clock/countdown-clock.component.ts#L49-L53)

### 倒计时逻辑实现

#### React 实现
React 版本使用自定义 Hook 管理倒计时状态：

```mermaid
flowchart TD
Init([初始化]) --> Calc["计算初始时间差"]
Calc --> CheckExpired{"是否已过期?"}
CheckExpired --> |是| SetExpired["设置过期状态"]
CheckExpired --> |否| StartTimer["启动定时器"]
StartTimer --> Tick["每秒执行"]
Tick --> CalcNext["计算下一次时间差"]
CalcNext --> CheckNext{"是否已过期?"}
CheckNext --> |是| ClearTimer["清理定时器"]
CheckNext --> |否| UpdateState["更新状态"]
UpdateState --> Tick
SetExpired --> End([结束])
ClearTimer --> End
```

**图表来源**
- [useCountdown.ts:11-37](file://frontends/react-ts/src/hooks/useCountdown.ts#L11-L37)

#### Vue 3 实现
Vue 3 版本使用组合式函数管理响应式倒计时：

```mermaid
flowchart TD
Init([初始化]) --> Calc["计算初始时间差"]
Calc --> CheckExpired{"是否已过期?"}
CheckExpired --> |是| SetExpired["设置过期状态"]
CheckExpired --> |否| StartTimer["启动定时器"]
StartTimer --> Tick["每秒执行"]
Tick --> CalcNext["计算下一次时间差"]
CalcNext --> CheckNext{"是否已过期?"}
CheckNext --> |是| ClearTimer["清理定时器"]
CheckNext --> |否| UpdateState["更新响应式状态"]
UpdateState --> Tick
SetExpired --> End([结束])
ClearTimer --> End
```

**图表来源**
- [useCountdown.ts:11-35](file://frontends/vue3-ts/src/composables/useCountdown.ts#L11-L35)

#### Angular 实现
Angular 版本使用信号系统管理倒计时状态：

```mermaid
flowchart TD
Init([初始化]) --> Calc["计算初始时间差"]
Calc --> CheckExpired{"是否已过期?"}
CheckExpired --> |是| SetExpired["设置过期信号"]
CheckExpired --> |否| StartTimer["启动定时器"]
StartTimer --> Tick["每秒执行"]
Tick --> CalcNext["计算下一次时间差"]
CalcNext --> CheckNext{"是否已过期?"}
CheckNext --> |是| ClearTimer["清理定时器"]
CheckNext --> |否| UpdateSignals["更新信号状态"]
UpdateSignals --> Tick
SetExpired --> End([结束])
ClearTimer --> End
```

**图表来源**
- [CountdownClock.component.ts:44-61](file://frontends/angular-ts/src/app/components/countdown-clock/countdown-clock.component.ts#L44-L61)

**章节来源**
- [CountdownClock.tsx:1-58](file://frontends/react-ts/src/components/CountdownClock.tsx#L1-L58)
- [CountdownClock.vue:1-167](file://frontends/vue3-ts/src/components/CountdownClock.vue#L1-L167)
- [CountdownClock.component.ts:1-67](file://frontends/angular-ts/src/app/components/countdown-clock/countdown-clock.component.ts#L1-L67)

## 依赖关系分析

### 样式系统依赖

组件样式系统基于 CSS 变量和设计令牌：

```mermaid
graph TB
subgraph "设计系统"
Tokens[tokens.css<br/>设计令牌]
Base[base.css<br/>基础样式]
end
subgraph "组件样式"
ReactCSS[CapsuleCard.module.css]
VueCSS[Vue 作用域样式]
AngularCSS[内联样式]
CountdownCSS[CountdownClock 样式]
end
Tokens --> ReactCSS
Tokens --> VueCSS
Tokens --> AngularCSS
Tokens --> CountdownCSS
Base --> ReactCSS
Base --> VueCSS
Base --> AngularCSS
Base --> CountdownCSS
```

**图表来源**
- [tokens.css:1-104](file://spec/styles/tokens.css#L1-L104)
- [base.css:1-67](file://spec/styles/base.css#L1-L67)
- [CapsuleCard.module.css:1-33](file://frontends/react-ts/src/components/CapsuleCard.module.css#L1-L33)
- [CountdownClock.component.css:1-111](file://frontends/angular-ts/src/app/components/countdown-clock/countdown-clock.component.css#L1-L111)

### 类型系统依赖

所有实现都严格依赖共享的 TypeScript 类型定义：

```mermaid
classDiagram
class Capsule {
+string code
+string title
+string content
+string creator
+string openAt
+string createdAt
+boolean opened
}
class CapsuleCardComponent {
+Capsule capsule
+onExpired? : () => void
}
class CountdownTime {
+days : number
+hours : number
+minutes : number
+seconds : number
+expired : boolean
}
CapsuleCardComponent --> Capsule : "使用"
CountdownClock --> CountdownTime : "使用"
```

**图表来源**
- [index.ts:10-18](file://frontends/react-ts/src/types/index.ts#L10-L18)

**章节来源**
- [index.ts:10-18](file://frontends/react-ts/src/types/index.ts#L10-L18)
- [CapsuleCard.module.css:1-33](file://frontends/react-ts/src/components/CapsuleCard.module.css#L1-L33)
- [tokens.css:1-104](file://spec/styles/tokens.css#L1-L104)

## 性能考虑

### React 优化策略

React 实现使用 useMemo 进行计算属性缓存，并集成了高效的倒计时机制：

- **memoization**: 使用 useMemo 避免重复的时间计算
- **依赖数组**: 仅在 openAt 改变时重新计算
- **函数组件**: 无状态组件减少内存开销
- **倒计时优化**: useCountdown Hook 使用定时器管理和状态更新
- **事件处理**: 3秒延迟避免频繁的过期事件触发

### Vue 3 优化策略

Vue 3 实现使用 computed 属性进行响应式缓存，并集成了组合式函数：

- **响应式缓存**: computed 自动追踪依赖变化
- **懒执行**: 仅在访问时计算
- **自动失效**: 依赖变化时自动重新计算
- **响应式倒计时**: useCountdown 组合式函数管理响应式状态
- **事件冒泡**: 通过事件系统实现父子组件通信

### Angular 优化策略

Angular 实现使用 getter 进行计算，并集成了信号系统：

- **简单缓存**: getter 在同一帧内缓存结果
- **依赖追踪**: Angular 变更检测系统管理更新时机
- **信号系统**: 使用 signal 和 computed 提供响应式状态管理
- **生命周期管理**: proper cleanup of timers and timeouts

## 故障排除指南

### 常见问题诊断

#### 时间显示异常
- **症状**: 时间显示不正确或显示负值
- **原因**: openAt 格式不正确或时区设置问题
- **解决方案**: 确保 openAt 使用 ISO 8601 格式

#### 内容不显示
- **症状**: 已开启的胶囊不显示内容
- **原因**: capsule.content 为空或未正确设置 opened 状态
- **解决方案**: 检查后端数据和 opened 状态同步

#### 倒计时不工作
- **症状**: 倒计时数字不更新或停止
- **原因**: 定时器未正确启动或组件卸载
- **解决方案**: 检查 useCountdown Hook 或组合式函数的生命周期管理

#### 过期事件未触发
- **症状**: 到期后没有触发回调或事件
- **原因**: 3秒延迟机制或事件处理逻辑问题
- **解决方案**: 验证 expired 事件的正确传递和处理

#### 样式问题
- **症状**: 组件样式错乱或不显示
- **原因**: CSS 变量未正确加载或样式类名错误
- **解决方案**: 确认 tokens.css 正常加载和类名匹配

**章节来源**
- [capsule-card.component.spec.ts:1-69](file://frontends/angular-ts/src/__tests__/components/capsule-card.component.spec.ts#L1-L69)
- [CapsuleCard.test.ts:1-41](file://frontends/vue3-ts/src/__tests__/components/CapsuleCard.test.ts#L1-L41)

## 结论

CapsuleCard 组件展现了现代前端开发的最佳实践，通过以下特点实现了高质量的用户体验：

1. **跨框架一致性**: 在 React、Vue 3 和 Angular 中提供相同的功能和外观
2. **性能优化**: 采用适当的缓存策略避免不必要的计算
3. **类型安全**: 完整的 TypeScript 类型定义确保开发时的类型安全
4. **样式系统**: 基于设计令牌的样式系统支持主题切换和响应式设计
5. **测试覆盖**: 完善的单元测试确保组件行为的可靠性
6. **** **新增** **倒计时功能**: 集成 CountdownClock 组件提供实时的开启时间倒计时
7. **** **新增** **事件处理**: 实现智能的过期事件处理机制，支持延迟触发和回调通知
8. **** **新增** **响应式设计**: 支持移动端和桌面端的自适应布局

该组件为 HelloTime 项目提供了坚实的基础，展示了如何在多框架环境中维护一致的用户体验，同时通过倒计时功能增强了用户交互体验。

## 附录

### 组件使用示例

#### React 使用方式
```typescript
// 基本用法
<CapsuleCard capsule={capsuleData} />

// 带过期回调
<CapsuleCard 
  capsule={capsuleData} 
  onExpired={() => console.log('胶囊已到期')} 
/>

// 在列表中使用
{capsules.map(capsule => (
  <CapsuleCard 
    key={capsule.code} 
    capsule={capsule} 
    onExpired={() => handleExpired(capsule.code)}
  />
))}
```

#### Vue 3 使用方式
```vue
<!-- 基本用法 -->
<CapsuleCard :capsule="capsuleData" />

<!-- 带过期事件处理 -->
<CapsuleCard 
  :capsule="capsuleData" 
  @expired="handleExpired" 
/>

<!-- 在列表中使用 -->
<template>
  <CapsuleCard 
    v-for="capsule in capsules" 
    :key="capsule.code" 
    :capsule="capsule" 
    @expired="handleExpired"
  />
</template>
```

#### Angular 使用方式
```html
<!-- 基本用法 -->
<app-capsule-card [capsule]="capsuleData"></app-capsule-card>

<!-- 带过期事件处理 -->
<app-capsule-card 
  [capsule]="capsuleData" 
  (expired)="handleExpired()">
</app-capsule-card>

<!-- 在列表中使用 -->
<app-capsule-card 
  *ngFor="let capsule of capsules" 
  [capsule]="capsule" 
  (expired)="handleExpired(capsule.code)">
</app-capsule-card>
```

### 最佳实践建议

1. **数据验证**: 在传递给组件之前验证 Capsule 数据的完整性
2. **错误处理**: 为网络请求失败的情况提供降级方案
3. **性能监控**: 监控组件的渲染性能，必要时添加更多的缓存层
4. **可访问性**: 确保组件对屏幕阅读器友好
5. **国际化**: 考虑支持多语言的时间格式化
6. **** **新增** **倒计时优化**: 合理使用倒计时功能，避免过度频繁的更新
7. **** **新增** **事件处理**: 在父组件中正确处理过期事件，避免内存泄漏
8. **** **新增** **延迟机制**: 理解3秒延迟机制的作用，合理利用其提供的用户体验优势