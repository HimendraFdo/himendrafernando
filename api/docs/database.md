# Database

The API uses PostgreSQL through EF Core. Infrastructure owns EF Core details in
`Himendra.Portfolio.Infrastructure`.

## Connection String

The configured connection string name is:

```text
ConnectionStrings:PortfolioDatabase
```

For local development, leave it blank if PostgreSQL is not set up yet. The API
will still start and `/health` will continue to report application health.
When the connection string is configured, `/health/ready` includes the EF Core
database connectivity check.

Set the value with user secrets or an environment variable:

```text
ConnectionStrings__PortfolioDatabase
```

Do not commit real credentials to `appsettings.json`.

## Migrations

The initial migration is `InitialDatabaseSecurity`. It creates:

- `contact_submissions`
- `audit_log_entries`
- useful timestamp/status/actor indexes
- PostgreSQL Row Level Security setup SQL

Future migration commands:

```bash
dotnet ef migrations add <MigrationName> --project api/Himendra.Portfolio.Infrastructure --startup-project api/Himendra.Portfolio.Api --context PortfolioDbContext
dotnet ef database update --project api/Himendra.Portfolio.Infrastructure --startup-project api/Himendra.Portfolio.Api --context PortfolioDbContext
```

If `dotnet ef` is unavailable:

```bash
dotnet tool install --global dotnet-ef
```

## Role Model

Recommended roles:

- `portfolio_migrator`: owns schema changes and runs EF migrations. Do not use
  this role from the running API.
- `portfolio_app`: used by the API at runtime with least-privilege grants.
- `portfolio_admin`: reserved for trusted admin operations and maintenance.

Create roles before running migrations in production if you want the migration
to apply grants and RLS policies immediately. The migration checks whether
`portfolio_app` and `portfolio_admin` exist before creating role-specific
policies, so local migrations do not fail when roles are absent.

## RLS Intent

RLS is enabled and forced on application-owned tables:

- `contact_submissions`
- `audit_log_entries`

Current policies are intentionally simple because application authorization is
not implemented yet:

- `portfolio_app` can insert, select, and update contact submissions through
  controlled API behavior.
- `portfolio_app` can insert and select audit log entries.
- `portfolio_admin` can manage both tables.
- no anonymous direct database role is granted table access.

Later admin/auth work should tighten policies around authenticated admin claims
or separate database roles if the runtime architecture supports that split.

## Production AWS RDS Notes

Production should:

- keep RDS in private subnets
- disable public database access
- require SSL connections
- avoid using the RDS master user from the application
- store and rotate credentials through AWS Secrets Manager or environment
  variables
- run migrations with `portfolio_migrator`, then run the API with
  `portfolio_app`

## Tests

`dotnet test Himendra.Portfolio.sln` covers EF mapping and verifies that RLS SQL
is present in the migration without requiring Docker. Full database integration
tests should use Testcontainers PostgreSQL when Docker is available.
