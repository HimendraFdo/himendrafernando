using Himendra.Portfolio.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

app.ConfigureApiPipeline();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Starting {ServiceName}", "Himendra.Portfolio.Api");

app.Run();

public partial class Program;
