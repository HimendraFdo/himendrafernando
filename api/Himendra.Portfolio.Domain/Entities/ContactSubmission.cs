namespace Himendra.Portfolio.Domain.Entities;

public sealed class ContactSubmission
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    public required string Message { get; set; }

    public string? SourceIpHash { get; set; }

    public string? UserAgent { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public DateTimeOffset? ReviewedAtUtc { get; set; }

    public required string Status { get; set; }
}
