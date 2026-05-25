using System.Text.RegularExpressions;
using Himendra.Portfolio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NpgsqlTypes;

namespace Himendra.Portfolio.Api;

internal static partial class DatabaseMigrationRunner
{
    public static async Task<int> RunAsync(IServiceProvider services, IConfiguration configuration, ILogger logger)
    {
        using var scope = services.CreateScope();
        await using var dbContext = CreateMigrationDbContext(scope.ServiceProvider, configuration);

        if (dbContext is null)
        {
            logger.LogError("Database migrations require database configuration");
            return 1;
        }

        await EnsureAppRoleAsync(dbContext, configuration, logger);
        await dbContext.Database.MigrateAsync();
        await EnsureRequiredSchemaAsync(dbContext);
        logger.LogInformation("Database migrations completed");

        return 0;
    }

    private static async Task EnsureRequiredSchemaAsync(PortfolioDbContext dbContext)
    {
        await dbContext.Database.ExecuteSqlRawAsync(
            """
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id uuid PRIMARY KEY,
                name character varying(200) NOT NULL,
                email character varying(320) NOT NULL,
                message character varying(5000) NOT NULL,
                source_ip_hash character varying(128),
                user_agent character varying(512),
                created_at_utc timestamp with time zone NOT NULL,
                reviewed_at_utc timestamp with time zone,
                status character varying(32) NOT NULL DEFAULT 'New'
            );

            CREATE TABLE IF NOT EXISTS audit_log_entries (
                id uuid PRIMARY KEY,
                actor_id character varying(200),
                action character varying(200) NOT NULL,
                resource_type character varying(200),
                resource_id character varying(200),
                ip_hash character varying(128),
                user_agent character varying(512),
                created_at_utc timestamp with time zone NOT NULL,
                metadata_json jsonb
            );

            CREATE INDEX IF NOT EXISTS ix_contact_submissions_created_at_utc
                ON contact_submissions(created_at_utc);
            CREATE INDEX IF NOT EXISTS ix_contact_submissions_status
                ON contact_submissions(status);
            CREATE INDEX IF NOT EXISTS ix_audit_log_entries_created_at_utc
                ON audit_log_entries(created_at_utc);
            CREATE INDEX IF NOT EXISTS ix_audit_log_entries_actor_id
                ON audit_log_entries(actor_id);

            ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
            ALTER TABLE contact_submissions FORCE ROW LEVEL SECURITY;
            ALTER TABLE audit_log_entries ENABLE ROW LEVEL SECURITY;
            ALTER TABLE audit_log_entries FORCE ROW LEVEL SECURITY;

            GRANT USAGE ON SCHEMA public TO portfolio_app;
            GRANT SELECT, INSERT, UPDATE ON contact_submissions TO portfolio_app;
            GRANT SELECT, INSERT ON audit_log_entries TO portfolio_app;

            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'public'
                      AND tablename = 'contact_submissions'
                      AND policyname = 'contact_submissions_app_insert'
                ) THEN
                    CREATE POLICY contact_submissions_app_insert
                        ON contact_submissions
                        FOR INSERT
                        TO portfolio_app
                        WITH CHECK (true);
                END IF;

                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'public'
                      AND tablename = 'contact_submissions'
                      AND policyname = 'contact_submissions_app_select'
                ) THEN
                    CREATE POLICY contact_submissions_app_select
                        ON contact_submissions
                        FOR SELECT
                        TO portfolio_app
                        USING (true);
                END IF;

                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'public'
                      AND tablename = 'contact_submissions'
                      AND policyname = 'contact_submissions_app_update'
                ) THEN
                    CREATE POLICY contact_submissions_app_update
                        ON contact_submissions
                        FOR UPDATE
                        TO portfolio_app
                        USING (true)
                        WITH CHECK (true);
                END IF;

                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'public'
                      AND tablename = 'audit_log_entries'
                      AND policyname = 'audit_log_entries_app_insert'
                ) THEN
                    CREATE POLICY audit_log_entries_app_insert
                        ON audit_log_entries
                        FOR INSERT
                        TO portfolio_app
                        WITH CHECK (true);
                END IF;

                IF NOT EXISTS (
                    SELECT 1 FROM pg_policies
                    WHERE schemaname = 'public'
                      AND tablename = 'audit_log_entries'
                      AND policyname = 'audit_log_entries_app_select'
                ) THEN
                    CREATE POLICY audit_log_entries_app_select
                        ON audit_log_entries
                        FOR SELECT
                        TO portfolio_app
                        USING (true);
                END IF;
            END $$;
            """);
    }

    private static async Task EnsureAppRoleAsync(
        PortfolioDbContext dbContext,
        IConfiguration configuration,
        ILogger logger)
    {
        var username = configuration["Database:Username"];
        var password = configuration["Database:Password"];

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogInformation("Database app role credentials were not configured; skipping role initialization");
            return;
        }

        if (!DatabaseRoleNamePattern().IsMatch(username))
        {
            throw new InvalidOperationException("Database app role username contains unsupported characters.");
        }

        var connection = (NpgsqlConnection)dbContext.Database.GetDbConnection();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            DO $$
            DECLARE
                app_username text := current_setting('app.migration_username');
                app_password text := current_setting('app.migration_password');
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = app_username) THEN
                    EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', app_username, app_password);
                ELSE
                    EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L', app_username, app_password);
                END IF;
            END $$;
            """;

        if (connection.State != System.Data.ConnectionState.Open)
        {
            await connection.OpenAsync();
        }

        await using var setUsername = connection.CreateCommand();
        setUsername.CommandText = "SELECT set_config('app.migration_username', @username, false);";
        setUsername.Parameters.Add(new NpgsqlParameter("username", NpgsqlDbType.Text) { Value = username });
        await setUsername.ExecuteNonQueryAsync();

        await using var setPassword = connection.CreateCommand();
        setPassword.CommandText = "SELECT set_config('app.migration_password', @password, false);";
        setPassword.Parameters.Add(new NpgsqlParameter("password", NpgsqlDbType.Text) { Value = password });
        await setPassword.ExecuteNonQueryAsync();

        await command.ExecuteNonQueryAsync();

        logger.LogInformation("Database app role {DatabaseRole} is ready", username);
    }

    private static PortfolioDbContext? CreateMigrationDbContext(IServiceProvider services, IConfiguration configuration)
    {
        var migrationConnectionString = BuildMigrationConnectionString(configuration);

        if (migrationConnectionString is null)
        {
            return services.GetService<PortfolioDbContext>();
        }

        var options = new DbContextOptionsBuilder<PortfolioDbContext>()
            .UseNpgsql(migrationConnectionString)
            .Options;

        return new PortfolioDbContext(options);
    }

    private static string? BuildMigrationConnectionString(IConfiguration configuration)
    {
        var host = configuration["Migration:Database:Host"];
        var username = configuration["Migration:Database:Username"];
        var password = configuration["Migration:Database:Password"];

        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password))
        {
            return null;
        }

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = host,
            Database = configuration["Migration:Database:Name"] ?? "portfolio",
            Username = username,
            Password = password,
            SslMode = Enum.TryParse<SslMode>(configuration["Migration:Database:SslMode"], ignoreCase: true, out var sslMode)
                ? sslMode
                : SslMode.Require
        };

        if (int.TryParse(configuration["Migration:Database:Port"], out var port))
        {
            builder.Port = port;
        }

        return builder.ConnectionString;
    }

    [GeneratedRegex("^[a-zA-Z_][a-zA-Z0-9_]{0,62}$")]
    private static partial Regex DatabaseRoleNamePattern();
}
