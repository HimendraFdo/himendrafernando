using System.Security.Claims;
using Himendra.Portfolio.Api.Auth;
using Himendra.Portfolio.Application.Admin.ContactSubmissions;
using Himendra.Portfolio.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Himendra.Portfolio.Api.Endpoints;

public static class AdminContactSubmissionEndpoints
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    public static IEndpointRouteBuilder MapAdminContactSubmissionEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints
            .MapGroup("/api/admin/contact-submissions")
            .RequireAuthorization(AuthPolicies.AdminOnly)
            .WithTags("Admin Contact Submissions");

        group.MapGet("", async (
            [FromQuery] string? status,
            [FromQuery] int? page,
            [FromQuery] int? pageSize,
            [FromServices] IAdminContactSubmissionService service,
            CancellationToken cancellationToken) =>
        {
            var resolvedPage = Math.Max(page ?? DefaultPage, DefaultPage);
            var resolvedPageSize = Math.Clamp(pageSize ?? DefaultPageSize, 1, MaxPageSize);

            if (!IsValidStatus(status))
            {
                return Results.BadRequest(new { error = "Invalid contact submission status." });
            }

            var response = await service.ListAsync(status, resolvedPage, resolvedPageSize, cancellationToken);

            return Results.Ok(response);
        })
        .WithName("ListAdminContactSubmissions")
        .Produces<PagedAdminContactSubmissionsResponse>()
        .Produces<ProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<ProblemDetails>(StatusCodes.Status403Forbidden)
        .WithOpenApi();

        group.MapGet("/{id:guid}", async (
            Guid id,
            HttpContext httpContext,
            [FromServices] IAdminContactSubmissionService service,
            CancellationToken cancellationToken) =>
        {
            var response = await service.GetByIdAsync(
                id,
                GetActorId(httpContext.User),
                httpContext.Request.Headers.UserAgent.ToString(),
                cancellationToken);

            return response is null ? Results.NotFound() : Results.Ok(response);
        })
        .WithName("GetAdminContactSubmission")
        .Produces<AdminContactSubmissionDto>()
        .Produces(StatusCodes.Status404NotFound)
        .Produces<ProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<ProblemDetails>(StatusCodes.Status403Forbidden)
        .WithOpenApi();

        group.MapPatch("/{id:guid}/status", async (
            Guid id,
            [FromBody] UpdateContactSubmissionStatusRequest request,
            HttpContext httpContext,
            [FromServices] IAdminContactSubmissionService service,
            CancellationToken cancellationToken) =>
        {
            var trimmedStatus = request.Status?.Trim();

            if (!IsValidStatus(trimmedStatus))
            {
                return Results.BadRequest(new { error = "Invalid contact submission status." });
            }

            var response = await service.UpdateStatusAsync(
                id,
                request with { Status = trimmedStatus },
                GetActorId(httpContext.User),
                httpContext.Request.Headers.UserAgent.ToString(),
                cancellationToken);

            return response is null ? Results.NotFound() : Results.Ok(response);
        })
        .WithName("UpdateAdminContactSubmissionStatus")
        .Accepts<UpdateContactSubmissionStatusRequest>("application/json")
        .Produces<AdminContactSubmissionDto>()
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces<ProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<ProblemDetails>(StatusCodes.Status403Forbidden)
        .WithOpenApi();

        return endpoints;
    }

    private static bool IsValidStatus(string? status)
    {
        return string.IsNullOrWhiteSpace(status) ||
            status is ContactSubmissionStatus.New or
                ContactSubmissionStatus.Reviewed or
                ContactSubmissionStatus.Archived or
                ContactSubmissionStatus.Spam;
    }

    private static string? GetActorId(ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier) ??
            user.FindFirstValue("sub") ??
            user.Identity?.Name;
    }
}
