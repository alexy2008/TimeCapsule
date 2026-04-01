/**
 * 胶囊 Hook
 * 封装时间胶囊的核心业务逻辑：创建、查询
 */
import { useState, useCallback } from 'react'
import type { Capsule, CreateCapsuleForm } from '@/types'
import { createCapsule as apiCreate, getCapsule as apiGet } from '@/api'

export function useCapsule() {
  const [capsule, setCapsule] = useState<Capsule | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (form: CreateCapsuleForm) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiCreate(form)
      setCapsule(res.data)
      return res.data
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '创建失败'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback(async (code: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiGet(code)
      setCapsule(res.data)
      return res.data
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '查询失败'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setCapsule(null)
    setError(null)
  }, [])

  return { capsule, loading, error, create, get, clear }
}
