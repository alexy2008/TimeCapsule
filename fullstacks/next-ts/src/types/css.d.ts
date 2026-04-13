// CSS 模块类型声明 — 兼容 TS 6.0 的副作用导入
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
