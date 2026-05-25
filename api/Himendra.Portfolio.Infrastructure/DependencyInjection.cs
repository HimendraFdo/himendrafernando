using Himendra.Portfolio.Application.Contact;
using Himendra.Portfolio.Application.Security;
using Himendra.Portfolio.Application.Admin.ContactSubmissions;
using Himendra.Portfolio.Infrastructure.Admin.ContactSubmissions;
using Himendra.Portfolio.Infrastructure.Contact;
using Himendra.Portfolio.Infrastructure.Data;
using Himendra.Portfolio.Infrastructure.Options;
using Himendra.Portfolio.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Himendra.Portfolio.Infrastructure;

public static class DependencyInjection
{
    public const string PortfolioDatabaseConnectionName = "PortfolioDatabase";

    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        bool requireIpHashSalt = false)
    {
        services.Configure<SecurityOptions>(options =>
        {
            options.IpHashSalt = configuration[$"{SecurityOptions.SectionName}:IpHashSalt"] ?? string.Empty;
            options.RequireIpHashSalt = requireIpHashSalt;
        });
        services.AddScoped<IIpHashService, IpHashService>();

        var connectionString = configuration.GetConnectionString(PortfolioDatabaseConnectionName);

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            connectionString = BuildConnectionString(configuration);
        }

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return services;
        }

        services.AddDbContext<PortfolioDbContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddScoped<IContactSubmissionService, ContactSubmissionService>();
        services.AddScoped<IAdminContactSubmissionService, AdminContactSubmissionService>();

        return services;
    }

    private static string? BuildConnectionString(IConfiguration configuration)
    {
        var host = configuration["Database:Host"];
        var username = configuration["Database:Username"];
        var password = configuration["Database:Password"];

        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password))
        {
            return null;
        }

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = host,
            Database = configuration["Database:Name"] ?? "portfolio",
            Username = username,
            Password = password,
            SslMode = Enum.TryParse<SslMode>(configuration["Database:SslMode"], ignoreCase: true, out var sslMode)
                ? sslMode
                : SslMode.Require
        };

        if (int.TryParse(configuration["Database:Port"], out var port))
        {
            builder.Port = port;
        }

        return builder.ConnectionString;
    }
}
