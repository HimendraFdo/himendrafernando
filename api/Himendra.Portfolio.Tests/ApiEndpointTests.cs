using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Himendra.Portfolio.Tests;

public sealed class ApiEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HealthEndpointReturnsHealthyResponse()
    {
        var response = await _client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<HealthResponse>();

        Assert.NotNull(body);
        Assert.Equal("Healthy", body.Status);
        Assert.Equal("Himendra.Portfolio.Api", body.Service);
    }

    [Fact]
    public async Task RootEndpointReturnsRunningResponse()
    {
        var response = await _client.GetAsync("/");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<RootResponse>();

        Assert.NotNull(body);
        Assert.Equal("Himendra Fernando Portfolio API", body.Name);
        Assert.Equal("Running", body.Status);
    }

    private sealed record HealthResponse(string Status, string Service);

    private sealed record RootResponse(string Name, string Status);
}
