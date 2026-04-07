using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace HelloTimeWinUI.Models;

public sealed class ApiEnvelope<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; init; }

    [JsonPropertyName("data")]
    public T? Data { get; init; }

    [JsonPropertyName("message")]
    public string? Message { get; init; }

    [JsonPropertyName("errorCode")]
    public string? ErrorCode { get; init; }
}

public sealed class HealthEnvelope
{
    [JsonPropertyName("data")]
    public HealthPayload? Data { get; init; }
}

public sealed class HealthPayload
{
    [JsonPropertyName("techStack")]
    public BackendTechStack? TechStack { get; init; }
}

public sealed class BackendTechStack
{
    [JsonPropertyName("framework")]
    public string? Framework { get; init; }

    [JsonPropertyName("language")]
    public string? Language { get; init; }

    [JsonPropertyName("database")]
    public string? Database { get; init; }
}

public sealed class CreateCapsuleRequest
{
    [JsonPropertyName("title")]
    public required string Title { get; init; }

    [JsonPropertyName("content")]
    public required string Content { get; init; }

    [JsonPropertyName("creator")]
    public required string Creator { get; init; }

    [JsonPropertyName("openAt")]
    public required DateTimeOffset OpenAt { get; init; }
}

public sealed class Capsule
{
    [JsonPropertyName("code")]
    public required string Code { get; init; }

    [JsonPropertyName("title")]
    public required string Title { get; init; }

    [JsonPropertyName("content")]
    public string? Content { get; init; }

    [JsonPropertyName("creator")]
    public required string Creator { get; init; }

    [JsonPropertyName("openAt")]
    public DateTimeOffset OpenAt { get; init; }

    [JsonPropertyName("createdAt")]
    public DateTimeOffset CreatedAt { get; init; }

    [JsonPropertyName("opened")]
    public bool? Opened { get; init; }

    [JsonIgnore]
    public bool IsUnlocked => Opened ?? OpenAt <= DateTimeOffset.UtcNow;
}

public sealed class AdminLoginRequest
{
    [JsonPropertyName("password")]
    public required string Password { get; init; }
}

public sealed class AdminToken
{
    [JsonPropertyName("token")]
    public required string Token { get; init; }
}

public sealed class CapsulePage
{
    [JsonPropertyName("content")]
    public required List<Capsule> Content { get; init; }

    [JsonPropertyName("totalElements")]
    public int TotalElements { get; init; }

    [JsonPropertyName("totalPages")]
    public int TotalPages { get; init; }

    [JsonPropertyName("number")]
    public int Number { get; init; }

    [JsonPropertyName("size")]
    public int Size { get; init; }
}
