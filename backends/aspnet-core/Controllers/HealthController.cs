using HelloTime.AspNetCore.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace HelloTime.AspNetCore.Controllers;

[ApiController]
[Route("api/v1/health")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult<ApiResponse<HealthPayload>> Get()
        => Ok(ApiResponseFactory.Ok(
            new HealthPayload(
                "UP",
                Services.DateTimeFormats.FormatUtc(DateTimeOffset.UtcNow),
                new TechStackResponse("ASP.NET Core 8", "C# 12", "SQLite")
            )));
}
