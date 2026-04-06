namespace HelloTime.AspNetCore.Dtos;

public sealed record ApiResponse<T>(
    bool Success,
    T? Data,
    string? Message,
    string? ErrorCode
);

public static class ApiResponseFactory
{
    public static ApiResponse<T> Ok<T>(T data, string? message = null)
        => new(true, data, message, null);

    public static ApiResponse<object?> Ok(string? message = null)
        => new(true, null, message, null);

    public static ApiResponse<object?> Error(string message, string errorCode)
        => new(false, null, message, errorCode);
}
