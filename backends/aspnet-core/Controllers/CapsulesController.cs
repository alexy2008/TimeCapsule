using HelloTime.AspNetCore.Dtos;
using HelloTime.AspNetCore.Services;
using Microsoft.AspNetCore.Mvc;

namespace HelloTime.AspNetCore.Controllers;

[ApiController]
[Route("api/v1/capsules")]
public sealed class CapsulesController : ControllerBase
{
    private readonly CapsuleService _capsuleService;

    public CapsulesController(CapsuleService capsuleService)
    {
        _capsuleService = capsuleService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CapsuleCreatedResponse>>> Create(
        [FromBody] CreateCapsuleRequest request,
        CancellationToken cancellationToken)
    {
        var capsule = await _capsuleService.CreateAsync(request, cancellationToken);
        return StatusCode(201, ApiResponseFactory.Ok(capsule, "胶囊创建成功"));
    }

    [HttpGet("{code}")]
    public async Task<ActionResult<ApiResponse<CapsuleDetailResponse>>> Get(
        string code,
        CancellationToken cancellationToken)
    {
        var capsule = await _capsuleService.GetAsync(code, cancellationToken);
        return Ok(ApiResponseFactory.Ok(capsule));
    }
}
