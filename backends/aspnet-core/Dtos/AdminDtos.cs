using System.ComponentModel.DataAnnotations;

namespace HelloTime.AspNetCore.Dtos;

public sealed class AdminLoginRequest
{
    [Required(ErrorMessage = "password 不能为空")]
    public string Password { get; init; } = string.Empty;
}

public sealed record AdminTokenResponse(string Token);

public sealed record ListCapsulesQuery
{
    [Range(0, int.MaxValue, ErrorMessage = "page 不能小于 0")]
    public int Page { get; init; } = 0;

    [Range(1, 100, ErrorMessage = "size 必须在 1 到 100 之间")]
    public int Size { get; init; } = 20;
}
