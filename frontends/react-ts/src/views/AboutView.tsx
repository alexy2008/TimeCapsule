import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AboutView.module.css'
import { getHealthInfo } from '@/api'
import type { TechStack } from '@/types'

export default function AboutView() {
  const navigate = useNavigate()
  const clickCount = useRef(0)
  const [techStack, setTechStack] = useState<TechStack | null>(null)

  useEffect(() => {
    getHealthInfo()
      .then(response => setTechStack(response.data.techStack))
      .catch(() => {
        // 如果获取失败，使用默认值
        setTechStack({
          framework: 'Unknown',
          language: 'Unknown',
          database: 'Unknown'
        })
      })
  }, [])

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
            <li><strong>后端:</strong> {techStack ? techStack.framework : '加载中...'}</li>
            <li><strong>语言:</strong> {techStack ? techStack.language : '加载中...'}</li>
            <li><strong>数据库:</strong> {techStack ? techStack.database : '加载中...'}</li>
            <li><strong>样式:</strong> 共享 CSS Design Tokens</li>
          </ul>
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
