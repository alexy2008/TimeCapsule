using System.Security.Cryptography;
using HelloTime.AspNetCore.Dtos;
using HelloTime.AspNetCore.Models;

namespace HelloTime.AspNetCore.Services;

public sealed class CapsuleService
{
    private const string CodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private const int CodeLength = 8;
    private const int MaxRetries = 10;

    private readonly CapsuleRepository _repository;
    private readonly TimeProvider _timeProvider;

    public CapsuleService(CapsuleRepository repository, TimeProvider timeProvider)
    {
        _repository = repository;
        _timeProvider = timeProvider;
    }

    public async Task<CapsuleCreatedResponse> CreateAsync(CreateCapsuleRequest request, CancellationToken cancellationToken = default)
    {
        if (!DateTimeFormats.TryParseUtc(request.OpenAt, out var openAt))
        {
            throw new AppException(400, "BAD_REQUEST", "开启时间必须是 ISO 8601 格式");
        }

        var now = _timeProvider.GetUtcNow();
        if (openAt <= now)
        {
            throw new AppException(400, "BAD_REQUEST", "开启时间必须在未来");
        }

        var code = await GenerateUniqueCodeAsync(cancellationToken);
        var createdAt = DateTimeFormats.FormatUtc(now);
        var openAtFormatted = DateTimeFormats.FormatUtc(openAt);

        await _repository.CreateAsync(
            new CapsuleEntity
            {
                Code = code,
                Title = request.Title,
                Content = request.Content,
                Creator = request.Creator,
                OpenAt = openAtFormatted,
                CreatedAt = createdAt
            },
            cancellationToken
        );

        return new CapsuleCreatedResponse(code, request.Title, request.Creator, openAtFormatted, createdAt);
    }

    public async Task<CapsuleDetailResponse> GetAsync(string code, CancellationToken cancellationToken = default)
    {
        var capsule = await _repository.FindByCodeAsync(code, cancellationToken);
        if (capsule is null)
        {
            throw new AppException(404, "CAPSULE_NOT_FOUND", $"胶囊不存在：{code}");
        }

        return ToDetail(capsule, includeContent: false);
    }

    public async Task<CapsulePageResponse> ListAsync(int page, int size, CancellationToken cancellationToken = default)
    {
        var (content, total) = await _repository.ListAsync(page, size, cancellationToken);
        var totalPages = Math.Max(1, (int)Math.Ceiling(total / (double)size));

        return new CapsulePageResponse(
            content.Select(capsule => ToDetail(capsule, includeContent: true)).ToList(),
            total,
            totalPages,
            page,
            size
        );
    }

    public async Task DeleteAsync(string code, CancellationToken cancellationToken = default)
    {
        if (!await _repository.DeleteAsync(code, cancellationToken))
        {
            throw new AppException(404, "CAPSULE_NOT_FOUND", $"胶囊不存在：{code}");
        }
    }

    private async Task<string> GenerateUniqueCodeAsync(CancellationToken cancellationToken)
    {
        for (var i = 0; i < MaxRetries; i++)
        {
            var code = GenerateCode();
            if (!await _repository.CodeExistsAsync(code, cancellationToken))
            {
                return code;
            }
        }

        throw new AppException(500, "INTERNAL_ERROR", "无法生成唯一的胶囊码");
    }

    private static string GenerateCode()
    {
        Span<char> buffer = stackalloc char[CodeLength];
        for (var i = 0; i < buffer.Length; i++)
        {
            buffer[i] = CodeChars[RandomNumberGenerator.GetInt32(CodeChars.Length)];
        }

        return new string(buffer);
    }

    private CapsuleDetailResponse ToDetail(CapsuleEntity capsule, bool includeContent)
    {
        DateTimeFormats.TryParseUtc(capsule.OpenAt, out var openAt);
        DateTimeFormats.TryParseUtc(capsule.CreatedAt, out var createdAt);
        var opened = _timeProvider.GetUtcNow() > openAt;

        return new CapsuleDetailResponse(
            capsule.Code,
            capsule.Title,
            includeContent || opened ? capsule.Content : null,
            capsule.Creator,
            DateTimeFormats.FormatUtc(openAt),
            DateTimeFormats.FormatUtc(createdAt),
            opened
        );
    }
}
