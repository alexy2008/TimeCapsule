/**
 * Vue Router 路由配置
 * 定义应用的所有路由规则和视图组件映射
 */
import { createRouter, createWebHistory } from 'vue-router'

/**
 * 创建路由实例
 * 使用 HTML5 History 模式（需要服务器配置支持）
 */
const router = createRouter({
  history: createWebHistory(),  // History 模式，URL 不带 # 号
  routes: [
    {
      path: '/',                 // 首页路径
      name: 'home',              // 路由名称，用于编程式导航
      component: () => import('@/views/HomeView.vue'),  // 懒加载首页组件
    },
    {
      path: '/create',           // 创建胶囊页面
      name: 'create',
      component: () => import('@/views/CreateView.vue'),
    },
    {
      path: '/open/:code?',      // 打开/查看胶囊页面
      name: 'open',
      component: () => import('@/views/OpenView.vue'),
      // :code 是可选参数，支持 /open 和 /open/Ab3xK9mZ 两种形式
    },
    {
      path: '/about',            // 关于页面
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/admin',            // 管理员后台页面
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
    },
  ],
})

export default router
