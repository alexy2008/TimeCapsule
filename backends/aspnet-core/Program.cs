using System.Text.Json;
using HelloTime.AspNetCore.Configuration;
using HelloTime.AspNetCore.Dtos;
using HelloTime.AspNetCore.Middleware;
using HelloTime.AspNetCore.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
var appOptions = AppOptionsLoader.Load(builder.Configuration);

builder.WebHost.UseUrls($"http://127.0.0.1:{appOptions.Port}");

builder.Services.AddSingleton(appOptions);
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<CapsuleRepository>();
builder.Services.AddSingleton<CapsuleService>();
builder.Services.AddSingleton<AdminAuthService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(origin => Uri.TryCreate(origin, UriKind.Absolute, out var uri) &&
                                            uri.Host == "localhost")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var authService = new AdminAuthService(appOptions);
        options.TokenValidationParameters = authService.CreateValidationParameters();
        options.Events = new JwtBearerEvents
        {
            OnChallenge = async context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json; charset=utf-8";
                await context.Response.WriteAsJsonAsync(
                    ApiResponseFactory.Error("认证令牌无效或已过期", "UNAUTHORIZED"),
                    new JsonSerializerOptions(JsonSerializerDefaults.Web));
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState.Values
            .SelectMany(value => value.Errors)
            .Select(error => error.ErrorMessage)
            .Where(message => !string.IsNullOrWhiteSpace(message))
            .DefaultIfEmpty("参数校验失败");

        return new BadRequestObjectResult(ApiResponseFactory.Error(string.Join("; ", errors), "VALIDATION_ERROR"));
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<ApiExceptionMiddleware>();
app.UseCors();

var logosDirectory = Path.Combine(app.Environment.ContentRootPath, "static", "tech-logos");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(logosDirectory),
    RequestPath = "/tech-logos"
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program;
