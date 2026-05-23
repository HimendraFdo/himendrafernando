# 04 Contact API Agent

## Purpose

Implement the secure public contact form API for the Himendra Fernando portfolio backend.

This agent owns the contact submission feature only. The backend foundation, API security, and PostgreSQL/RLS agents should already be complete before this task starts.

The goal is to add a useful portfolio backend feature that demonstrates validation, persistence, rate limiting, privacy-conscious request handling, and clean API design.

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
- `GET /`
- `GET /health`
- development-only Swagger
- CORS
- rate limiting
- global exception handling
- secure headers
- PostgreSQL EF Core setup
- `PortfolioDbContext`
- `ContactSubmission` entity
- `AuditLogEntry` entity
- Row Level Security migration SQL

## Responsibilities

Implement the public contact API:

- `POST /api/contact`
- request DTO
- response DTO
- validation
- database persistence
- contact-specific rate limiting
- safe request metadata handling
- audit logging where useful
- focused tests
- concise documentation

Do not implement admin review workflows, authentication, email delivery, AWS infrastructure, or frontend integration in this task unless explicitly required by existing tests.

## Endpoint Requirements

Add:

```http
POST /api/contact
```

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello, I would like to talk about a project."
}
```

Successful response:

```json
{
  "id": "generated-submission-id",
  "status": "Received",
  "message": "Thanks for reaching out. I will get back to you soon."
}
```

Recommended status code:

```http
201 Created
```

Do not return internal database details.

Do not expose IP hashes, user agents, audit metadata, exception details, or RLS details in the API response.

## Validation Requirements

Validate input before saving.

Rules:

- `name` is required
- `name` max length: 120
- `email` is required
- `email` max length: 254
- `email` must be a valid email address
- `message` is required
- `message` min length: 10
- `message` max length: 4000

Trim leading/trailing whitespace.

Reject empty or whitespace-only values.

Return `400 Bad Request` with Problem Details or Validation Problem Details for validation failures.

Do not use ad hoc string parsing for email if a framework validation option is available.

## Spam and Abuse Controls

Apply the named contact rate limit policy created by the API security agent.

Expected behavior:

- contact endpoint uses the stricter `Contact` policy
- repeated submissions over the limit return `429 Too Many Requests`
- `429` response should be safe and not reveal internals

Add lightweight abuse-conscious handling:

- store a hash of the source IP, not the raw IP
- store the user agent with a reasonable length limit
- do not store request body logs
- do not log the submitted message body unless there is a clear reason

If an IP hash helper is created, keep the hashing salt configurable.

Suggested config:

```json
{
  "Security": {
    "IpHashSalt": ""
  }
}
```

Development can work with an empty or generated fallback salt, but production must require a real secret from environment variables or AWS Secrets Manager.

Do not commit real salts or secrets.

## Application Layer Requirements

Prefer keeping contact use-case logic out of `Program.cs`.

Suggested Application files:

```text
api/Himendra.Portfolio.Application/Contact/SubmitContactRequest.cs
api/Himendra.Portfolio.Application/Contact/SubmitContactResponse.cs
api/Himendra.Portfolio.Application/Contact/IContactSubmissionService.cs
```

Suggested Infrastructure files:

```text
api/Himendra.Portfolio.Infrastructure/Contact/ContactSubmissionService.cs
api/Himendra.Portfolio.Infrastructure/Security/IpHashService.cs
```

Suggested API files:

```text
api/Himendra.Portfolio.Api/Endpoints/ContactEndpoints.cs
```

Follow the existing project structure if it already has a different clear pattern.

## Persistence Requirements

Save valid submissions to the `contact_submissions` table through `PortfolioDbContext`.

Set:

- `Id`
- `Name`
- `Email`
- `Message`
- `CreatedAtUtc`
- `Status`
- `SourceIpHash` if available
- `UserAgent` if available

Initial status:

```text
New
```

Use UTC timestamps.

Do not accept `Status`, `CreatedAtUtc`, `ReviewedAtUtc`, or `Id` from the public request body.

## Audit Logging Requirements

Create an audit log entry for successful contact submissions if the existing audit model supports it cleanly.

Suggested values:

```text
Action: ContactSubmissionCreated
ResourceType: ContactSubmission
ResourceId: submission id
ActorId: null
IpHash: same source IP hash if available
UserAgent: request user agent if available
```

Do not store message text in audit metadata.

If audit logging would add too much coupling, document why it was deferred.

## Error Handling Requirements

Use existing global exception handling.

Do not add endpoint-specific try/catch blocks unless there is a specific recoverable case.

Expected behavior:

- validation failures return `400`
- rate-limit failures return `429`
- successful submissions return `201`
- database failures return a safe `500` response through global exception handling

## Email Notification

Email delivery is optional and should not be implemented by default in this task.

If email is added, it must be behind an interface and disabled unless configured.

Do not add SMTP credentials, API keys, or provider-specific secrets.

Recommended to leave email delivery for a later dedicated agent.

## Testing Requirements

Add focused integration tests for:

- valid submission returns `201`
- valid submission is persisted
- invalid email returns `400`
- blank name returns `400`
- short message returns `400`
- overlong message returns `400`
- public request cannot set internal fields
- contact rate limit returns `429` after the configured limit

If database-backed integration tests require PostgreSQL and Docker is unavailable, use the existing test strategy from the database agent and document limitations.

Do not weaken existing security or database tests.

## Documentation Requirements

Update API documentation.

Suggested file:

```text
api/README.md
```

or:

```text
api/docs/contact-api.md
```

Document:

- endpoint path
- request shape
- success response shape
- validation rules
- rate limit behavior
- privacy note about IP hashing
- required production configuration for `IpHashSalt`

Keep it concise.

## Frontend Integration

Do not change the frontend unless explicitly requested.

If a frontend change is necessary for tests or local manual verification, keep it minimal and document it clearly.

The contact form frontend integration can be handled by a later frontend/backend integration task.

## Acceptance Criteria

This task is complete when:

- `POST /api/contact` exists
- contact endpoint uses the contact rate limit policy
- input validation is enforced
- successful submissions are saved to PostgreSQL through EF Core
- raw IP addresses are not stored
- internal fields cannot be set by public clients
- successful response does not leak internal data
- tests cover success, validation failures, persistence, and rate limiting
- docs explain usage and configuration
- `dotnet build Himendra.Portfolio.sln` succeeds
- `dotnet test Himendra.Portfolio.sln` succeeds
- no secrets are committed
- no unrelated frontend files are changed

## Out of Scope

Do not implement:

- admin authentication
- admin review endpoints
- Cognito
- project/blog CRUD
- email provider integration unless already required
- frontend contact form integration
- AWS infrastructure
- Docker deployment files
- Terraform
- GitHub Actions
- WAF rules

Those are handled by later agents.
