/**
 * Elysia 应用入口
 * CORS 配置、路由注册、全局错误处理
 */
import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { PORT } from "./config";
import { healthRoutes } from "./routes/health";
import { capsuleRoutes } from "./routes/capsule";
import { adminRoutes } from "./routes/admin";

// 自定义错误类型
import {
  CapsuleNotFoundError,
  InvalidOpenAtError,
  CodeGenerationError,
} from "./services/capsule";
import { UnauthorizedError } from "./services/admin";

// 创建应用
const app = new Elysia()
  // CORS 配置：允许 localhost:* 跨域请求
  .use(
    cors({
      origin: /http:\/\/localhost(:\d+)?$/,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 3600,
    })
  )
  // Swagger 文档
  .use(
    swagger({
      documentation: {
        info: {
          title: "HelloTime API (Elysia)",
          version: "1.0.0",
          description: "时间胶囊应用 REST API - Elysia + Bun 实现",
        },
        tags: [
          { name: "System", description: "系统相关" },
          { name: "Capsule", description: "胶囊操作" },
          { name: "Admin", description: "管理员操作" },
        ],
      },
      path: "/api/docs",
    })
  )
  // 全局错误处理
  .error({
    CAPSULE_NOT_FOUND: CapsuleNotFoundError,
    INVALID_OPEN_AT: InvalidOpenAtError,
    CODE_GENERATION: CodeGenerationError,
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ code, error, set }) => {
    if (error instanceof CapsuleNotFoundError) {
      set.status = 404;
      return {
        success: false,
        data: null,
        message: error.message,
        errorCode: "CAPSULE_NOT_FOUND",
      };
    }

    if (error instanceof InvalidOpenAtError) {
      set.status = 400;
      return {
        success: false,
        data: null,
        message: error.message,
        errorCode: "BAD_REQUEST",
      };
    }

    if (error instanceof CodeGenerationError) {
      set.status = 500;
      return {
        success: false,
        data: null,
        message: error.message,
        errorCode: "INTERNAL_ERROR",
      };
    }

    if (error instanceof UnauthorizedError) {
      set.status = 401;
      return {
        success: false,
        data: null,
        message: error.message,
        errorCode: "UNAUTHORIZED",
      };
    }

    switch (code) {
      case "CAPSULE_NOT_FOUND":
        set.status = 404;
        return {
          success: false,
          data: null,
          message: error.message,
          errorCode: "CAPSULE_NOT_FOUND",
        };
      case "INVALID_OPEN_AT":
        set.status = 400;
        return {
          success: false,
          data: null,
          message: error.message,
          errorCode: "BAD_REQUEST",
        };
      case "CODE_GENERATION":
        set.status = 500;
        return {
          success: false,
          data: null,
          message: error.message,
          errorCode: "INTERNAL_ERROR",
        };
      case "UNAUTHORIZED":
        set.status = 401;
        return {
          success: false,
          data: null,
          message: error.message,
          errorCode: "UNAUTHORIZED",
        };
      case "VALIDATION":
        set.status = 400;
        return {
          success: false,
          data: null,
          message: (error as Error).message,
          errorCode: "VALIDATION_ERROR",
        };
      default:
        console.error("Unhandled error:", error);
        set.status = 500;
        return {
          success: false,
          data: null,
          message: "服务器内部错误",
          errorCode: "INTERNAL_ERROR",
        };
    }
  })
  .get("/tech-logos/:file", ({ params, set }) => {
    const techLogos: Record<string, string> = {
      "backend.svg": "static/tech-logos/backend.svg",
      "language.svg": "static/tech-logos/language.svg",
      "database.svg": "static/tech-logos/database.svg",
    };

    const asset = techLogos[params.file];
    if (!asset) {
      set.status = 404;
      return "Not Found";
    }

    return Bun.file(asset);
  })
  // 注册路由
  .use(healthRoutes)
  .use(capsuleRoutes)
  .use(adminRoutes)
  // 启动服务器
  .listen(PORT);

console.log(`
🦊 HelloTime Elysia Backend running at:
  > Local:   http://localhost:${PORT}
  > Docs:    http://localhost:${PORT}/api/docs
`);
