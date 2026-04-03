/**
 * 胶囊路由
 * POST /api/v1/capsules      创建胶囊
 * GET  /api/v1/capsules/{code} 查询胶囊
 */
import Elysia, { t } from "elysia";
import { CreateCapsuleRequest, CapsuleCreated, CapsuleDetail, ApiResponse } from "../schemas";
import { createCapsule, getCapsule } from "../services/capsule";

export const capsuleRoutes = new Elysia({ prefix: "/api/v1/capsules", tags: ["Capsule"] })
  // 创建胶囊
  .post(
    "/",
    async ({ body, set }) => {
      const capsule = createCapsule(body);
      set.status = 201;
      return {
        success: true,
        data: capsule,
        message: "胶囊创建成功",
        errorCode: null,
      };
    },
    {
      body: CreateCapsuleRequest,
      response: ApiResponse(CapsuleCreated),
      detail: {
        summary: "创建时间胶囊",
      },
    }
  )
  // 查询胶囊
  .get(
    "/:code",
    async ({ params }) => {
      const capsule = getCapsule(params.code);
      return {
        success: true,
        data: capsule,
        message: null,
        errorCode: null,
      };
    },
    {
      params: t.Object({
        code: t.String({ pattern: "^[A-Za-z0-9]{8}$" }),
      }),
      response: ApiResponse(CapsuleDetail),
      detail: {
        summary: "查询时间胶囊",
      },
    }
  );
