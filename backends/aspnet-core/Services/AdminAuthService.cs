using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HelloTime.AspNetCore.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HelloTime.AspNetCore.Services;

public sealed class AdminAuthService
{
    private readonly AppOptions _options;
    private readonly JwtSecurityTokenHandler _tokenHandler = new();
    private readonly byte[] _secret;

    public AdminAuthService(AppOptions options)
    {
        _options = options;
        _secret = Encoding.UTF8.GetBytes(options.JwtSecret);
    }

    public string Login(string password)
    {
        if (password != _options.AdminPassword)
        {
            throw new Models.AppException(401, "UNAUTHORIZED", "密码错误");
        }

        var credentials = new SigningCredentials(new SymmetricSecurityKey(_secret), SecurityAlgorithms.HmacSha256);
        var now = DateTime.UtcNow;
        var token = new JwtSecurityToken(
            claims: [new Claim(JwtRegisteredClaimNames.Sub, "admin")],
            notBefore: now,
            expires: now.AddHours(_options.JwtExpirationHours),
            signingCredentials: credentials
        );

        return _tokenHandler.WriteToken(token);
    }

    public TokenValidationParameters CreateValidationParameters()
        => new()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(_secret),
            ClockSkew = TimeSpan.Zero
        };
}
