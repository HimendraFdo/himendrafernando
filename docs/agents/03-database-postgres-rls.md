# 03 Database PostgreSQL RLS Agent

## Purpose

Set up PostgreSQL data access for the Himendra Fernando portfolio backend with secure defaults and Row Level Security planning.

This agent owns database foundation only. The backend foundation and API security agents should already be complete before this task starts.

The goal is to add a professional PostgreSQL + EF Core setup that later feature agents can build on safely.

## Project Context

The repository contains:

```text
Himendra.Portfolio.sln
api/Himendra.Portfolio.Api
api/Himendra.Portfolio.Application
api/Himendra.Portfolio.Domain
api/Himendra.Portfolio.Infrastructure
api/Himendra.Portfolio.Tests
```

The API already has:

- `GET /`
- `GET /health`
- development-only Swagger
- CORS
- rate limiting
- global exception handling
- secure headers

This task should add PostgreSQL/EF Core infrastructure without implementing full contact, admin, or project-management features.

## Responsibilities

Implement the database foundation:

- EF Core with PostgreSQL provider
- application `DbContext`
- baseline entities needed for near-term backend features
- secure database configuration
- migrations
- Row Level Security SQL migration scripts
- database role guidance
- health check integration for database connectivity
- focused database tests where practical

## Required Packages

Add the relevant packages to the appropriate projects.

Likely packages:

```bash
dotnet add api/Himendra.Portfolio.Infrastructure package Microsoft.EntityFrameworkCore
dotnet add api/Himendra.Portfolio.Infrastructure package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add api/Himendra.Portfolio.Api package Microsoft.EntityFrameworkCore.Design
dotnet add api/Himendra.Portfolio.Api package Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore
dotnet add api/Himendra.Portfolio.Tests package Testcontainers.PostgreSql
```

Only add packages that are actually used.

If `dotnet ef` is needed and unavailable, document the command needed to install it:

```bash
dotnet tool install --global dotnet-ef
```

Do not install global tools unless the workflow requires it.

## Database Configuration

Use a named connection string:

```json
{
  "ConnectionStrings": {
    "PortfolioDatabase": ""
  }
}
```

Development may use an environment variable or user secrets:

```text
ConnectionStrings__PortfolioDatabase
```

Do not commit real database credentials.

Do not place passwords in `appsettings.json`.

Production secrets should be provided by AWS Secrets Manager or environment variables.

## DbContext Requirements

Create an application DbContext in Infrastructure.

Suggested file:

```text
api/Himendra.Portfolio.Infrastructure/Data/PortfolioDbContext.cs
```

Register it from the API project through a clear extension method.

Suggested files:

```text
api/Himendra.Portfolio.Infrastructure/DependencyInjection.cs
api/Himendra.Portfolio.Api/Extensions/ServiceCollectionExtensions.cs
```

Keep Infrastructure responsible for EF Core details.

Do not leak EF Core types into Domain unless already established by the project.

## Baseline Entities

Add only the minimal baseline entities needed for upcoming backend features.

Recommended entities:

```text
ContactSubmission
AuditLogEntry
```

### ContactSubmission

Purpose: store public contact form submissions.

Suggested fields:

```text
Id: Guid
Name: string
Email: string
Message: string
SourceIpHash: string?
UserAgent: string?
CreatedAtUtc: DateTimeOffset
ReviewedAtUtc: DateTimeOffset?
Status: string
```

Status values can be simple strings for now:

```text
New
Reviewed
Archived
Spam
```

Keep raw IP addresses out of the database. Store a hash if needed for abuse detection.

### AuditLogEntry

Purpose: record security-relevant backend activity later.

Suggested fields:

```text
Id: Guid
ActorId: string?
Action: string
ResourceType: string?
ResourceId: string?
IpHash: string?
UserAgent: string?
CreatedAtUtc: DateTimeOffset
MetadataJson: string?
```

Do not log secrets or raw request bodies.

## EF Core Mapping Requirements

Use explicit configuration classes.

Suggested files:

```text
api/Himendra.Portfolio.Infrastructure/Data/Configurations/ContactSubmissionConfiguration.cs
api/Himendra.Portfolio.Infrastructure/Data/Configurations/AuditLogEntryConfiguration.cs
```

Requirements:

- table names use snake_case
- column names use snake_case
- required fields are marked required
- string lengths are constrained
- indexes are added where useful
- timestamps use UTC

Recommended indexes:

```text
contact_submissions(created_at_utc)
contact_submissions(status)
audit_log_entries(created_at_utc)
audit_log_entries(actor_id)
```

## Row Level Security Requirements

PostgreSQL Row Level Security must be enabled for application-owned tables.

Create migration SQL that:

- enables RLS on `contact_submissions`
- enables RLS on `audit_log_entries`
- forces RLS where appropriate
- creates policies for the application role
- documents admin-only access strategy for later auth work

Important: the portfolio app may initially use one backend service role. RLS should still be set up so future admin/user separation is easy.

Use a conservative default:

- app runtime role can insert public contact submissions
- app runtime role can read/write only through controlled API behavior
- admin role can manage submissions later
- no anonymous direct database access

Suggested SQL direction:

```sql
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log_entries ENABLE ROW LEVEL SECURITY;
```

Policies should be explicit and documented.

If the exact role names are not known yet, use configurable placeholder names such as:

```text
portfolio_app
portfolio_admin
portfolio_migrator
```

Do not assume production role names unless they already exist.

## Database Roles Documentation

Add documentation for intended roles:

```text
portfolio_migrator
portfolio_app
portfolio_admin
```

Recommended permissions:

- `portfolio_migrator`: owns migrations/schema changes, not used by the running API
- `portfolio_app`: used by the API at runtime, least privilege
- `portfolio_admin`: used only for trusted admin operations or maintenance

Document that production should:

- disable public database access
- require SSL
- keep RDS in a private subnet
- avoid using the master database user in the app
- rotate credentials through AWS Secrets Manager

## Health Check Requirements

Update `/health` or the health check registration to include database connectivity if a connection string is configured.

If no connection string is configured, local development should not crash solely because PostgreSQL is not set up yet.

Recommended behavior:

- without connection string: API starts and reports app health
- with connection string: include database health check

## Testing Requirements

Add focused tests where practical.

Preferred:

- use Testcontainers PostgreSQL for integration tests if Docker is available
- verify migrations apply cleanly
- verify entities can be inserted and queried
- verify RLS SQL exists in migrations or setup scripts

If Docker/Testcontainers is unavailable, do not fake database confidence. Instead:

- keep unit tests for mappings/options where useful
- document that database integration tests require Docker
- ensure `dotnet test Himendra.Portfolio.sln` still passes

## Documentation Requirements

Update or create database documentation.

Suggested file:

```text
api/docs/database.md
```

Document:

- connection string name
- local setup expectations
- EF Core migration commands
- database role model
- RLS intent and policies
- production AWS RDS security notes

Keep it practical and concise.

## Migration Requirements

Create an initial migration if EF Core tooling is available.

Suggested migration name:

```text
InitialDatabaseSecurity
```

Expected result:

- tables are created
- indexes are created
- RLS SQL is included or applied through a clearly documented migration path

If the agent cannot create migrations because tooling is unavailable, they must:

- explain why
- leave the code ready for migrations
- document the exact command to run

## Acceptance Criteria

This task is complete when:

- EF Core PostgreSQL support is added
- `PortfolioDbContext` exists
- baseline entities are modeled
- explicit EF Core configurations exist
- connection string configuration is secure and secret-free
- RLS setup is included in migrations or documented SQL scripts
- database roles are documented
- database health check behavior is added without breaking local startup
- focused tests are added or limitations are clearly documented
- `dotnet build Himendra.Portfolio.sln` succeeds
- `dotnet test Himendra.Portfolio.sln` succeeds
- no real secrets are committed
- no unrelated frontend files are changed

## Out of Scope

Do not implement:

- contact form HTTP endpoint
- email delivery
- admin authentication
- Cognito
- admin dashboard
- project/blog CRUD endpoints
- AWS infrastructure
- Docker deployment files
- Terraform
- GitHub Actions
- WAF rules

Those are handled by later agents.
