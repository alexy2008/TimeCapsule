/**
 * 胶囊服务测试
 */
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { Database } from "bun:sqlite";
import {
  createCapsule,
  getCapsule,
  listCapsules,
  deleteCapsule,
  CapsuleNotFoundError,
  InvalidOpenAtError,
} from "../src/services/capsule";

// 测试数据库
let testDb: Database;

// 模拟数据库
const originalDb = require("../src/database").default;

beforeAll(() => {
  // 创建内存数据库
  testDb = new Database(":memory:");
  testDb.run(`
    CREATE TABLE capsules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code VARCHAR(8) NOT NULL UNIQUE,
      title VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      creator VARCHAR(30) NOT NULL,
      open_at DATETIME NOT NULL,
      created_at DATETIME NOT NULL
    )
  `);
});

afterAll(() => {
  testDb.close();
});

describe("胶囊服务", () => {
  test("创建胶囊 - 成功", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const request = {
      title: "测试胶囊",
      content: "这是测试内容",
      creator: "测试者",
      openAt: futureDate.toISOString(),
    };

    const result = createCapsule(request);

    expect(result.code).toHaveLength(8);
    expect(result.title).toBe("测试胶囊");
    expect(result.creator).toBe("测试者");
    expect(result.content).toBeNull(); // 创建时不返回内容
  });

  test("创建胶囊 - 开启时间在过去应失败", async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const request = {
      title: "测试胶囊",
      content: "这是测试内容",
      creator: "测试者",
      openAt: pastDate.toISOString(),
    };

    expect(() => createCapsule(request)).toThrow(InvalidOpenAtError);
  });

  test("查询胶囊 - 不存在应抛出错误", async () => {
    expect(() => getCapsule("NOTEXIST")).toThrow(CapsuleNotFoundError);
  });

  test("删除胶囊 - 不存在应抛出错误", async () => {
    expect(() => deleteCapsule("NOTEXIST")).toThrow(CapsuleNotFoundError);
  });
});
