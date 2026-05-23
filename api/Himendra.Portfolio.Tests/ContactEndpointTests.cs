using System.Net;
using System.Net.Http.Json;
using Himendra.Portfolio.Application.Contact;
using Himendra.Portfolio.Application.Security;
using Himendra.Portfolio.Domain.Entities;
using Himendra.Portfolio.Infrastructure.Contact;
using Himendra.Portfolio.Infrastructure.Data;
using Himendra.Portfolio.Infrastructure.Security;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Himendra.Portfolio.Tests;

public sealed class ContactEndpointTests
{
    [Fact]
    public async Task ValidSubmissionReturnsCreatedAndPersistsSubmission()
    {
        await using var factory = CreateContactFactory();
        using var client = factory.CreateClient();

        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/contact")
        {
            Content = JsonContent.Create(new
            {
                name = "  Jane Doe  ",
                email = "  jane@example.com  ",
                message = "  Hello, I would like to talk about a project.  "
            })
        };
        request.Headers.UserAgent.ParseAdd("ContactEndpointTests/1.0");

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<ContactResponse>();
        Assert.NotNull(body);
        Assert.NotEqual(Guid.Empty, body.Id);
        Assert.Equal("Received", body.Status);
        Assert.Equal("Thanks for reaching out. I will get back to you soon.", body.Message);

        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
        var submission = await dbContext.ContactSubmissions.SingleAsync();
        var auditLogEntry = await dbContext.AuditLogEntries.SingleAsync();

        Assert.Equal(body.Id, submission.Id);
        Assert.Equal("Jane Doe", submission.Name);
        Assert.Equal("jane@example.com", submission.Email);
        Assert.Equal("Hello, I would like to talk about a project.", submission.Message);
        Assert.Equal(ContactSubmissionStatus.New, submission.Status);
        Assert.Null(submission.SourceIpHash);
        Assert.Equal("ContactEndpointTests/1.0", submission.UserAgent);
        Assert.Equal("ContactSubmissionCreated", auditLogEntry.Action);
        Assert.Equal(nameof(ContactSubmission), auditLogEntry.ResourceType);
        Assert.Equal(submission.Id.ToString(), auditLogEntry.ResourceId);
        Assert.Equal(submission.SourceIpHash, auditLogEntry.IpHash);
        Assert.Null(auditLogEntry.MetadataJson);
    }

    [Fact]
    public async Task InvalidEmailReturnsBadRequest()
    {
        await using var factory = CreateContactFactory();
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/contact", new
        {
            name = "Jane Doe",
            email = "not-an-email",
            message = "Hello, this message is long enough."
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task BlankNameReturnsBadRequest()
    {
        await using var factory = CreateContactFactory();
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/contact", new
        {
            name = "   ",
            email = "jane@example.com",
            message = "Hello, this message is long enough."
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ShortMessageReturnsBadRequest()
    {
        await using var factory = CreateContactFactory();
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/contact", new
        {
            name = "Jane Doe",
            email = "jane@example.com",
            message = "Too short"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task OverlongMessageReturnsBadRequest()
    {
        await using var factory = CreateContactFactory();
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/contact", new
        {
            name = "Jane Doe",
            email = "jane@example.com",
            message = new string('a', 4001)
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PublicRequestCannotSetInternalFields()
    {
        await using var factory = CreateContactFactory();
        using var client = factory.CreateClient();
        var suppliedId = Guid.NewGuid();

        var response = await client.PostAsJsonAsync("/api/contact", new
        {
            id = suppliedId,
            status = ContactSubmissionStatus.Spam,
            createdAtUtc = DateTimeOffset.UnixEpoch,
            reviewedAtUtc = DateTimeOffset.UnixEpoch,
            name = "Jane Doe",
            email = "jane@example.com",
            message = "Hello, this message is long enough."
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
        var submission = await dbContext.ContactSubmissions.SingleAsync();

        Assert.NotEqual(suppliedId, submission.Id);
        Assert.Equal(ContactSubmissionStatus.New, submission.Status);
        Assert.NotEqual(DateTimeOffset.UnixEpoch, submission.CreatedAtUtc);
        Assert.Null(submission.ReviewedAtUtc);
    }

    [Fact]
    public async Task ContactRateLimitReturnsTooManyRequestsAfterConfiguredLimit()
    {
        await using var factory = CreateContactFactory(new Dictionary<string, string?>
        {
            ["RateLimiting:ContactPermitLimit"] = "2",
            ["RateLimiting:ContactWindowSeconds"] = "60",
            ["RateLimiting:GlobalPermitLimit"] = "100"
        });
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var first = await client.PostAsJsonAsync("/api/contact", ValidContactPayload("first@example.com"));
        var second = await client.PostAsJsonAsync("/api/contact", ValidContactPayload("second@example.com"));
        var third = await client.PostAsJsonAsync("/api/contact", ValidContactPayload("third@example.com"));

        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        Assert.Equal(HttpStatusCode.Created, second.StatusCode);
        Assert.Equal(HttpStatusCode.TooManyRequests, third.StatusCode);
    }

    private static WebApplicationFactory<Program> CreateContactFactory(
        Dictionary<string, string?>? settings = null)
    {
        var databaseName = $"contact-tests-{Guid.NewGuid()}";

        settings ??= [];
        settings["Security:IpHashSalt"] = "test-salt";
        settings["RateLimiting:GlobalPermitLimit"] = settings.GetValueOrDefault("RateLimiting:GlobalPermitLimit") ?? "100";

        return new WebApplicationFactory<Program>()
            .WithWebHostBuilder(webHostBuilder =>
            {
                webHostBuilder.ConfigureAppConfiguration((_, configurationBuilder) =>
                {
                    configurationBuilder.AddInMemoryCollection(settings);
                });

                webHostBuilder.ConfigureServices(services =>
                {
                    services.AddDbContext<PortfolioDbContext>(options =>
                        options.UseInMemoryDatabase(databaseName));
                    services.AddScoped<IIpHashService, IpHashService>();
                    services.AddScoped<IContactSubmissionService, ContactSubmissionService>();
                });
            });
    }

    private static object ValidContactPayload(string email)
    {
        return new
        {
            name = "Jane Doe",
            email,
            message = "Hello, this message is long enough."
        };
    }

    private sealed record ContactResponse(Guid Id, string Status, string Message);
}
