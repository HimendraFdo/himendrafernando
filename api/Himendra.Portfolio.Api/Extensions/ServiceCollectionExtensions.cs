using System.Security.Claims;
using System.Threading.RateLimiting;
using Himendra.Portfolio.Api.Options;
using Himendra.Portfolio.Api.Security;
using Microsoft.AspNetCore.RateLimiting;

namespace Himendra.Portfolio.Api.Extensions;

public static class ServiceCollectionExtensions
{
    private const string CorsPolicyName = "ConfiguredOrigins";
    private const string LocalViteOrigin = "http://localhost:5173";

    public static IServiceCollection AddApiServices(
        this IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        services.Configure<FrontendCorsOptions>(configuration.GetSection(FrontendCorsOptions.SectionName));
        services.Configure<RateLimitingOptions>(configuration.GetSection(RateLimitingOptions.SectionName));

        services.AddProblemDetails();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        });

        services.AddCors(options =>
        {
            options.AddPolicy(CorsPolicyName, policy =>
            {
                var corsOptions = configuration
                    .GetSection(FrontendCorsOptions.SectionName)
                    .Get<FrontendCorsOptions>() ?? new FrontendCorsOptions();

                var allowedOrigins = corsOptions.AllowedOrigins;

                if (environment.IsDevelopment() && allowedOrigins.Length == 0)
                {
                    allowedOrigins = [LocalViteOrigin];
                }

                policy.WithOrigins(allowedOrigins)
                    .WithMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                    .WithHeaders("Content-Type", "Authorization");
            });
        });

        services.AddRateLimiter(options =>
        {
            var rateLimitingOptions = configuration
                .GetSection(RateLimitingOptions.SectionName)
                .Get<RateLimitingOptions>() ?? new RateLimitingOptions();

            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    GetClientPartitionKey(context),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        AutoReplenishment = true,
                        PermitLimit = rateLimitingOptions.GlobalPermitLimit,
                        QueueLimit = 0,
                        Window = TimeSpan.FromSeconds(rateLimitingOptions.GlobalWindowSeconds)
                    }));

            options.AddPolicy(RateLimitPolicies.Global, context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    GetClientPartitionKey(context),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        AutoReplenishment = true,
                        PermitLimit = rateLimitingOptions.GlobalPermitLimit,
                        QueueLimit = 0,
                        Window = TimeSpan.FromSeconds(rateLimitingOptions.GlobalWindowSeconds)
                    }));

            options.AddPolicy(RateLimitPolicies.Contact, context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    GetClientPartitionKey(context),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        AutoReplenishment = true,
                        PermitLimit = rateLimitingOptions.ContactPermitLimit,
                        QueueLimit = 0,
                        Window = TimeSpan.FromSeconds(rateLimitingOptions.ContactWindowSeconds)
                    }));

            options.OnRejected = async (context, cancellationToken) =>
            {
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                {
                    context.HttpContext.Response.Headers["Retry-After"] =
                        Math.Ceiling(retryAfter.TotalSeconds).ToString(System.Globalization.CultureInfo.InvariantCulture);
                }

                await Results.Problem(
                    title: "Too many requests.",
                    statusCode: StatusCodes.Status429TooManyRequests)
                    .ExecuteAsync(context.HttpContext);
            };
        });

        return services;
    }

    public static string ConfiguredCorsPolicyName => CorsPolicyName;

    private static string GetClientPartitionKey(HttpContext context)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!string.IsNullOrWhiteSpace(userId))
        {
            return $"user:{userId}";
        }

        if (context.User.Identity?.IsAuthenticated == true &&
            !string.IsNullOrWhiteSpace(context.User.Identity.Name))
        {
            return $"user:{context.User.Identity.Name}";
        }

        return $"ip:{context.Connection.RemoteIpAddress?.ToString() ?? "unknown"}";
    }
}
