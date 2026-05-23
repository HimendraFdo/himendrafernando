using Himendra.Portfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Himendra.Portfolio.Infrastructure.Data.Configurations;

public sealed class AuditLogEntryConfiguration : IEntityTypeConfiguration<AuditLogEntry>
{
    public void Configure(EntityTypeBuilder<AuditLogEntry> builder)
    {
        builder.ToTable("audit_log_entries");

        builder.HasKey(auditLogEntry => auditLogEntry.Id)
            .HasName("pk_audit_log_entries");

        builder.Property(auditLogEntry => auditLogEntry.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(auditLogEntry => auditLogEntry.ActorId)
            .HasColumnName("actor_id")
            .HasMaxLength(200);

        builder.Property(auditLogEntry => auditLogEntry.Action)
            .HasColumnName("action")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(auditLogEntry => auditLogEntry.ResourceType)
            .HasColumnName("resource_type")
            .HasMaxLength(200);

        builder.Property(auditLogEntry => auditLogEntry.ResourceId)
            .HasColumnName("resource_id")
            .HasMaxLength(200);

        builder.Property(auditLogEntry => auditLogEntry.IpHash)
            .HasColumnName("ip_hash")
            .HasMaxLength(128);

        builder.Property(auditLogEntry => auditLogEntry.UserAgent)
            .HasColumnName("user_agent")
            .HasMaxLength(512);

        builder.Property(auditLogEntry => auditLogEntry.CreatedAtUtc)
            .HasColumnName("created_at_utc")
            .IsRequired();

        builder.Property(auditLogEntry => auditLogEntry.MetadataJson)
            .HasColumnName("metadata_json")
            .HasColumnType("jsonb");

        builder.HasIndex(auditLogEntry => auditLogEntry.CreatedAtUtc)
            .HasDatabaseName("ix_audit_log_entries_created_at_utc");

        builder.HasIndex(auditLogEntry => auditLogEntry.ActorId)
            .HasDatabaseName("ix_audit_log_entries_actor_id");
    }
}
