# 05 Admin Auth Agent

## Purpose

Add secure admin authentication and authorization to the Himendra Fernando portfolio backend.

This agent owns backend admin access only. The backend foundation, API security, PostgreSQL/RLS, and contact API agents should already be complete before this task starts.

The goal is to protect admin-only API capabilities with clean JWT-based authentication, role-based authorization, and a small review workflow for contact submissions.

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

Already implemented:

- ASP.NET Core Web API foundation
- API security middleware
- rate limiting
- CORS
- global exception handling
- secure headers
- PostgreSQL EF Core setup
- Row Level Security migration SQL
- `ContactSubmission`
- `AuditLogEntry`
- `POST /api/contact`

## Responsibilities

Implement admin authentication and authorization:

- JWT bearer authentication
- role-based authorization
- admin authorization policy
- secure admin endpoints for contact submissions
- audit logging for admin actions
- configuration prepared for AWS Cognito or another OIDC/JWT provider
- focused auth and authorization tests
- concise documentation

Do not implement frontend admin UI, AWS infrastructure, Cognito resource creation, Docker, Terraform, or GitHub Actions in this task.

## Authentication Strategy

Use JWT bearer authentication in ASP.NET Core.

The implementation should be provider-ready rather than tightly coupled to one identity provider.

Configure using options such as:

```json
{
  "Authentication": {
    "Authority": "",
    "Audience": "",
    "RequireHttpsMetadata": true
  }
}
```

Production target can be AWS Cognito later.

Do not add real Cognito pool IDs, client IDs, domains, secrets, or private keys.

In development/test environments, use test authentication handlers or test JWT setup as appropriate.

## Authorization Requirements

Add a policy:

```text
AdminOnly
```

The policy should require an authenticated user with an admin role/claim.

Accepted claim strategy should be documented. Prefer supporting one clear claim source, such as:

```text
role=Admin
```

or:

```text
cognito:groups contains Admin
```

If supporting Cognito groups directly, keep it documented and testable.

Do not allow anonymous access to admin endpoints.

## Admin Endpoint Requirements

Add admin-only endpoints for contact submission review.

Suggested endpoints:

```http
GET /api/admin/contact-submissions
GET /api/admin/contact-submissions/{id}
PATCH /api/admin/contact-submissions/{id}/status
```

### GET /api/admin/contact-submissions

Returns a paged list of contact submissions.

Query parameters:

```text
status optional
page optional, default 1
pageSize optional, default 20, max 100
```

Do not return raw IP addresses. The database should not store raw IP addresses anyway.

Response should include:

```text
id
name
email
message
status
createdAtUtc
reviewedAtUtc
userAgent
```

### GET /api/admin/contact-submissions/{id}

Returns one submission by ID.

Return `404 Not Found` if it does not exist.

### PATCH /api/admin/contact-submissions/{id}/status

Allows an admin to update status.

Allowed statuses:

```text
New
Reviewed
Archived
Spam
```

Request body:

```json
{
  "status": "Reviewed"
}
```

Set `ReviewedAtUtc` when the status changes from `New` to a reviewed terminal state if the existing domain model supports this cleanly.

Do not allow public users to update status.

## Application Layer Requirements

Keep admin use-case logic out of `Program.cs`.

Suggested files:

```text
api/Himendra.Portfolio.Application/Admin/ContactSubmissions/AdminContactSubmissionDto.cs
api/Himendra.Portfolio.Application/Admin/ContactSubmissions/IAdminContactSubmissionService.cs
api/Himendra.Portfolio.Application/Admin/ContactSubmissions/UpdateContactSubmissionStatusRequest.cs
```

Suggested Infrastructure files:

```text
api/Himendra.Portfolio.Infrastructure/Admin/ContactSubmissions/AdminContactSubmissionService.cs
```

Suggested API files:

```text
api/Himendra.Portfolio.Api/Endpoints/AdminContactSubmissionEndpoints.cs
api/Himendra.Portfolio.Api/Auth/AuthPolicies.cs
api/Himendra.Portfolio.Api/Options/AuthOptions.cs
```

Follow existing project patterns if they differ.

## Audit Logging Requirements

Create audit log entries for admin actions:

- viewing a single contact submission if practical
- updating contact submission status

At minimum, audit status changes.

Suggested audit fields:

```text
ActorId: authenticated user ID claim
Action: ContactSubmissionStatusUpdated
ResourceType: ContactSubmission
ResourceId: submission id
MetadataJson: old and new status only
```

Do not store secrets, bearer tokens, raw request bodies, or full contact messages in audit metadata.

## Security Requirements

Admin endpoints must:

- require authentication
- require the `AdminOnly` policy
- return `401 Unauthorized` when no valid authentication exists
- return `403 Forbidden` when authenticated but not admin
- avoid leaking whether protected resources exist to anonymous users
- use existing secure error handling

Do not disable rate limiting globally.

If needed, add a separate admin rate limit policy with reasonable limits.

## Row Level Security Considerations

Do not weaken existing RLS policies.

If role/policy changes are needed for admin queries, add a migration or documented SQL that preserves least privilege.

The application should still avoid using a database superuser at runtime.

If the current RLS model cannot fully distinguish public contact writes from admin reads yet, document the limitation and the expected production role setup.

## Testing Requirements

Add focused tests for:

- anonymous users cannot access admin endpoints
- authenticated non-admin users cannot access admin endpoints
- admin users can list contact submissions
- admin users can fetch one contact submission
- admin users can update status
- invalid status returns `400`
- missing submission returns `404`
- status updates create audit logs if audit logging is implemented

Use test auth handlers or a controlled test JWT setup.

Do not require real Cognito for tests.

Keep existing tests passing.

## Documentation Requirements

Update backend documentation.

Suggested file:

```text
api/docs/admin-auth.md
```

Document:

- JWT configuration keys
- expected admin claim/group
- admin endpoint list
- local test auth approach if any
- Cognito production notes
- no real secrets should be committed

Keep documentation practical and concise.

## Acceptance Criteria

This task is complete when:

- JWT bearer auth is configured
- `AdminOnly` authorization policy exists
- admin contact-submission endpoints exist
- anonymous users receive `401`
- non-admin authenticated users receive `403`
- admin users can review and update submissions
- admin status changes are validated
- audit logging exists for status changes or deferral is clearly documented
- docs explain auth configuration and admin claim expectations
- `dotnet build Himendra.Portfolio.sln` succeeds
- `dotnet test Himendra.Portfolio.sln` succeeds
- no secrets are committed
- no unrelated frontend files are changed

## Out of Scope

Do not implement:

- frontend admin dashboard
- AWS Cognito resource creation
- AWS infrastructure
- Docker deployment files
- Terraform
- GitHub Actions
- WAF rules
- email delivery
- project/blog CRUD unless already required by existing code

Those are handled by later agents.
