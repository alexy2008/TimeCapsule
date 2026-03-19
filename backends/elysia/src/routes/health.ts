/**
 * 健康检查路由
 * GET /api/v1/health
 */
import Elysia from "elysia";
import { HealthData, ApiResponse } from "../schemas";

export const healthRoutes = new Elysia({ prefix: "/api/v1" }).get(
  "/health",
  () => {
    return {
      success: true,
      data: {
        status: "UP",
        timestamp: new Date().toISOString(),
        techStack: {
          framework: "Elysia 1.x",
          language: "TypeScript/Bun",
          database: "SQLite",
        },
      },
      message: null,
      errorCode: null,
    };
  },
  {
    response: ApiResponse(HealthData),
    detail: {
      tags: ["System"],
      summary: "健康检查",
    },
  }
);
