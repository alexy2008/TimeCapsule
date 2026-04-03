/**
 * 胶囊服务测试
 */
import { describe, test, expect, beforeAll, beforeEach, afterAll } from "bun:test";
import { Database } from "bun:sqlite";
import Elysia from "elysia";
import {
  createCapsule,
  getCapsule,
  deleteCapsule,
  CapsuleNotFoundError,
  InvalidOpenAtError,
} from "../src/services/capsule";
import { CapsuleModel, resetDatabase, setDatabase } from "../src/database";
import { capsuleRoutes } from "../src/routes/capsule";

const CODE_PATTERN = /^[A-Z0-9]{8}$/;

// 测试数据库
let testDb: Database;

beforeAll(() => {
  // 创建内存数据库
  testDb = new Database(":memory:");
  setDatabase(testDb);
});

beforeEach(() => {
  testDb.run("DELETE FROM capsules");
});

afterAll(() => {
  resetDatabase();
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
    expect(CODE_PATTERN.test(result.code)).toBe(true);
    expect(result.title).toBe("测试胶囊");
    expect(result.creator).toBe("测试者");
    expect("content" in result).toBe(false);
    expect("opened" in result).toBe(false);
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

  test("创建胶囊 - 非法时间格式应失败", async () => {
    const request = {
      title: "测试胶囊",
      content: "这是测试内容",
      creator: "测试者",
      openAt: "not-a-date",
    };

    expect(() => createCapsule(request)).toThrow("开启时间必须是 ISO 8601 格式");
  });

  test("查询胶囊 - 不存在应抛出错误", async () => {
    expect(() => getCapsule("NOTEXIST")).toThrow(CapsuleNotFoundError);
  });

  test("删除胶囊 - 不存在应抛出错误", async () => {
    expect(() => deleteCapsule("NOTEXIST")).toThrow(CapsuleNotFoundError);
  });

  test("查询胶囊路由 - 兼容历史小写胶囊码", async () => {
    CapsuleModel.create({
      code: "AbC123dE",
      title: "旧胶囊",
      content: "旧内容",
      creator: "测试者",
      open_at: "2000-01-01T00:00:00Z",
      created_at: "1999-01-01T00:00:00Z",
    });

    const app = new Elysia().use(capsuleRoutes);
    const response = await app.handle(new Request("http://localhost/api/v1/capsules/AbC123dE"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.code).toBe("AbC123dE");
  });
});
