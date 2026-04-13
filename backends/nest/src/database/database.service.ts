/**
 * 数据库服务 — 封装 node:sqlite 的同步 SQLite 连接
 *
 * 为什么用 node:sqlite（Node 22+ 内置）而非 better-sqlite3：
 * - 无需编译原生模块，安装零依赖
 * - 同步 API 与 NestJS 控制器的同步风格一致
 *
 * WAL 模式提升并发读性能，适合开发时多终端同时查询。
 */
import { Injectable } from '@nestjs/common';
import { DatabaseSync, StatementSync } from 'node:sqlite';
import { appConfig } from '../config/app.config';

@Injectable()
export class DatabaseService {
  private readonly db = new DatabaseSync(appConfig.databasePath);

  constructor() {
    this.db.exec('PRAGMA journal_mode = WAL');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS capsules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(8) NOT NULL UNIQUE,
        title VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        creator VARCHAR(30) NOT NULL,
        open_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_capsules_code ON capsules(code)');
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_capsules_created_at ON capsules(created_at)');
  }

  prepare(sql: string): StatementSync {
    return this.db.prepare(sql);
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }
}
