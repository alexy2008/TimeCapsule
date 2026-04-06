using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Nodes;

namespace HelloTime.AspNetCore.Tests;

public sealed class BackendTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public BackendTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_ReturnsUp()
    {
        var response = await _client.GetAsync("/api/v1/health");
        var body = await response.Content.ReadFromJsonAsync<JsonObject>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("UP", body?["data"]?["status"]?.GetValue<string>());
        Assert.Equal("ASP.NET Core 8", body?["data"]?["techStack"]?["framework"]?.GetValue<string>());
        Assert.Equal("C# 12", body?["data"]?["techStack"]?["language"]?.GetValue<string>());
    }

    [Fact]
    public async Task Create_And_Fetch_Locked_Capsule()
    {
        var payload = new
        {
            title = "ASP.NET Core 测试",
            content = "未来再看",
            creator = "测试者",
            openAt = DateTimeOffset.UtcNow.AddMinutes(10).ToString("O")
        };

        var createResponse = await _client.PostAsJsonAsync("/api/v1/capsules", payload);
        var created = await createResponse.Content.ReadFromJsonAsync<JsonObject>();
        var code = created?["data"]?["code"]?.GetValue<string>();

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        Assert.NotNull(code);

        var getResponse = await _client.GetAsync($"/api/v1/capsules/{code}");
        var fetched = await getResponse.Content.ReadFromJsonAsync<JsonObject>();

        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        Assert.False(fetched?["data"]?["opened"]?.GetValue<bool>() ?? true);
        Assert.True(fetched?["data"]?["content"] is null);
    }

    [Fact]
    public async Task Invalid_Time_Format_Returns400()
    {
        var payload = new
        {
            title = "非法时间",
            content = "内容",
            creator = "测试者",
            openAt = "not-a-date"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/capsules", payload);
        var body = await response.Content.ReadFromJsonAsync<JsonObject>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("BAD_REQUEST", body?["errorCode"]?.GetValue<string>());
    }

    [Fact]
    public async Task Admin_Can_List_And_Delete_Capsules()
    {
        var payload = new
        {
            title = "管理员可见",
            content = "完整内容",
            creator = "测试者",
            openAt = DateTimeOffset.UtcNow.AddMinutes(10).ToString("O")
        };
        var createResponse = await _client.PostAsJsonAsync("/api/v1/capsules", payload);
        var created = await createResponse.Content.ReadFromJsonAsync<JsonObject>();
        var code = created?["data"]?["code"]?.GetValue<string>()!;

        var loginResponse = await _client.PostAsJsonAsync("/api/v1/admin/login", new { password = "timecapsule-admin" });
        var loginBody = await loginResponse.Content.ReadFromJsonAsync<JsonObject>();
        var token = loginBody?["data"]?["token"]?.GetValue<string>();

        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/v1/admin/capsules?page=0&size=20");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        var listResponse = await _client.SendAsync(request);
        var listBody = await listResponse.Content.ReadFromJsonAsync<JsonObject>();

        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);
        Assert.Equal("完整内容", listBody?["data"]?["content"]?[0]?["content"]?.GetValue<string>());

        using var deleteRequest = new HttpRequestMessage(HttpMethod.Delete, $"/api/v1/admin/capsules/{code}");
        deleteRequest.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        var deleteResponse = await _client.SendAsync(deleteRequest);

        Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);
    }
}
