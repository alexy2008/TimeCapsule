import Database from 'better-sqlite3'
import { DATABASE_PATH } from './config'

declare global {
  // eslint-disable-next-line no-var
  var __hellotimeNextDb: Database.Database | undefined
}

function createDatabase() {
  const db = new Database(DATABASE_PATH)
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
