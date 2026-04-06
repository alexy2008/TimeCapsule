namespace HelloTime.AspNetCore.Configuration;

public sealed class AppOptions
{
    public int Port { get; init; } = 18050;

    public string DatabasePath { get; init; } = "../../data/hellotime.db";

    public string AdminPassword { get; init; } = "timecapsule-admin";

    public string JwtSecret { get; init; } = "hellotime-jwt-secret-key-that-is-long-enough-for-hs256";

    public int JwtExpirationHours { get; init; } = 2;
}
