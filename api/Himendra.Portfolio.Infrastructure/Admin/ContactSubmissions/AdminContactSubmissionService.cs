using System.Text.Json;
using Himendra.Portfolio.Application.Admin.ContactSubmissions;
using Himendra.Portfolio.Domain.Entities;
using Himendra.Portfolio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Himendra.Portfolio.Infrastructure.Admin.ContactSubmissions;

public sealed class AdminContactSubmissionService(PortfolioDbContext dbContext) : IAdminContactSubmissionService
{
    private const int UserAgentMaxLength = 512;

    public async Task<PagedAdminContactSubmissionsResponse> ListAsync(
        string? status,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var query = dbContext.ContactSubmissions.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(submission => submission.Status == status);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(submission => submission.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(submission => ToDto(submission))
            .ToListAsync(cancellationToken);

        return new PagedAdminContactSubmissionsResponse(items, page, pageSize, totalCount);
    }

    public async Task<AdminContactSubmissionDto?> GetByIdAsync(
        Guid id,
        string? actorId,
        string? userAgent,
        CancellationToken cancellationToken)
    {
        var submission = await dbContext.ContactSubmissions
            .AsNoTracking()
            .SingleOrDefaultAsync(contactSubmission => contactSubmission.Id == id, cancellationToken);

        if (submission is null)
        {
            return null;
        }

        dbContext.AuditLogEntries.Add(new AuditLogEntry
        {
            Id = Guid.NewGuid(),
            ActorId = actorId,
            Action = "ContactSubmissionViewed",
            ResourceType = nameof(ContactSubmission),
            ResourceId = id.ToString(),
            UserAgent = Truncate(userAgent, UserAgentMaxLength),
            CreatedAtUtc = DateTimeOffset.UtcNow,
            MetadataJson = null
        });

        await dbContext.SaveChangesAsync(cancellationToken);

        return ToDto(submission);
    }

    public async Task<AdminContactSubmissionDto?> UpdateStatusAsync(
        Guid id,
        UpdateContactSubmissionStatusRequest request,
        string? actorId,
        string? userAgent,
        CancellationToken cancellationToken)
    {
        var submission = await dbContext.ContactSubmissions
            .SingleOrDefaultAsync(contactSubmission => contactSubmission.Id == id, cancellationToken);

        if (submission is null)
        {
            return null;
        }

        var oldStatus = submission.Status;
        var newStatus = request.Status!;

        if (!string.Equals(oldStatus, newStatus, StringComparison.Ordinal))
        {
            submission.Status = newStatus;

            if (string.Equals(oldStatus, ContactSubmissionStatus.New, StringComparison.Ordinal) &&
                IsReviewedTerminalStatus(newStatus) &&
                submission.ReviewedAtUtc is null)
            {
                submission.ReviewedAtUtc = DateTimeOffset.UtcNow;
            }

            dbContext.AuditLogEntries.Add(new AuditLogEntry
            {
                Id = Guid.NewGuid(),
                ActorId = actorId,
                Action = "ContactSubmissionStatusUpdated",
                ResourceType = nameof(ContactSubmission),
                ResourceId = id.ToString(),
                UserAgent = Truncate(userAgent, UserAgentMaxLength),
                CreatedAtUtc = DateTimeOffset.UtcNow,
                MetadataJson = JsonSerializer.Serialize(new
                {
                    oldStatus,
                    newStatus
                })
            });
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return ToDto(submission);
    }

    private static bool IsReviewedTerminalStatus(string status)
    {
        return status is ContactSubmissionStatus.Reviewed or
            ContactSubmissionStatus.Archived or
            ContactSubmissionStatus.Spam;
    }

    private static AdminContactSubmissionDto ToDto(ContactSubmission submission)
    {
        return new AdminContactSubmissionDto(
            submission.Id,
            submission.Name,
            submission.Email,
            submission.Message,
            submission.Status,
            submission.CreatedAtUtc,
            submission.ReviewedAtUtc,
            submission.UserAgent);
    }

    private static string? Truncate(string? value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();

        return trimmed.Length <= maxLength ? trimmed : trimmed[..maxLength];
    }
}
