using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Himendra.Portfolio.Infrastructure.Migrations;

public partial class InitialDatabaseSecurity : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "audit_log_entries",
            columns: table => new
            {
                id = table.Column<Guid>(type: "uuid", nullable: false),
                actor_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                action = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                resource_type = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                resource_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                ip_hash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                user_agent = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                created_at_utc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                metadata_json = table.Column<string>(type: "jsonb", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_audit_log_entries", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "contact_submissions",
            columns: table => new
            {
                id = table.Column<Guid>(type: "uuid", nullable: false),
                name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                email = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                message = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                source_ip_hash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                user_agent = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                created_at_utc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                reviewed_at_utc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false, defaultValue: "New")
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_contact_submissions", x => x.id);
            });

        migrationBuilder.CreateIndex(
            name: "ix_audit_log_entries_actor_id",
            table: "audit_log_entries",
            column: "actor_id");

        migrationBuilder.CreateIndex(
            name: "ix_audit_log_entries_created_at_utc",
            table: "audit_log_entries",
            column: "created_at_utc");

        migrationBuilder.CreateIndex(
            name: "ix_contact_submissions_created_at_utc",
            table: "contact_submissions",
            column: "created_at_utc");

        migrationBuilder.CreateIndex(
            name: "ix_contact_submissions_status",
            table: "contact_submissions",
            column: "status");

        migrationBuilder.Sql(
            """
            ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
            ALTER TABLE contact_submissions FORCE ROW LEVEL SECURITY;
            ALTER TABLE audit_log_entries ENABLE ROW LEVEL SECURITY;
            ALTER TABLE audit_log_entries FORCE ROW LEVEL SECURITY;

            DO $$
            BEGIN
                IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'portfolio_app') THEN
                    GRANT USAGE ON SCHEMA public TO portfolio_app;
                    GRANT SELECT, INSERT, UPDATE ON contact_submissions TO portfolio_app;
                    GRANT SELECT, INSERT ON audit_log_entries TO portfolio_app;

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
                END IF;

                IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'portfolio_admin') THEN
                    GRANT USAGE ON SCHEMA public TO portfolio_admin;
                    GRANT SELECT, INSERT, UPDATE, DELETE ON contact_submissions TO portfolio_admin;
                    GRANT SELECT, INSERT, UPDATE, DELETE ON audit_log_entries TO portfolio_admin;

                    IF NOT EXISTS (
                        SELECT 1 FROM pg_policies
                        WHERE schemaname = 'public'
                          AND tablename = 'contact_submissions'
                          AND policyname = 'contact_submissions_admin_all'
                    ) THEN
                        CREATE POLICY contact_submissions_admin_all
                            ON contact_submissions
                            FOR ALL
                            TO portfolio_admin
                            USING (true)
                            WITH CHECK (true);
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1 FROM pg_policies
                        WHERE schemaname = 'public'
                          AND tablename = 'audit_log_entries'
                          AND policyname = 'audit_log_entries_admin_all'
                    ) THEN
                        CREATE POLICY audit_log_entries_admin_all
                            ON audit_log_entries
                            FOR ALL
                            TO portfolio_admin
                            USING (true)
                            WITH CHECK (true);
                    END IF;
                END IF;
            END $$;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "audit_log_entries");

        migrationBuilder.DropTable(
            name: "contact_submissions");
    }
}
