using Himendra.Portfolio.Application.Contact;
using Himendra.Portfolio.Application.Security;
using Himendra.Portfolio.Infrastructure.Contact;
using Himendra.Portfolio.Infrastructure.Data;
using Himendra.Portfolio.Infrastructure.Options;
using Himendra.Portfolio.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
            return services;
        }

        services.AddDbContext<PortfolioDbContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddScoped<IContactSubmissionService, ContactSubmissionService>();

        return services;
    }
}
