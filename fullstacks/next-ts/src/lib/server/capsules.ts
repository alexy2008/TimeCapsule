import { db } from './db'
import type { Capsule } from '@/types'

interface CapsuleRow {
  id: number
  code: string
  title: string
  content: string
  creator: string
  open_at: string
  created_at: string
}

const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function generateCode() {
  let code = ''
  for (let i = 0; i < 8; i += 1) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return code
}

export function createUniqueCapsuleCode(): string {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateCode()
    const existing = db.prepare('SELECT 1 FROM capsules WHERE code = ?').get(code) as { 1: number } | undefined
    if (!existing) {
      return code
    }
  }

  throw new Error('胶囊码生成失败，请稍后重试')
}

function toCapsule(row: CapsuleRow, now = Date.now()): Capsule {
  const opened = new Date(row.open_at).getTime() <= now

  return {
    code: row.code,
    title: row.title,
    content: opened ? row.content : null,
    creator: row.creator,
    openAt: row.open_at,
    createdAt: row.created_at,
    opened,
  }
}

export function insertCapsule(input: { title: string; content: string; creator: string; openAt: string }): Capsule {
  const code = createUniqueCapsuleCode()
  const createdAt = new Date().toISOString()

  db.prepare(`
    INSERT INTO capsules (code, title, content, creator, open_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(code, input.title, input.content, input.creator, input.openAt, createdAt)

  return {
    code,
    title: input.title,
    content: input.content,
    creator: input.creator,
    openAt: input.openAt,
    createdAt,
    opened: false,
  }
}

export function findCapsuleByCode(code: string): Capsule | null {
  const row = db.prepare(`
    SELECT id, code, title, content, creator, open_at, created_at
    FROM capsules
    WHERE code = ?
  `).get(code) as CapsuleRow | undefined

  return row ? toCapsule(row) : null
}

export function listCapsules(page: number, size: number) {
  const safePage = Math.max(0, page)
  const safeSize = Math.min(Math.max(1, size), 100)
  const offset = safePage * safeSize
  const now = Date.now()

  const totalRow = db.prepare('SELECT COUNT(*) as count FROM capsules').get() as { count: number }
  const rows = db.prepare(`
    SELECT id, code, title, content, creator, open_at, created_at
    FROM capsules
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(safeSize, offset) as CapsuleRow[]

  const totalElements = totalRow.count
  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / safeSize)

  return {
    content: rows.map(row => toCapsule(row, now)),
    totalElements,
    totalPages,
    number: safePage,
    size: safeSize,
  }
}

export function removeCapsuleByCode(code: string): boolean {
  const result = db.prepare('DELETE FROM capsules WHERE code = ?').run(code)
  return result.changes > 0
}
