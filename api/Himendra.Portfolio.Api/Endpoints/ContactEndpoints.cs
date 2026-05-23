using System.ComponentModel.DataAnnotations;
using Himendra.Portfolio.Api.Security;
using Himendra.Portfolio.Application.Contact;
using Microsoft.AspNetCore.Mvc;

namespace Himendra.Portfolio.Api.Endpoints;

public static class ContactEndpoints
{
    public static IEndpointRouteBuilder MapContactEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/contact", async (
            SubmitContactRequest request,
            HttpContext httpContext,
            IServiceProvider serviceProvider,
            CancellationToken cancellationToken) =>
        {
            var trimmedRequest = request.Trimmed();
            var validationErrors = Validate(trimmedRequest);

            if (validationErrors.Count > 0)
            {
                return Results.ValidationProblem(validationErrors);
            }

            var contactSubmissionService = serviceProvider.GetRequiredService<IContactSubmissionService>();
            var response = await contactSubmissionService.SubmitAsync(
                trimmedRequest,
                httpContext.Connection.RemoteIpAddress?.ToString(),
                httpContext.Request.Headers.UserAgent.ToString(),
                cancellationToken);

            return Results.Created($"/api/contact/{response.Id}", response);
        })
        .RequireRateLimiting(RateLimitPolicies.Contact)
        .WithName("SubmitContact")
        .Accepts<SubmitContactRequest>("application/json")
        .Produces<SubmitContactResponse>(StatusCodes.Status201Created)
        .ProducesValidationProblem()
        .Produces<ProblemDetails>(StatusCodes.Status429TooManyRequests)
        .WithOpenApi();

        return endpoints;
    }

    private static Dictionary<string, string[]> Validate(SubmitContactRequest request)
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(request);

        Validator.TryValidateObject(
            request,
            validationContext,
            validationResults,
            validateAllProperties: true);

        foreach (var propertyName in new[] { nameof(request.Name), nameof(request.Email), nameof(request.Message) })
        {
            var propertyValue = propertyName switch
            {
                nameof(request.Name) => request.Name,
                nameof(request.Email) => request.Email,
                nameof(request.Message) => request.Message,
                _ => null
            };

            if (string.IsNullOrWhiteSpace(propertyValue))
            {
                validationResults.Add(new ValidationResult(
                    $"{propertyName} is required.",
                    [propertyName]));
            }
        }

        return validationResults
            .SelectMany(result => result.MemberNames.DefaultIfEmpty(string.Empty)
                .Select(memberName => new
                {
                    MemberName = ToCamelCase(memberName),
                    Error = result.ErrorMessage ?? "The value is invalid."
                }))
            .GroupBy(error => error.MemberName)
            .ToDictionary(
                group => group.Key,
                group => group.Select(error => error.Error).Distinct().ToArray());
    }

    private static string ToCamelCase(string value)
    {
        if (string.IsNullOrEmpty(value) || char.IsLower(value[0]))
        {
            return value;
        }

        return char.ToLowerInvariant(value[0]) + value[1..];
    }
}
