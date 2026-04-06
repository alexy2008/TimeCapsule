using Microsoft.Extensions.Configuration;

namespace HelloTime.AspNetCore.Configuration;

public static class AppOptionsLoader
{
    public static AppOptions Load(IConfiguration configuration)
    {
        var port = ReadNumber(configuration["PORT"], configuration.GetValue<int?>("HelloTime:Port") ?? 18050);
        var jwtExpirationHours = ReadNumber(
            configuration["JWT_EXPIRATION_HOURS"],
            configuration.GetValue<int?>("HelloTime:JwtExpirationHours") ?? 2
        );

        return new AppOptions
        {
            Port = port,
            DatabasePath = configuration["DATABASE_URL"] ?? configuration["HelloTime:DatabasePath"] ?? "../../data/hellotime.db",
            AdminPassword = configuration["ADMIN_PASSWORD"] ?? configuration["HelloTime:AdminPassword"] ?? "timecapsule-admin",
            JwtSecret = configuration["JWT_SECRET"] ?? configuration["HelloTime:JwtSecret"] ?? "hellotime-jwt-secret-key-that-is-long-enough-for-hs256",
            JwtExpirationHours = jwtExpirationHours
        };
    }

    private static int ReadNumber(string? raw, int fallback)
    {
        return int.TryParse(raw, out var parsed) ? parsed : fallback;
    }
}
