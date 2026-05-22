namespace Himendra.Portfolio.Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigureApiPipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors(ServiceCollectionExtensions.ConfiguredCorsPolicyName);

        app.MapGet("/", () => Results.Ok(new
        {
            name = "Himendra Fernando Portfolio API",
            status = "Running"
        }))
        .WithName("GetApiRoot")
        .WithOpenApi();

        app.MapGet("/health", () => Results.Ok(new
        {
            status = "Healthy",
            service = "Himendra.Portfolio.Api"
        }))
        .WithName("GetHealth")
        .WithOpenApi();

        return app;
    }
}
