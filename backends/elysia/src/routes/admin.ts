/**
 * 管理员路由
 * POST   /api/v1/admin/login           管理员登录（无需认证）
 * GET    /api/v1/admin/capsules        分页查询胶囊列表（需认证）
 * DELETE /api/v1/admin/capsules/{code} 删除胶囊（需认证）
 */
import Elysia from "elysia";
import { t } from "elysia";
import { AdminLoginRequest, AdminToken, CapsulePage, ApiResponse, VoidResponse } from "../schemas";
import { login, verifyAuth } from "../services/admin";
import { listCapsules, deleteCapsule } from "../services/capsule";

export const adminRoutes = new Elysia({ prefix: "/api/v1/admin", tags: ["Admin"] })
  // 管理员登录
  .post(
    "/login",
    async ({ body }) => {
      const token = await login(body.password);
      return {
        success: true,
        data: { token },
        message: "登录成功",
        errorCode: null,
      };
    },
    {
      body: AdminLoginRequest,
      response: ApiResponse(AdminToken),
      detail: {
        summary: "管理员登录",
      },
    }
  )
  // 分页查询胶囊列表
  .get(
    "/capsules",
    async ({ request, query }) => {
      // 验证认证
      await verifyAuth(request.headers.get("authorization") ?? undefined);

      const page = query.page ?? 0;
      const size = query.size ?? 20;
      const result = listCapsules(page, size);

      return {
        success: true,
        data: result,
        message: null,
        errorCode: null,
      };
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric({ minimum: 0 })),
        size: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      }),
      response: ApiResponse(CapsulePage),
      detail: {
        summary: "分页查询所有胶囊",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  // 删除胶囊
  .delete(
    "/capsules/:code",
    async ({ request, params }) => {
      // 验证认证
      await verifyAuth(request.headers.get("authorization") ?? undefined);

      deleteCapsule(params.code);

      return {
        success: true,
        data: null,
        message: "删除成功",
        errorCode: null,
      };
    },
    {
      params: t.Object({
        code: t.String(),
      }),
      response: VoidResponse,
      detail: {
        summary: "删除胶囊",
        security: [{ BearerAuth: [] }],
      },
    }
  );
