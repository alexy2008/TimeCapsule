using System.ComponentModel.DataAnnotations;

namespace HelloTime.AspNetCore.Dtos;

public sealed class CreateCapsuleRequest
{
    [Required(ErrorMessage = "title 不能为空")]
    [MaxLength(100, ErrorMessage = "title 最多 100 个字符")]
    public string Title { get; init; } = string.Empty;

    [Required(ErrorMessage = "content 不能为空")]
    public string Content { get; init; } = string.Empty;

    [Required(ErrorMessage = "creator 不能为空")]
    [MaxLength(30, ErrorMessage = "creator 最多 30 个字符")]
    public string Creator { get; init; } = string.Empty;

    [Required(ErrorMessage = "openAt 不能为空")]
    public string OpenAt { get; init; } = string.Empty;
}

public sealed record CapsuleCreatedResponse(
    string Code,
    string Title,
    string Creator,
    string OpenAt,
    string CreatedAt
);

public sealed record CapsuleDetailResponse(
    string Code,
    string Title,
    string? Content,
    string Creator,
    string OpenAt,
    string CreatedAt,
    bool Opened
);

public sealed record CapsulePageResponse(
    IReadOnlyList<CapsuleDetailResponse> Content,
    int TotalElements,
    int TotalPages,
    int Number,
    int Size
);
