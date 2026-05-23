using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Himendra.Portfolio.Application.Admin.ContactSubmissions;
using Himendra.Portfolio.Application.Contact;
using Himendra.Portfolio.Application.Security;
using Himendra.Portfolio.Domain.Entities;
using Himendra.Portfolio.Infrastructure.Admin.ContactSubmissions;
using Himendra.Portfolio.Infrastructure.Contact;
using Himendra.Portfolio.Infrastructure.Data;
using Himendra.Portfolio.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Xunit;

namespace Himendra.Portfolio.Tests;

public sealed class AdminContactSubmissionEndpointTests
{
    private const string TestAuthScheme = "Test";

    [Fact]
    public async Task AnonymousUsersCannotAccessAdminEndpoints()
    {
        await using var factory = CreateAdminFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/admin/contact-submissions");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AuthenticatedNonAdminUsersCannotAccessAdminEndpoints()
    {
        await using var factory = CreateAdminFactory();
        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/admin/contact-submissions");
        request.Headers.Add("X-Test-User", "user-1");
        request.Headers.Add("X-Test-Role", "Reader");

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminUsersCanListContactSubmissions()
    {
        await using var factory = CreateAdminFactory(async dbContext =>
        {
            dbContext.ContactSubmissions.Add(CreateSubmission("Jane Doe", "jane@example.com"));
            await dbContext.SaveChangesAsync();
        });
        using var client = CreateAdminClient(factory);

        var response = await client.GetAsync("/api/admin/contact-submissions");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<PagedAdminContactSubmissionsResponse>();
        Assert.NotNull(body);
        Assert.Single(body.Items);
        Assert.Equal("Jane Doe", body.Items[0].Name);
        Assert.Equal("jane@example.com", body.Items[0].Email);
        Assert.Equal(ContactSubmissionStatus.New, body.Items[0].Status);
    }

    [Fact]
    public async Task AdminUsersCanFetchOneContactSubmission()
    {
        var submissionId = Guid.NewGuid();
        await using var factory = CreateAdminFactory(async dbContext =>
        {
            dbContext.ContactSubmissions.Add(CreateSubmission("Jane Doe", "jane@example.com", submissionId));
            await dbContext.SaveChangesAsync();
        });
        using var client = CreateAdminClient(factory);

        var response = await client.GetAsync($"/api/admin/contact-submissions/{submissionId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<AdminContactSubmissionDto>();
        Assert.NotNull(body);
        Assert.Equal(submissionId, body.Id);
        Assert.Equal("Jane Doe", body.Name);
    }

    [Fact]
    public async Task AdminUsersCanUpdateStatusAndCreateAuditLog()
    {
        var submissionId = Guid.NewGuid();
        await using var factory = CreateAdminFactory(async dbContext =>
        {
            dbContext.ContactSubmissions.Add(CreateSubmission("Jane Doe", "jane@example.com", submissionId));
            await dbContext.SaveChangesAsync();
        });
        using var client = CreateAdminClient(factory);

        var response = await client.PatchAsJsonAsync(
            $"/api/admin/contact-submissions/{submissionId}/status",
            new { status = ContactSubmissionStatus.Reviewed });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<AdminContactSubmissionDto>();
        Assert.NotNull(body);
        Assert.Equal(ContactSubmissionStatus.Reviewed, body.Status);
        Assert.NotNull(body.ReviewedAtUtc);

        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
        var submission = await dbContext.ContactSubmissions.SingleAsync();
        var auditLogEntry = await dbContext.AuditLogEntries
            .SingleAsync(entry => entry.Action == "ContactSubmissionStatusUpdated");

        Assert.Equal(ContactSubmissionStatus.Reviewed, submission.Status);
        Assert.NotNull(submission.ReviewedAtUtc);
        Assert.Equal("admin-1", auditLogEntry.ActorId);
        Assert.Equal(nameof(ContactSubmission), auditLogEntry.ResourceType);
        Assert.Equal(submissionId.ToString(), auditLogEntry.ResourceId);
        Assert.Contains("\"oldStatus\":\"New\"", auditLogEntry.MetadataJson);
        Assert.Contains("\"newStatus\":\"Reviewed\"", auditLogEntry.MetadataJson);
    }

    [Fact]
    public async Task InvalidStatusReturnsBadRequest()
    {
        var submissionId = Guid.NewGuid();
        await using var factory = CreateAdminFactory(async dbContext =>
        {
            dbContext.ContactSubmissions.Add(CreateSubmission("Jane Doe", "jane@example.com", submissionId));
            await dbContext.SaveChangesAsync();
        });
        using var client = CreateAdminClient(factory);

        var response = await client.PatchAsJsonAsync(
            $"/api/admin/contact-submissions/{submissionId}/status",
            new { status = "Deleted" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task MissingSubmissionReturnsNotFound()
    {
        await using var factory = CreateAdminFactory();
        using var client = CreateAdminClient(factory);

        var response = await client.GetAsync($"/api/admin/contact-submissions/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private static WebApplicationFactory<Program> CreateAdminFactory(
        Func<PortfolioDbContext, Task>? seed = null)
    {
        var databaseName = $"admin-contact-tests-{Guid.NewGuid()}";
        var settings = new Dictionary<string, string?>
        {
            ["Security:IpHashSalt"] = "test-salt",
            ["RateLimiting:GlobalPermitLimit"] = "100"
        };

        var factory = new WebApplicationFactory<Program>()
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
                    services.AddScoped<IAdminContactSubmissionService, AdminContactSubmissionService>();
                    services.AddAuthentication(TestAuthScheme)
                        .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthScheme, _ => { });
                });
            });

        if (seed is null)
        {
            return factory;
        }

        using var scope = factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
        seed(dbContext).GetAwaiter().GetResult();

        return factory;
    }

    private static HttpClient CreateAdminClient(WebApplicationFactory<Program> factory)
    {
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Test-User", "admin-1");
        client.DefaultRequestHeaders.Add("X-Test-Role", "Admin");

        return client;
    }

    private static ContactSubmission CreateSubmission(
        string name,
        string email,
        Guid? id = null)
    {
        return new ContactSubmission
        {
            Id = id ?? Guid.NewGuid(),
            Name = name,
            Email = email,
            Message = "Hello, this message is long enough.",
            CreatedAtUtc = DateTimeOffset.UtcNow,
            Status = ContactSubmissionStatus.New,
            UserAgent = "AdminContactSubmissionEndpointTests/1.0"
        };
    }

    private sealed class TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder) : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
    {
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("X-Test-User", out var userId))
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new("sub", userId.ToString())
            };

            if (Request.Headers.TryGetValue("X-Test-Role", out var role))
            {
                claims.Add(new Claim("role", role.ToString()));
            }

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
