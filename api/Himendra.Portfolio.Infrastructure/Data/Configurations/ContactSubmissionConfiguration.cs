using Himendra.Portfolio.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Himendra.Portfolio.Infrastructure.Data.Configurations;

public sealed class ContactSubmissionConfiguration : IEntityTypeConfiguration<ContactSubmission>
{
    public void Configure(EntityTypeBuilder<ContactSubmission> builder)
    {
        builder.ToTable("contact_submissions");

        builder.HasKey(contactSubmission => contactSubmission.Id)
            .HasName("pk_contact_submissions");

        builder.Property(contactSubmission => contactSubmission.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(contactSubmission => contactSubmission.Name)
            .HasColumnName("name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(contactSubmission => contactSubmission.Email)
            .HasColumnName("email")
            .HasMaxLength(320)
            .IsRequired();

        builder.Property(contactSubmission => contactSubmission.Message)
            .HasColumnName("message")
            .HasMaxLength(5000)
            .IsRequired();

        builder.Property(contactSubmission => contactSubmission.SourceIpHash)
            .HasColumnName("source_ip_hash")
            .HasMaxLength(128);

        builder.Property(contactSubmission => contactSubmission.UserAgent)
            .HasColumnName("user_agent")
            .HasMaxLength(512);

        builder.Property(contactSubmission => contactSubmission.CreatedAtUtc)
            .HasColumnName("created_at_utc")
            .IsRequired();

        builder.Property(contactSubmission => contactSubmission.ReviewedAtUtc)
            .HasColumnName("reviewed_at_utc");

        builder.Property(contactSubmission => contactSubmission.Status)
            .HasColumnName("status")
            .HasMaxLength(32)
            .HasDefaultValue(ContactSubmissionStatus.New)
            .IsRequired();

        builder.HasIndex(contactSubmission => contactSubmission.CreatedAtUtc)
            .HasDatabaseName("ix_contact_submissions_created_at_utc");

        builder.HasIndex(contactSubmission => contactSubmission.Status)
            .HasDatabaseName("ix_contact_submissions_status");
    }
}
