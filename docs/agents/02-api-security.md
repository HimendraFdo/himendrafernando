# 02 API Security Agent

## Purpose

Harden the ASP.NET Core API surface for the Himendra Fernando portfolio backend.

This agent owns HTTP/API security only. The backend foundation should already exist before this task starts.

The goal is to make the public API safer against spam, abusive traffic, accidental data exposure, and common misconfiguration issues.

## Project Context

The repository contains a React/Vite frontend and a .NET 8 ASP.NET Core backend.

Expected backend structure:

```text
api/Himendra.Portfolio.Api
api/Himendra.Portfolio.Application
api/Himendra.Portfolio.Domain
api/Himendra.Portfolio.Infrastructure
api/Himendra.Portfolio.Tests
```

The API project should already expose:

```http
GET /
GET /health
```

Do not add database features, contact form persistence, authentication, AWS infrastructure, Docker, or Terraform in this step.

## Responsibilities

Implement API-level security controls:

- rate limiting
- CORS policy
- safe exception handling
- secure response headers
- HTTPS redirection
- request size limits where appropriate
- validation-friendly error responses
- production-safe Swagger/OpenAPI behavior
- tests for the configured security behavior

## Rate Limiting Requirements

Use ASP.NET Core built-in rate limiting.

Add a global default policy.

Recommended starting configuration:

```json
{
  "RateLimiting": {
    "GlobalPermitLimit": 100,
    "GlobalWindowSeconds": 60,
    "ContactPermitLimit": 5,
    "ContactWindowSeconds": 60
  }
}
```

Global policy:

- 100 requests per minute per client
- partition by authenticated user ID when available
- otherwise partition by IP address
- return HTTP `429 Too Many Requests`

Contact endpoint policy:

- 5 requests per minute per client
- this policy should be available for the future contact endpoint
- do not create the contact endpoint in this task unless it already exists

Create named policies similar to:

```csharp
public static class RateLimitPolicies
{
    public const string Global = "global";
    public const string Contact = "contact";
}
```

Use `Retry-After` headers where practical.

## CORS Requirements

Add a named CORS policy for the frontend.

Configuration example:

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://your-production-domain.example"
    ]
  }
}
```

Requirements:

- never use `AllowAnyOrigin` in production
- allow only configured origins
- allow standard HTTP methods needed by the API
- allow `Content-Type` and `Authorization` headers
- keep credentials disabled unless a later auth decision requires them

If no origins are configured in development, allow `http://localhost:5173` as the local Vite frontend origin.

## Exception Handling Requirements

Add global exception handling.

Production responses must not expose:

- stack traces
- exception type names
- internal file paths
- connection strings
- environment variables
- secrets

Use Problem Details responses where possible.

For unexpected exceptions, return:

```json
{
  "title": "An unexpected error occurred.",
  "status": 500
}
```

Log exceptions server-side using ASP.NET Core logging.

Do not log request bodies.

## Security Headers Requirements

Add middleware for common security headers.

Required headers:

```text
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
X-XSS-Protection: 0
```

For production, add HSTS:

```text
Strict-Transport-Security
```

Do not add a strict Content Security Policy unless the frontend and API hosting model is already known. A bad CSP can break the deployed app. Leave a clear TODO if CSP should be handled later at the frontend/CDN layer.

## HTTPS Requirements

Enable HTTPS redirection.

Enable HSTS outside development.

Do not force local development into a broken HTTPS-only workflow if the generated dev certificate is not trusted. The app should still be runnable locally.

## Swagger/OpenAPI Requirements

Swagger must be available in development only.

Do not expose Swagger UI in production.

If Swagger is already development-only, verify it and leave it as-is.

## Request Validation Requirements

Prepare the API for validation-friendly endpoints.

If using minimal APIs:

- return consistent `ValidationProblem` responses for validation failures
- prefer typed request DTOs
- avoid binding raw unvalidated dictionaries for public endpoints

If using controllers:

- ensure automatic model validation returns consistent problem details

Do not create the contact form DTO yet unless the contact endpoint already exists. That belongs to the contact API agent.

## Configuration Requirements

Use strongly typed options classes where useful.

Suggested classes:

```text
api/Himendra.Portfolio.Api/Options/CorsOptions.cs
api/Himendra.Portfolio.Api/Options/RateLimitingOptions.cs
```

Do not store secrets in appsettings files.

Do not add real production domains unless they are already known.

Use placeholder comments or README notes for production values.

## Testing Requirements

Add or update tests to verify:

- `/health` still returns success
- the root endpoint still returns success
- Swagger is not enabled outside development if this is practical to test
- rate limiting returns `429` after the configured limit is exceeded
- CORS allows the configured local frontend origin
- CORS does not allow a random unconfigured origin

Use focused tests. Do not overbuild a large security test suite.

## Documentation Requirements

Update backend documentation if a backend README exists.

If no backend README exists, add a short section to the root `README.md` or create:

```text
api/README.md
```

Document:

- local API URL
- CORS configuration
- rate limiting defaults
- how to override settings in development
- reminder that production secrets must use environment variables or AWS Secrets Manager

Keep documentation concise.

## Acceptance Criteria

This task is complete when:

- rate limiting is configured
- CORS is locked to configured origins
- secure headers are applied
- global exception handling is in place
- HTTPS redirection and production HSTS are configured
- Swagger remains development-only
- security behavior has focused tests
- `dotnet build Himendra.Portfolio.sln` succeeds
- `dotnet test Himendra.Portfolio.sln` succeeds
- no secrets are committed
- no unrelated frontend files are changed

## Out of Scope

Do not implement:

- PostgreSQL
- EF Core migrations
- Row Level Security
- contact form endpoint
- email sending
- authentication
- Cognito
- admin dashboard
- AWS deployment
- Docker
- Terraform
- GitHub Actions
- WAF rules

Those are handled by later agents.
