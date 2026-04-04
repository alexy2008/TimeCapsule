import Database from 'better-sqlite3'
import { DATABASE_PATH } from './config'

declare global {
  // 开发模式下模块可能被重复加载，把数据库实例挂到 globalThis 可以避免反复建连。
  // eslint-disable-next-line no-var
  var __hellotimeNextDb: Database.Database | undefined
}

function createDatabase() {
  const db = new Database(DATABASE_PATH)
  // WAL 对这种读多写少的 demo 更友好，也更接近现代 SQLite 的常见配置。
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS capsules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      creator TEXT NOT NULL,
      open_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_capsules_code ON capsules(code);
    CREATE INDEX IF NOT EXISTS idx_capsules_open_at ON capsules(open_at);
    CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON capsules(created_at);
  `)

  return db
}

export const db = globalThis.__hellotimeNextDb || createDatabase()

if (!globalThis.__hellotimeNextDb) {
  globalThis.__hellotimeNextDb = db
}
