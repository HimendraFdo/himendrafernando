using Himendra.Portfolio.Domain.Entities;
using Himendra.Portfolio.Infrastructure.Data;
using Himendra.Portfolio.Infrastructure.Migrations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Xunit;

namespace Himendra.Portfolio.Tests;

public sealed class DatabaseModelTests
{
    [Fact]
    public void ContactSubmissionMappingUsesExpectedTableColumnsAndIndexes()
    {
        using var dbContext = CreateDbContext();
        var entityType = dbContext.Model.FindEntityType(typeof(ContactSubmission));

        Assert.NotNull(entityType);
        Assert.Equal("contact_submissions", entityType.GetTableName());
        AssertColumnName(entityType, nameof(ContactSubmission.SourceIpHash), "source_ip_hash");
        AssertColumnName(entityType, nameof(ContactSubmission.CreatedAtUtc), "created_at_utc");
        Assert.Contains(entityType.GetIndexes(), index =>
            index.GetDatabaseName() == "ix_contact_submissions_created_at_utc");
        Assert.Contains(entityType.GetIndexes(), index =>
            index.GetDatabaseName() == "ix_contact_submissions_status");
    }

    [Fact]
    public void AuditLogEntryMappingUsesExpectedTableColumnsAndIndexes()
    {
        using var dbContext = CreateDbContext();
        var entityType = dbContext.Model.FindEntityType(typeof(AuditLogEntry));

        Assert.NotNull(entityType);
        Assert.Equal("audit_log_entries", entityType.GetTableName());
        AssertColumnName(entityType, nameof(AuditLogEntry.MetadataJson), "metadata_json");
        AssertColumnName(entityType, nameof(AuditLogEntry.CreatedAtUtc), "created_at_utc");
        Assert.Contains(entityType.GetIndexes(), index =>
            index.GetDatabaseName() == "ix_audit_log_entries_created_at_utc");
        Assert.Contains(entityType.GetIndexes(), index =>
            index.GetDatabaseName() == "ix_audit_log_entries_actor_id");
    }

    [Fact]
    public void InitialMigrationIncludesRowLevelSecuritySql()
    {
        var migration = new InspectableInitialDatabaseSecurityMigration();
        var operations = migration.GetUpOperations();

        var sql = string.Join(Environment.NewLine, operations.OfType<SqlOperation>().Select(operation => operation.Sql));

        Assert.Contains("ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY", sql);
        Assert.Contains("ALTER TABLE audit_log_entries ENABLE ROW LEVEL SECURITY", sql);
        Assert.Contains("ALTER TABLE contact_submissions FORCE ROW LEVEL SECURITY", sql);
        Assert.Contains("portfolio_app", sql);
        Assert.Contains("portfolio_admin", sql);
    }

    private static PortfolioDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<PortfolioDbContext>()
            .UseNpgsql("Host=localhost;Database=portfolio_test;Username=portfolio_test;Password=portfolio_test")
            .Options;

        return new PortfolioDbContext(options);
    }

    private static void AssertColumnName(IEntityType entityType, string propertyName, string expectedColumnName)
    {
        var storeObjectIdentifier = StoreObjectIdentifier.Table(
            entityType.GetTableName()!,
            entityType.GetSchema());

        Assert.Equal(expectedColumnName, entityType.FindProperty(propertyName)!.GetColumnName(storeObjectIdentifier));
    }

    private sealed class InspectableInitialDatabaseSecurityMigration : InitialDatabaseSecurity
    {
        public IReadOnlyList<MigrationOperation> GetUpOperations()
        {
            var migrationBuilder = new MigrationBuilder("Npgsql.EntityFrameworkCore.PostgreSQL");

            Up(migrationBuilder);

            return migrationBuilder.Operations;
        }
    }
}
