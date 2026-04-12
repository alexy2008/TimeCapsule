using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using HelloTimeWinUI.Models;

namespace HelloTimeWinUI.Services;

/// <summary>
/// WinUI 3 桌面端直接对接统一的 HelloTime API 契约。
/// </summary>
public sealed class ApiClient
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly HttpClient _httpClient = new()
    {
        BaseAddress = new Uri("http://127.0.0.1:8080/api/v1/"),
    };

    public async Task<BackendTechStack?> GetBackendTechStackAsync()
    {
        using var response = await _httpClient.GetAsync("health");
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync();
        var payload = await JsonSerializer.DeserializeAsync<HealthEnvelope>(stream, JsonOptions);
        return payload?.Data?.TechStack;
    }

    public async Task<(BackendTechStack? TechStack, string? Error)> GetBackendTechStackWithDetailsAsync()
    {
        try
        {
            using var response = await _httpClient.GetAsync("health");
            if (!response.IsSuccessStatusCode)
            {
                return (null, $"HTTP {(int)response.StatusCode}");
            }

            await using var stream = await response.Content.ReadAsStreamAsync();
            var payload = await JsonSerializer.DeserializeAsync<HealthEnvelope>(stream, JsonOptions);
            return (payload?.Data?.TechStack, null);
        }
        catch (Exception ex)
        {
            return (null, ex.Message);
        }
    }

    public async Task<Capsule> CreateCapsuleAsync(CreateCapsuleRequest request)
    {
        using var response = await _httpClient.PostAsync(
            "capsules",
            new StringContent(JsonSerializer.Serialize(request, JsonOptions), Encoding.UTF8, "application/json"));

        return await ReadEnvelopeAsync<Capsule>(response, expectedStatusCode: 201);
    }

    public async Task<Capsule> GetCapsuleAsync(string code)
    {
        using var response = await _httpClient.GetAsync($"capsules/{code}");
        return await ReadEnvelopeAsync<Capsule>(response);
    }

    public async Task<AdminToken> AdminLoginAsync(string password)
    {
        using var response = await _httpClient.PostAsync(
            "admin/login",
            new StringContent(
                JsonSerializer.Serialize(new AdminLoginRequest { Password = password }, JsonOptions),
                Encoding.UTF8,
                "application/json"));

        return await ReadEnvelopeAsync<AdminToken>(response);
    }

    public async Task<CapsulePage> GetAdminCapsulesAsync(string token, int page = 0, int size = 20)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, $"admin/capsules?page={page}&size={size}");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        using var response = await _httpClient.SendAsync(request);
        return await ReadEnvelopeAsync<CapsulePage>(response);
    }

    public async Task DeleteAdminCapsuleAsync(string token, string code)
    {
        using var request = new HttpRequestMessage(HttpMethod.Delete, $"admin/capsules/{code}");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        using var response = await _httpClient.SendAsync(request);
        await ReadEnvelopeAsync<object>(response);
    }

    private static async Task<T> ReadEnvelopeAsync<T>(HttpResponseMessage response, int expectedStatusCode = 200)
    {
        await using var stream = await response.Content.ReadAsStreamAsync();
        var envelope = await JsonSerializer.DeserializeAsync<ApiEnvelope<T>>(stream, JsonOptions);

        if (response.StatusCode != (System.Net.HttpStatusCode)expectedStatusCode || envelope?.Success != true)
        {
            throw new ApiException(envelope?.Message ?? $"请求失败 ({(int)response.StatusCode})");
        }

        if (envelope.Data is null)
        {
            if (typeof(T) == typeof(object))
            {
                return (T)(object)new object();
            }

            throw new ApiException("服务响应缺少业务数据。");
        }

        return envelope.Data;
    }
}
