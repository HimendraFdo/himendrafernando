using Himendra.Portfolio.Application.Contact;
using Himendra.Portfolio.Application.Security;
using Himendra.Portfolio.Domain.Entities;
using Himendra.Portfolio.Infrastructure.Data;

namespace Himendra.Portfolio.Infrastructure.Contact;

public sealed class ContactSubmissionService(
    PortfolioDbContext dbContext,
    IIpHashService ipHashService) : IContactSubmissionService
{
    private const int UserAgentMaxLength = 512;
    private const string SuccessMessage = "Thanks for reaching out. I will get back to you soon.";

    public async Task<SubmitContactResponse> SubmitAsync(
        SubmitContactRequest request,
        string? sourceIpAddress,
        string? userAgent,
        CancellationToken cancellationToken)
    {
        var now = DateTimeOffset.UtcNow;
        var submissionId = Guid.NewGuid();
        var sourceIpHash = ipHashService.HashIpAddress(sourceIpAddress);
        var safeUserAgent = Truncate(userAgent, UserAgentMaxLength);

        var submission = new ContactSubmission
        {
            Id = submissionId,
            Name = request.Name!,
            Email = request.Email!,
            Message = request.Message!,
            CreatedAtUtc = now,
            Status = ContactSubmissionStatus.New,
            SourceIpHash = sourceIpHash,
            UserAgent = safeUserAgent
        };

        var auditLogEntry = new AuditLogEntry
        {
            Id = Guid.NewGuid(),
            Action = "ContactSubmissionCreated",
            ResourceType = nameof(ContactSubmission),
            ResourceId = submissionId.ToString(),
            ActorId = null,
            IpHash = sourceIpHash,
            UserAgent = safeUserAgent,
            CreatedAtUtc = now,
            MetadataJson = null
        };

        dbContext.ContactSubmissions.Add(submission);
        dbContext.AuditLogEntries.Add(auditLogEntry);

        await dbContext.SaveChangesAsync(cancellationToken);

        return new SubmitContactResponse(
            submissionId,
            "Received",
            SuccessMessage);
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
