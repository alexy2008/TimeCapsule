using System.Text.Json;
using HelloTime.AspNetCore.Dtos;
using HelloTime.AspNetCore.Models;

namespace HelloTime.AspNetCore.Middleware;

public sealed class ApiExceptionMiddleware
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly RequestDelegate _next;

    public ApiExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AppException exception)
        {
            context.Response.StatusCode = exception.StatusCode;
            context.Response.ContentType = "application/json; charset=utf-8";
            await JsonSerializer.SerializeAsync(
                context.Response.Body,
                ApiResponseFactory.Error(exception.Message, exception.ErrorCode),
                JsonOptions
            );
        }
        catch (Exception)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json; charset=utf-8";
            await JsonSerializer.SerializeAsync(
                context.Response.Body,
                ApiResponseFactory.Error("服务器内部错误", "INTERNAL_ERROR"),
                JsonOptions
            );
        }
    }
}
