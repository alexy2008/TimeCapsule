using HelloTime.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace HelloTime.AspNetCore.Tests;

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _databasePath = Path.Combine(Path.GetTempPath(), $"hellotime-aspnet-core-{Guid.NewGuid():N}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["HelloTime:DatabasePath"] = _databasePath,
                ["HelloTime:AdminPassword"] = "timecapsule-admin",
                ["HelloTime:JwtSecret"] = "test-jwt-secret-key-that-is-long-enough-for-hs256",
                ["HelloTime:JwtExpirationHours"] = "2",
                ["HelloTime:Port"] = "18050"
            });
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (disposing && File.Exists(_databasePath))
        {
            File.Delete(_databasePath);
        }
    }
}
