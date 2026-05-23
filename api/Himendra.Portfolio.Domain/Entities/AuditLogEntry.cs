namespace Himendra.Portfolio.Domain.Entities;

public sealed class AuditLogEntry
{
    public Guid Id { get; set; }

    public string? ActorId { get; set; }

    public required string Action { get; set; }

    public string? ResourceType { get; set; }

    public string? ResourceId { get; set; }

    public string? IpHash { get; set; }

    public string? UserAgent { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public string? MetadataJson { get; set; }
}
