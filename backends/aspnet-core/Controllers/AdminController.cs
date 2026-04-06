using HelloTime.AspNetCore.Dtos;
using HelloTime.AspNetCore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelloTime.AspNetCore.Controllers;

/// <summary>
/// 管理员接口。
/// 主要演示 ASP.NET Core 的 [Authorize] 注解以及基于 JWT 的权限拦截。
/// </summary>
[ApiController]
[Route("api/v1/admin")]
public sealed class AdminController : ControllerBase
{
    private readonly AdminAuthService _adminAuthService;
    private readonly CapsuleService _capsuleService;

    public AdminController(AdminAuthService adminAuthService, CapsuleService capsuleService)
    {
        _adminAuthService = adminAuthService;
        _capsuleService = capsuleService;
    }

    [HttpPost("login")]
    public ActionResult<ApiResponse<AdminTokenResponse>> Login([FromBody] AdminLoginRequest request)
        => Ok(ApiResponseFactory.Ok(new AdminTokenResponse(_adminAuthService.Login(request.Password)), "登录成功"));

    [Authorize]
    [HttpGet("capsules")]
    public async Task<ActionResult<ApiResponse<CapsulePageResponse>>> List(
        [FromQuery] ListCapsulesQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _capsuleService.ListAsync(query.Page, query.Size, cancellationToken);
        return Ok(ApiResponseFactory.Ok(result));
    }

    [Authorize]
    [HttpDelete("capsules/{code}")]
    public async Task<ActionResult<ApiResponse<object?>>> Delete(string code, CancellationToken cancellationToken)
    {
        await _capsuleService.DeleteAsync(code, cancellationToken);
        return Ok(ApiResponseFactory.Ok("删除成功"));
    }
}
