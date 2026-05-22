using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
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

    [Fact]
    public async Task ResponsesIncludeSecureHeaders()
    {
        var response = await _client.GetAsync("/health");

        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.Equal("DENY", response.Headers.GetValues("X-Frame-Options").Single());
        Assert.Equal("no-referrer", response.Headers.GetValues("Referrer-Policy").Single());
        Assert.Equal("0", response.Headers.GetValues("X-XSS-Protection").Single());
    }

    [Fact]
    public async Task SwaggerIsNotEnabledOutsideDevelopment()
    {
        await using var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(webHostBuilder =>
            {
                webHostBuilder.UseEnvironment("Production");
            });

        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/swagger/index.html");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task RateLimitingReturnsTooManyRequestsAfterConfiguredLimit()
    {
        await using var factory = CreateFactoryWithSettings(new Dictionary<string, string?>
        {
            ["RateLimiting:GlobalPermitLimit"] = "2",
            ["RateLimiting:GlobalWindowSeconds"] = "60"
        });

        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var first = await client.GetAsync("/health");
        var second = await client.GetAsync("/health");
        var third = await client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(HttpStatusCode.OK, second.StatusCode);
        Assert.Equal(HttpStatusCode.TooManyRequests, third.StatusCode);
    }

    [Fact]
    public async Task CorsAllowsConfiguredLocalFrontendOrigin()
    {
        await using var factory = CreateFactoryWithSettings(new Dictionary<string, string?>
        {
            ["Cors:AllowedOrigins:0"] = "http://localhost:5173"
        });

        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Options, "/health");
        request.Headers.Add("Origin", "http://localhost:5173");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Equal("http://localhost:5173", response.Headers.GetValues("Access-Control-Allow-Origin").Single());
    }

    [Fact]
    public async Task CorsDoesNotAllowUnconfiguredOrigin()
    {
        await using var factory = CreateFactoryWithSettings(new Dictionary<string, string?>
        {
            ["Cors:AllowedOrigins:0"] = "http://localhost:5173"
        });

        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Options, "/health");
        request.Headers.Add("Origin", "https://example.invalid");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.False(response.Headers.Contains("Access-Control-Allow-Origin"));
    }

    private static WebApplicationFactory<Program> CreateFactoryWithSettings(
        Dictionary<string, string?> settings)
    {
        return new WebApplicationFactory<Program>()
            .WithWebHostBuilder(webHostBuilder =>
            {
                webHostBuilder.ConfigureAppConfiguration((_, configurationBuilder) =>
                {
                    configurationBuilder.AddInMemoryCollection(settings);
                });
            });
    }

    private sealed record HealthResponse(string Status, string Service);

    private sealed record RootResponse(string Name, string Status);
}
