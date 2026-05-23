namespace Himendra.Portfolio.Application.Admin.ContactSubmissions;

public interface IAdminContactSubmissionService
{
    Task<PagedAdminContactSubmissionsResponse> ListAsync(
        string? status,
        int page,
        int pageSize,
        CancellationToken cancellationToken);

    Task<AdminContactSubmissionDto?> GetByIdAsync(
        Guid id,
        string? actorId,
        string? userAgent,
        CancellationToken cancellationToken);

    Task<AdminContactSubmissionDto?> UpdateStatusAsync(
        Guid id,
        UpdateContactSubmissionStatusRequest request,
        string? actorId,
        string? userAgent,
        CancellationToken cancellationToken);
}
