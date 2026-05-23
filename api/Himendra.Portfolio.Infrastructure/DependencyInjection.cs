using Himendra.Portfolio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Himendra.Portfolio.Infrastructure;

public static class DependencyInjection
{
    public const string PortfolioDatabaseConnectionName = "PortfolioDatabase";

    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString(PortfolioDatabaseConnectionName);

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return services;
        }

        services.AddDbContext<PortfolioDbContext>(options =>
            options.UseNpgsql(connectionString));

        return services;
    }

}
