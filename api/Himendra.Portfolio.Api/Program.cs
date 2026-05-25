using Himendra.Portfolio.Api;
using Himendra.Portfolio.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1_048_576;
});

builder.Services.AddApiServices(builder.Configuration, builder.Environment);

var app = builder.Build();

app.ConfigureApiPipeline();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

if (args.Contains("--migrate-database", StringComparer.OrdinalIgnoreCase))
{
    logger.LogInformation("Running database migrations");
    Environment.ExitCode = await DatabaseMigrationRunner.RunAsync(app.Services, builder.Configuration, logger);
    return;
}

logger.LogInformation("Starting {ServiceName}", "Himendra.Portfolio.Api");

app.Run();

public partial class Program;
