using System;
using Himendra.Portfolio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Himendra.Portfolio.Infrastructure.Migrations;

[DbContext(typeof(PortfolioDbContext))]
partial class PortfolioDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.22")
            .HasAnnotation("Relational:MaxIdentifierLength", 63);

        modelBuilder.Entity("Himendra.Portfolio.Domain.Entities.AuditLogEntry", b =>
        {
            b.Property<Guid>("Id")
                .ValueGeneratedNever()
                .HasColumnType("uuid")
                .HasColumnName("id");

            b.Property<string>("Action")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("character varying(200)")
                .HasColumnName("action");

            b.Property<string>("ActorId")
                .HasMaxLength(200)
                .HasColumnType("character varying(200)")
                .HasColumnName("actor_id");

            b.Property<DateTimeOffset>("CreatedAtUtc")
                .HasColumnType("timestamp with time zone")
                .HasColumnName("created_at_utc");

            b.Property<string>("IpHash")
                .HasMaxLength(128)
                .HasColumnType("character varying(128)")
                .HasColumnName("ip_hash");

            b.Property<string>("MetadataJson")
                .HasColumnType("jsonb")
                .HasColumnName("metadata_json");

            b.Property<string>("ResourceId")
                .HasMaxLength(200)
                .HasColumnType("character varying(200)")
                .HasColumnName("resource_id");

            b.Property<string>("ResourceType")
                .HasMaxLength(200)
                .HasColumnType("character varying(200)")
                .HasColumnName("resource_type");

            b.Property<string>("UserAgent")
                .HasMaxLength(512)
                .HasColumnType("character varying(512)")
                .HasColumnName("user_agent");

            b.HasKey("Id")
                .HasName("pk_audit_log_entries");

            b.HasIndex("ActorId")
                .HasDatabaseName("ix_audit_log_entries_actor_id");

            b.HasIndex("CreatedAtUtc")
                .HasDatabaseName("ix_audit_log_entries_created_at_utc");

            b.ToTable("audit_log_entries", (string)null);
        });

        modelBuilder.Entity("Himendra.Portfolio.Domain.Entities.ContactSubmission", b =>
        {
            b.Property<Guid>("Id")
                .ValueGeneratedNever()
                .HasColumnType("uuid")
                .HasColumnName("id");

            b.Property<DateTimeOffset>("CreatedAtUtc")
                .HasColumnType("timestamp with time zone")
                .HasColumnName("created_at_utc");

            b.Property<string>("Email")
                .IsRequired()
                .HasMaxLength(320)
                .HasColumnType("character varying(320)")
                .HasColumnName("email");

            b.Property<string>("Message")
                .IsRequired()
                .HasMaxLength(5000)
                .HasColumnType("character varying(5000)")
                .HasColumnName("message");

            b.Property<string>("Name")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("character varying(200)")
                .HasColumnName("name");

            b.Property<DateTimeOffset?>("ReviewedAtUtc")
                .HasColumnType("timestamp with time zone")
                .HasColumnName("reviewed_at_utc");

            b.Property<string>("SourceIpHash")
                .HasMaxLength(128)
                .HasColumnType("character varying(128)")
                .HasColumnName("source_ip_hash");

            b.Property<string>("Status")
                .IsRequired()
                .ValueGeneratedOnAdd()
                .HasMaxLength(32)
                .HasColumnType("character varying(32)")
                .HasColumnName("status")
                .HasDefaultValue("New");

            b.Property<string>("UserAgent")
                .HasMaxLength(512)
                .HasColumnType("character varying(512)")
                .HasColumnName("user_agent");

            b.HasKey("Id")
                .HasName("pk_contact_submissions");

            b.HasIndex("CreatedAtUtc")
                .HasDatabaseName("ix_contact_submissions_created_at_utc");

            b.HasIndex("Status")
                .HasDatabaseName("ix_contact_submissions_status");

            b.ToTable("contact_submissions", (string)null);
        });
    }
}
