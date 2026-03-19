/**
 * 数据库配置
 * 使用 Bun 内置 SQLite 驱动
 */
import { Database } from "bun:sqlite";
import { DATABASE_URL } from "./config";

// 创建数据库连接
const db = new Database(DATABASE_URL);

// 启用 WAL 模式以提高性能
db.run("PRAGMA journal_mode = WAL");

// 初始化表结构
db.run(`
  CREATE TABLE IF NOT EXISTS capsules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(8) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    creator VARCHAR(30) NOT NULL,
    open_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL
  )
`);

// 创建索引
db.run("CREATE INDEX IF NOT EXISTS idx_capsules_code ON capsules(code)");
db.run("CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON capsules(created_at)");

export default db;

/**
 * Capsule 数据库操作
 */
export interface CapsuleRow {
  id: number;
  code: string;
  title: string;
  content: string;
  creator: string;
  open_at: string;
  created_at: string;
}

export const CapsuleModel = {
  /**
   * 根据 code 查询胶囊
   */
  findByCode(code: string): CapsuleRow | null {
    return db.query<CapsuleRow, [string]>("SELECT * FROM capsules WHERE code = ?").get(code);
  },

  /**
   * 检查 code 是否存在
   */
  codeExists(code: string): boolean {
    const result = db.query<{ count: number }, [string]>(
      "SELECT COUNT(*) as count FROM capsules WHERE code = ?"
    ).get(code);
    return result ? result.count > 0 : false;
  },

  /**
   * 创建胶囊
   */
  create(capsule: Omit<CapsuleRow, "id">): CapsuleRow {
    const stmt = db.prepare(`
      INSERT INTO capsules (code, title, content, creator, open_at, created_at)
      VALUES ($code, $title, $content, $creator, $open_at, $created_at)
    `);
    stmt.run({
      $code: capsule.code,
      $title: capsule.title,
      $content: capsule.content,
      $creator: capsule.creator,
      $open_at: capsule.open_at,
      $created_at: capsule.created_at,
    });
    return this.findByCode(capsule.code)!;
  },

  /**
   * 分页查询胶囊列表
   */
  findAll(page: number, size: number): { content: CapsuleRow[]; total: number } {
    const countResult = db.query<{ count: number }, []>(
      "SELECT COUNT(*) as count FROM capsules"
    ).get();
    const total = countResult?.count || 0;

    const content = db.query<CapsuleRow, [number, number]>(
      "SELECT * FROM capsules ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).all(size, page * size);

    return { content, total };
  },

  /**
   * 删除胶囊
   */
  deleteByCode(code: string): boolean {
    const result = db.query("DELETE FROM capsules WHERE code = ?").run(code);
    return result.changes > 0;
  },
};
