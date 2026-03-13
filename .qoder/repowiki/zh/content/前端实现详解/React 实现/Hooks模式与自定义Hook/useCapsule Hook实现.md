# useCapsule Hook实现

<cite>
**本文档引用的文件**
- [useCapsule.ts (React)](file://frontends/react-ts/src/hooks/useCapsule.ts)
- [useCapsule.ts (Vue3)](file://frontends/vue3-ts/src/composables/useCapsule.ts)
- [index.ts (React API)](file://frontends/react-ts/src/api/index.ts)
- [index.ts (Vue3 API)](file://frontends/vue3-ts/src/api/index.ts)
- [index.ts (类型定义)](file://frontends/react-ts/src/types/index.ts)
- [useCapsule.test.ts (React)](file://frontends/react-ts/src/__tests__/hooks/useCapsule.test.ts)
- [useCapsule.test.ts (Vue3)](file://frontends/vue3-ts/src/__tests__/composables/useCapsule.test.ts)
</cite>

## 目录
1. [简介](#简介)
2. [项目结构](#项目结构)
3. [核心组件](#核心组件)
4. [架构概览](#架构概览)
5. [详细组件分析](#详细组件分析)
6. [依赖关系分析](#依赖关系分析)
7. [性能考虑](#性能考虑)
8. [故障排除指南](#故障排除指南)
9. [结论](#结论)
10. [附录](#附录)

## 简介

useCapsule是一个跨框架的时间胶囊业务逻辑封装Hook，负责处理时间胶囊的创建和查询功能。该Hook提供了统一的状态管理机制，包括胶囊数据状态、加载状态和错误状态，并通过API层与后端服务进行交互。

该实现支持React和Vue3两种前端框架，采用相同的业务逻辑但不同的状态管理模式：React版本使用useState和useCallback，Vue3版本使用ref和响应式系统。

## 项目结构

时间胶囊相关的核心文件组织如下：

```mermaid
graph TB
subgraph "React前端"
ReactHooks[React Hooks<br/>hooks/useCapsule.ts]
ReactAPI[API客户端<br/>api/index.ts]
ReactTypes[类型定义<br/>types/index.ts]
ReactTests[测试文件<br/>__tests__/hooks/useCapsule.test.ts]
end
subgraph "Vue3前端"
VueComposables[Vue Composables<br/>composables/useCapsule.ts]
VueAPI[API客户端<br/>api/index.ts]
VueTypes[类型定义<br/>types/index.ts]
VueTests[测试文件<br/>__tests__/composables/useCapsule.test.ts]
end
subgraph "后端服务"
BackendAPI[后端API<br/>backends/spring-boot/controller/CapsuleController.java]
BackendService[业务服务<br/>backends/spring-boot/service/CapsuleService.java]
end
ReactHooks --> ReactAPI
VueComposables --> VueAPI
ReactAPI --> BackendAPI
VueAPI --> BackendAPI
ReactHooks --> ReactTypes
VueComposables --> VueTypes
ReactTests --> ReactHooks
VueTests --> VueComposables
```

**图表来源**
- [useCapsule.ts (React):1-48](file://frontends/react-ts/src/hooks/useCapsule.ts#L1-L48)
- [useCapsule.ts (Vue3):1-65](file://frontends/vue3-ts/src/composables/useCapsule.ts#L1-L65)
- [index.ts (React API):1-94](file://frontends/react-ts/src/api/index.ts#L1-L94)

**章节来源**
- [useCapsule.ts (React):1-48](file://frontends/react-ts/src/hooks/useCapsule.ts#L1-L48)
- [useCapsule.ts (Vue3):1-65](file://frontends/vue3-ts/src/composables/useCapsule.ts#L1-L65)
- [index.ts (React API):1-94](file://frontends/react-ts/src/api/index.ts#L1-L94)
- [index.ts (Vue3 API):1-120](file://frontends/vue3-ts/src/api/index.ts#L1-L120)

## 核心组件

### 状态管理设计

useCapsule实现了三态状态管理模式：

1. **capsule状态**：存储当前时间胶囊的数据，初始值为null
2. **loading状态**：表示异步操作的执行状态，初始值为false  
3. **error状态**：存储错误信息，初始值为null

这种设计确保了UI组件能够准确反映当前的操作状态和结果。

### 核心方法实现

#### create方法（创建时间胶囊）

create方法负责处理时间胶囊的创建流程：

```mermaid
sequenceDiagram
participant Component as 组件
participant Hook as useCapsule
participant API as API客户端
participant Backend as 后端服务
Component->>Hook : 调用create(form)
Hook->>Hook : 设置loading=true
Hook->>Hook : 清空error=null
Hook->>API : 调用createCapsule(form)
API->>Backend : POST /api/v1/capsules
Backend-->>API : 返回创建结果
API-->>Hook : 返回ApiResponse<Capsule>
Hook->>Hook : 更新capsule状态
Hook->>Hook : 设置loading=false
Hook-->>Component : 返回创建的胶囊数据
Note over Component,Hook : 异常情况
Hook->>Hook : 捕获错误并设置error
Hook->>Hook : 设置loading=false
Hook-->>Component : 抛出异常
```

**图表来源**
- [useCapsule.ts (React):14-28](file://frontends/react-ts/src/hooks/useCapsule.ts#L14-L28)
- [useCapsule.ts (Vue3):24-37](file://frontends/vue3-ts/src/composables/useCapsule.ts#L24-L37)

#### get方法（查询时间胶囊）

get方法负责处理时间胶囊的查询流程：

```mermaid
sequenceDiagram
participant Component as 组件
participant Hook as useCapsule
participant API as API客户端
participant Backend as 后端服务
Component->>Hook : 调用get(code)
Hook->>Hook : 设置loading=true
Hook->>Hook : 清空error=null
Hook->>API : 调用getCapsule(code)
API->>Backend : GET /api/v1/capsules/{code}
Backend-->>API : 返回查询结果
API-->>Hook : 返回ApiResponse<Capsule>
Hook->>Hook : 更新capsule状态
Hook->>Hook : 设置loading=false
Hook-->>Component : 返回查询的胶囊数据
Note over Component,Hook : 异常情况
Hook->>Hook : 捕获错误并设置error
Hook->>Hook : 设置loading=false
Hook-->>Component : 抛出异常
```

**图表来源**
- [useCapsule.ts (React):30-44](file://frontends/react-ts/src/hooks/useCapsule.ts#L30-L44)
- [useCapsule.ts (Vue3):47-60](file://frontends/vue3-ts/src/composables/useCapsule.ts#L47-L60)

**章节来源**
- [useCapsule.ts (React):9-47](file://frontends/react-ts/src/hooks/useCapsule.ts#L9-L47)
- [useCapsule.ts (Vue3):10-64](file://frontends/vue3-ts/src/composables/useCapsule.ts#L10-L64)

## 架构概览

### 数据流架构

```mermaid
flowchart TD
subgraph "用户界面层"
UIComponents[React/Vue组件]
end
subgraph "业务逻辑层"
useCapsule[useCapsule Hook/Composable]
StateManagement[状态管理]
end
subgraph "数据访问层"
APIClient[API客户端]
HTTPClient[fetch客户端]
end
subgraph "后端服务层"
CapsuleController[CapsuleController]
CapsuleService[CapsuleService]
Database[(数据库)]
end
UIComponents --> useCapsule
useCapsule --> StateManagement
useCapsule --> APIClient
APIClient --> HTTPClient
HTTPClient --> CapsuleController
CapsuleController --> CapsuleService
CapsuleService --> Database
Database --> CapsuleService
CapsuleService --> CapsuleController
CapsuleController --> HTTPClient
HTTPClient --> APIClient
APIClient --> useCapsule
useCapsule --> StateManagement
StateManagement --> UIComponents
```

**图表来源**
- [useCapsule.ts (React):1-48](file://frontends/react-ts/src/hooks/useCapsule.ts#L1-L48)
- [useCapsule.ts (Vue3):1-65](file://frontends/vue3-ts/src/composables/useCapsule.ts#L1-L65)
- [index.ts (React API):1-94](file://frontends/react-ts/src/api/index.ts#L1-L94)
- [index.ts (Vue3 API):1-120](file://frontends/vue3-ts/src/api/index.ts#L1-L120)

### 类型安全架构

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
class CreateCapsuleForm {
+string title
+string content
+string creator
+string openAt
}
class ApiResponse~T~ {
+boolean success
+T data
+string message
+string errorCode
}
class useCapsule {
+Capsule capsule
+boolean loading
+string error
+create(form) Promise~Capsule~
+get(code) Promise~Capsule~
}
useCapsule --> Capsule : manages
useCapsule --> CreateCapsuleForm : accepts
useCapsule --> ApiResponse : returns
```

**图表来源**
- [index.ts (类型定义):10-40](file://frontends/react-ts/src/types/index.ts#L10-L40)
- [useCapsule.ts (React):6-12](file://frontends/react-ts/src/hooks/useCapsule.ts#L6-L12)

**章节来源**
- [index.ts (类型定义):1-80](file://frontends/react-ts/src/types/index.ts#L1-L80)

## 详细组件分析

### React版本实现分析

#### 状态管理实现

React版本使用useState钩子实现本地状态管理：

```mermaid
stateDiagram-v2
[*] --> 初始状态
初始状态 --> 等待操作 : capsule=null, loading=false, error=null
等待操作 --> 创建中 : 调用create()
等待操作 --> 查询中 : 调用get()
创建中 --> 成功 : API调用成功
创建中 --> 失败 : API调用失败
查询中 --> 成功 : API调用成功
查询中 --> 失败 : API调用失败
成功 --> 等待操作 : 设置capsule数据
失败 --> 等待操作 : 设置错误信息
```

**图表来源**
- [useCapsule.ts (React):10-12](file://frontends/react-ts/src/hooks/useCapsule.ts#L10-L12)

#### useCallback优化策略

React版本使用useCallback对异步方法进行记忆化：

```mermaid
flowchart TD
A[首次渲染] --> B[create函数创建]
B --> C[useCallback缓存]
D[后续渲染] --> E[检查依赖数组]
E --> F{依赖是否变化?}
F --> |否| G[返回缓存的create函数]
F --> |是| H[重新创建create函数]
G --> I[组件重新渲染]
H --> I
I --> J[继续使用缓存函数]
```

**图表来源**
- [useCapsule.ts (React):14-28](file://frontends/react-ts/src/hooks/useCapsule.ts#L14-L28)

**章节来源**
- [useCapsule.ts (React):1-48](file://frontends/react-ts/src/hooks/useCapsule.ts#L1-L48)

### Vue3版本实现分析

#### 响应式状态管理

Vue3版本使用ref实现响应式状态管理：

```mermaid
stateDiagram-v2
[*] --> 初始状态
初始状态 --> 等待操作 : capsule=null, loading=false, error=null
等待操作 --> 创建中 : 调用create()
等待操作 --> 查询中 : 调用get()
创建中 --> 成功 : API调用成功
创建中 --> 失败 : API调用失败
查询中 --> 成功 : API调用成功
查询中 --> 失败 : API调用失败
成功 --> 等待操作 : capsule.value = data
失败 --> 等待操作 : error.value = errorMessage
```

**图表来源**
- [useCapsule.ts (Vue3):12-14](file://frontends/vue3-ts/src/composables/useCapsule.ts#L12-L14)

**章节来源**
- [useCapsule.ts (Vue3):1-65](file://frontends/vue3-ts/src/composables/useCapsule.ts#L1-L65)

### API调用封装分析

#### 统一请求处理

API客户端实现了统一的请求处理机制：

```mermaid
flowchart TD
A[调用createCapsule/getCapsule] --> B[request函数]
B --> C[fetch请求]
C --> D{响应状态}
D --> |HTTP 2xx| E[解析JSON数据]
D --> |其他状态| F[抛出错误]
E --> G{success标志}
G --> |true| H[返回data]
G --> |false| F
F --> I[错误处理]
```

**图表来源**
- [index.ts (React API):14-31](file://frontends/react-ts/src/api/index.ts#L14-L31)
- [index.ts (Vue3 API):19-37](file://frontends/vue3-ts/src/api/index.ts#L19-L37)

**章节来源**
- [index.ts (React API):1-94](file://frontends/react-ts/src/api/index.ts#L1-L94)
- [index.ts (Vue3 API):1-120](file://frontends/vue3-ts/src/api/index.ts#L1-L120)

## 依赖关系分析

### 组件耦合度分析

```mermaid
graph LR
subgraph "useCapsule Hook"
A[状态管理]
B[create方法]
C[get方法]
end
subgraph "外部依赖"
D[API客户端]
E[类型定义]
F[框架钩子]
end
subgraph "测试依赖"
G[Vitest测试框架]
H[Mock模拟]
end
A --> D
B --> D
C --> D
A --> E
B --> F
C --> F
D --> E
G --> A
G --> B
G --> C
H --> D
```

**图表来源**
- [useCapsule.ts (React):5-7](file://frontends/react-ts/src/hooks/useCapsule.ts#L5-L7)
- [useCapsule.ts (Vue3):6-8](file://frontends/vue3-ts/src/composables/useCapsule.ts#L6-L8)

### 依赖注入模式

Hook实现了简单的依赖注入模式，将API客户端作为外部依赖：

```mermaid
classDiagram
class useCapsule {
+capsule : Capsule | null
+loading : boolean
+error : string | null
+create(form) Promise~Capsule~
+get(code) Promise~Capsule~
}
class APIService {
+createCapsule(form) Promise~ApiResponse~$lt$Capsule$gt$
+getCapsule(code) Promise~ApiResponse~$lt$Capsule$gt$
}
class Types {
+Capsule
+CreateCapsuleForm
+ApiResponse
}
useCapsule --> APIService : depends on
useCapsule --> Types : uses
```

**图表来源**
- [useCapsule.ts (React):6-7](file://frontends/react-ts/src/hooks/useCapsule.ts#L6-L7)
- [useCapsule.ts (Vue3):7-8](file://frontends/vue3-ts/src/composables/useCapsule.ts#L7-L8)

**章节来源**
- [useCapsule.ts (React):1-48](file://frontends/react-ts/src/hooks/useCapsule.ts#L1-L48)
- [useCapsule.ts (Vue3):1-65](file://frontends/vue3-ts/src/composables/useCapsule.ts#L1-L65)

## 性能考虑

### 优化策略

1. **函数记忆化**：React版本使用useCallback避免不必要的函数重建
2. **状态最小化**：只维护必要的状态，减少重渲染
3. **错误边界**：统一的错误处理机制，防止应用崩溃
4. **类型安全**：完整的TypeScript类型定义，编译时错误检测

### 性能监控建议

- 使用React DevTools Profiler监控组件渲染性能
- 实现请求超时和重试机制
- 添加请求去重功能，避免重复请求
- 考虑实现缓存策略，减少重复API调用

## 故障排除指南

### 常见问题及解决方案

#### 状态更新问题

**问题**：状态没有正确更新
**解决方案**：
- 确保在finally块中重置loading状态
- 检查错误状态是否被正确设置
- 验证API响应格式是否符合预期

#### 异步操作问题

**问题**：异步操作没有正确处理
**解决方案**：
- 确保try-catch块正确捕获异常
- 在finally块中清理状态
- 检查Promise链的正确性

#### 类型安全问题

**问题**：TypeScript类型错误
**解决方案**：
- 确保API响应数据符合ApiResponse接口
- 验证CreateCapsuleForm字段完整性
- 检查可选字段的处理逻辑

**章节来源**
- [useCapsule.test.ts (React):1-89](file://frontends/react-ts/src/__tests__/hooks/useCapsule.test.ts#L1-L89)
- [useCapsule.test.ts (Vue3):1-68](file://frontends/vue3-ts/src/__tests__/composables/useCapsule.test.ts#L1-L68)

## 结论

useCapsule Hook实现了优雅的状态管理和API调用封装，具有以下优势：

1. **跨框架兼容**：同时支持React和Vue3，提供一致的开发体验
2. **类型安全**：完整的TypeScript类型定义，提供编译时安全保障
3. **状态管理**：清晰的三态状态模型，便于UI组件状态同步
4. **错误处理**：统一的错误处理机制，提升应用稳定性
5. **测试友好**：完善的单元测试覆盖，确保代码质量

该实现为时间胶囊功能提供了可靠的基础，可以作为复杂业务逻辑封装的最佳实践参考。

## 附录

### 实际使用示例

#### React组件使用示例

```typescript
// 在React组件中使用useCapsule
const MyComponent = () => {
  const { capsule, loading, error, create, get } = useCapsule();
  
  const handleCreate = async (formData) => {
    try {
      const newCapsule = await create(formData);
      // 处理创建成功
    } catch (err) {
      // 处理创建失败
    }
  };
  
  return (
    <div>
      {loading && <div>加载中...</div>}
      {error && <div>错误: {error}</div>}
      {capsule && <div>胶囊数据: {capsule.code}</div>}
    </div>
  );
};
```

#### Vue3组件使用示例

```typescript
// 在Vue3组件中使用useCapsule
const MyComponent = () => {
  const { capsule, loading, error, create, get } = useCapsule();
  
  const handleCreate = async (formData) => {
    try {
      const newCapsule = await create(formData);
      // 处理创建成功
    } catch (err) {
      // 处理创建失败
    }
  };
  
  return h('div', [
    loading.value && h('div', '加载中...'),
    error.value && h('div', `错误: ${error.value}`),
    capsule.value && h('div', `胶囊数据: ${capsule.value.code}`)
  ]);
};
```

### 最佳实践建议

1. **状态管理**：始终在finally块中重置loading状态
2. **错误处理**：提供有意义的错误消息和回退策略
3. **类型安全**：充分利用TypeScript类型系统
4. **测试覆盖**：为每个Hook实现编写单元测试
5. **性能优化**：合理使用useCallback等优化技巧
6. **API设计**：保持API接口的一致性和简洁性