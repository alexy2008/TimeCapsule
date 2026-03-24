import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AboutView.module.css'
import { useTechStack } from '@/hooks/useTechStack'

export default function AboutView() {
  const navigate = useNavigate()
  const clickCount = useRef(0)
  const { techStack, loading, error } = useTechStack()

  function handleSecretClick() {
    clickCount.current++
    if (clickCount.current >= 5) {
      clickCount.current = 0
      navigate('/admin')
    }
  }

  return (
    <div className="page">
      <div className="container container-sm">
        <div className="page-header">
          <h1>关于时间胶囊</h1>
          <p>一个技术展示项目</p>
        </div>

        <div className="card mb-6">
          <h3 className="mb-4">项目简介</h3>
          <p className="text-secondary">
            时间胶囊 (HelloTime) 是一个类似 RealWorld 的技术展示应用。
            通过统一的 API 规范和可复用的前端样式，展示不同前后端技术栈的组合能力。
          </p>
        </div>

        <div className="card mb-6">
          <h3 className="mb-4">当前技术栈</h3>
          <ul className={styles.techList}>
            <li><strong>前端:</strong> React 19 + TypeScript (Vite)</li>
            <li><strong>后端:</strong> {loading ? '加载中...' : techStack?.framework ?? '技术栈信息暂不可用'}</li>
            <li><strong>语言:</strong> {loading ? '加载中...' : techStack?.language ?? '技术栈信息暂不可用'}</li>
            <li><strong>数据库:</strong> {loading ? '加载中...' : techStack?.database ?? '技术栈信息暂不可用'}</li>
            <li><strong>样式:</strong> 共享 CSS Design Tokens</li>
          </ul>
          {error ? <p className="text-sm text-secondary mt-4">当前无法获取服务端技术栈详情。</p> : null}
        </div>

        <div className="card">
          <h3 className="mb-4">设计理念</h3>
          <ul className={styles.techList}>
            <li>统一的 REST API 规范 (OpenAPI 3.0)</li>
            <li>可复用的前端样式系统 (CSS 自定义属性)</li>
            <li>支持亮色/暗色主题</li>
            <li>前后端分离，可自由组合技术栈</li>
          </ul>
        </div>

        <p className="text-center text-sm text-tertiary mt-8" onClick={handleSecretClick}>
          HelloTime v1.0.0
        </p>
      </div>
    </div>
  )
}
