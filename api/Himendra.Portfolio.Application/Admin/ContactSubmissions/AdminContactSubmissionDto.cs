namespace Himendra.Portfolio.Application.Admin.ContactSubmissions;

public sealed record AdminContactSubmissionDto(
    Guid Id,
    string Name,
    string Email,
    string Message,
    string Status,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset? ReviewedAtUtc,
    string? UserAgent);

public sealed record PagedAdminContactSubmissionsResponse(
    IReadOnlyList<AdminContactSubmissionDto> Items,
    int Page,
    int PageSize,
    int TotalCount);
