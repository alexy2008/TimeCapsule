namespace HelloTime.AspNetCore.Models;

public sealed class CapsuleEntity
{
    public long Id { get; init; }

    public string Code { get; init; } = string.Empty;

    public string Title { get; init; } = string.Empty;

    public string Content { get; init; } = string.Empty;

    public string Creator { get; init; } = string.Empty;

    public string OpenAt { get; init; } = string.Empty;

    public string CreatedAt { get; init; } = string.Empty;
}
