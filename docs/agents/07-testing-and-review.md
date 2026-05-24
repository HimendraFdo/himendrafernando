# 07 Testing and Review Agent

## Purpose

Perform the final backend review before real deployment.

This agent owns verification, quality review, security review, deployment readiness checks, and documentation review. It should not add new product features unless a bug fix is required to make the existing backend safe or functional.

The goal is to confirm the backend is technically sound, secure enough for a portfolio production deployment, and ready for an AWS deployment decision.

## Project Context

The repository contains:

```text
Himendra.Portfolio.sln
api/Himendra.Portfolio.Api
api/Himendra.Portfolio.Application
api/Himendra.Portfolio.Domain
api/Himendra.Portfolio.Infrastructure
api/Himendra.Portfolio.Tests
infra/
```

Previously completed scopes:

- backend foundation
- API security
- PostgreSQL and EF Core setup
- Row Level Security migration SQL
- public contact API
- admin JWT authorization
- admin contact submission review endpoints
- AWS infrastructure starter
- Dockerfile
- Terraform starter
- deployment documentation

## Responsibilities

Review and verify the whole backend:

- build and test status
- endpoint behavior
- validation behavior
- rate limiting behavior
- authentication and authorization behavior
- database and migration setup
- Row Level Security setup
- Docker build readiness
- Terraform validation readiness
- secrets/configuration safety
- documentation accuracy
- deployment readiness risks

Fix small issues found during review if they are clearly in scope.

If a larger architectural issue is found, document it clearly rather than making a risky broad rewrite.

## Required Commands

Run the main backend checks:

```bash
dotnet restore Himendra.Portfolio.sln
dotnet build Himendra.Portfolio.sln
dotnet test Himendra.Portfolio.sln
```

Run frontend checks if frontend files were touched by previous agents:

```bash
npm run build
npm run lint
```

If Docker is available, run:

```bash
docker build -f api/Himendra.Portfolio.Api/Dockerfile -t himendra-portfolio-api:final-review .
```

If Terraform is available, run from the Terraform environment folder:

```bash
terraform fmt -recursive
terraform init -backend=false
terraform validate
```

Do not run `terraform apply`.

Do not deploy real AWS resources in this task.

## API Behavior Review

Verify the API still exposes expected public endpoints:

```http
GET /
GET /health
POST /api/contact
```

Verify admin endpoints are protected:

```http
GET /api/admin/contact-submissions
GET /api/admin/contact-submissions/{id}
PATCH /api/admin/contact-submissions/{id}/status
```

Expected behavior:

- public endpoints work without auth
- contact endpoint validates input
- contact endpoint uses contact rate limiting
- admin endpoints return `401` for anonymous requests
- admin endpoints return `403` for authenticated non-admin users
- admin endpoints work for admin users in tests
- Swagger is development-only

## Security Review

Check these items carefully:

- no secrets committed
- no real AWS credentials committed
- no real database passwords committed
- no JWT signing secrets committed
- no IP hash salt committed as a production value
- CORS does not use wildcard production origins
- Swagger is disabled outside development
- rate limiting is active
- secure headers are applied
- exception responses do not expose stack traces
- request bodies are not logged
- raw IP addresses are not persisted
- admin endpoints require `AdminOnly`
- database runtime role is documented as least privilege
- RLS policies exist and are not weakened

If any item fails, fix it if small and clearly scoped. Otherwise document it as a deployment blocker.

## Database Review

Review:

- EF Core entity mappings
- migrations
- indexes
- RLS SQL
- database role documentation
- connection string handling
- readiness health check behavior

Expected result:

- app starts without a database connection string in local development
- app includes database readiness checks when a connection string is configured
- migrations do not require application runtime superuser access
- production docs warn against using the RDS master user as the runtime app user

## Infrastructure Review

Review:

- Dockerfile
- `.dockerignore`
- Terraform layout
- ECS/API hosting plan
- RDS private subnet setup or documented plan
- Secrets Manager usage or documented plan
- CloudWatch logging setup or documented plan
- WAF setup or documented plan
- GitHub Actions skeleton if present

Expected result:

- infrastructure is ready for planning
- no `terraform apply` has been run
- no live AWS resources are assumed to exist
- docs clearly state what is required before deployment

## Documentation Review

Review and update documentation if needed:

```text
README.md
api/README.md
api/docs/
infra/README.md
docs/agents/
```

Docs should clearly explain:

- how to build and test the backend
- how to run the API locally
- required config keys
- contact API behavior
- admin auth expectations
- database/RLS setup
- AWS deployment prerequisites
- that Terraform validation is not the same as deployment

Keep docs concise. Do not rewrite everything unless it is inaccurate.

## Code Review Focus

Look for:

- large logic in `Program.cs` that should be moved to endpoint/service extensions
- duplicated validation rules
- inconsistent DTO names
- incorrect HTTP status codes
- nullable reference issues
- async methods missing cancellation tokens where practical
- accidental broad exception swallowing
- tests that pass without actually verifying behavior
- insecure defaults hidden in test helpers
- fragile Terraform placeholders

Prioritize bugs and security risks over style preferences.

## Acceptance Criteria

This task is complete when:

- `dotnet restore` succeeds
- `dotnet build` succeeds
- `dotnet test` succeeds
- Docker build succeeds or a clear Docker limitation is documented
- Terraform format/init/validate succeeds or a clear Terraform limitation is documented
- no real secrets are committed
- API/security/database/auth/infrastructure docs are accurate
- deployment blockers are listed clearly
- any small high-confidence fixes are applied
- no new product features are added
- final response states whether the backend is ready for real AWS deployment planning

## Final Response Format

The agent should return a concise final report with:

```text
Status:
Ready / Not ready

Verification:
- dotnet restore: passed/failed
- dotnet build: passed/failed
- dotnet test: passed/failed
- docker build: passed/failed/skipped
- terraform validate: passed/failed/skipped

Findings:
- P0/P1 blockers first
- then lower-risk issues
- say "No blockers found" if true

Changes Made:
- list files changed

Deployment Notes:
- what must happen before terraform apply or AWS deployment
```

## Out of Scope

Do not implement:

- new API features
- frontend admin UI
- email provider integration
- live AWS deployment
- `terraform apply`
- production secret creation
- real Cognito pool creation
- real domain/ACM setup

Those should be handled only after this review confirms readiness.
