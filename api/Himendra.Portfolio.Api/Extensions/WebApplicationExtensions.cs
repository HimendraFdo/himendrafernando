using Microsoft.AspNetCore.Diagnostics;

namespace Himendra.Portfolio.Api.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigureApiPipeline(this WebApplication app)
    {
        app.UseExceptionHandler(exceptionHandlerApp =>
        {
            exceptionHandlerApp.Run(async context =>
            {
                var exceptionFeature = context.Features.Get<IExceptionHandlerFeature>();

                if (exceptionFeature?.Error is not null)
                {
                    var loggerFactory = context.RequestServices.GetRequiredService<ILoggerFactory>();
                    var logger = loggerFactory.CreateLogger("Himendra.Portfolio.Api.ExceptionHandler");
                    logger.LogError(exceptionFeature.Error, "Unhandled API exception");
                }

                await Results.Problem(
                    title: "An unexpected error occurred.",
                    statusCode: StatusCodes.Status500InternalServerError)
                    .ExecuteAsync(context);
            });
        });

        app.UseSecurityHeaders();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseCors(ServiceCollectionExtensions.ConfiguredCorsPolicyName);
        app.UseRateLimiter();

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

    private static WebApplication UseSecurityHeaders(this WebApplication app)
    {
        app.Use(async (context, next) =>
        {
            context.Response.Headers["X-Content-Type-Options"] = "nosniff";
            context.Response.Headers["X-Frame-Options"] = "DENY";
            context.Response.Headers["Referrer-Policy"] = "no-referrer";
            context.Response.Headers["X-XSS-Protection"] = "0";

            // TODO: Define Content-Security-Policy at the frontend or CDN layer once hosting is known.
            await next();
        });

        return app;
    }
}
