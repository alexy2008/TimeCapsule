import Database from 'better-sqlite3'
import { DATABASE_PATH } from './config'

declare global {
  // 利用全局单例避免 Nuxt 开发态热更新时重复创建数据库连接。
  var __hellotimeNuxtDb: Database.Database | undefined
}

function createDatabase() {
  const db = new Database(DATABASE_PATH)
  // 和 Next 版本一样启用 WAL，便于读者对照两套全栈实现的数据库初始化方式。
  db.pragma('journal_mode = WAL')
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
    CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON capsules(created_at);
  `)
  return db
}

export const db = globalThis.__hellotimeNuxtDb || createDatabase()

if (!globalThis.__hellotimeNuxtDb) {
  globalThis.__hellotimeNuxtDb = db
}
