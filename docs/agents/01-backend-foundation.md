# 01 Backend Foundation Agent

## Purpose

Set up the initial ASP.NET Core backend for the Himendra Fernando portfolio project.

This agent owns the backend foundation only. Do not implement contact forms, database schema, authentication, AWS infrastructure, or advanced security policies in this step unless they are needed for the basic project skeleton.

The goal is to create a clean, professional backend base that later agents can extend safely.

## Project Context

The repository currently contains a Vite + React + TypeScript frontend portfolio.

The backend should be added as a separate ASP.NET Core Web API project inside the same repository.

Recommended structure:

```text
/
  src/
    frontend files already exist here
  api/
    Himendra.Portfolio.Api/
    Himendra.Portfolio.Application/
    Himendra.Portfolio.Domain/
    Himendra.Portfolio.Infrastructure/
    Himendra.Portfolio.Tests/
  Himendra.Portfolio.sln
```

Use .NET 8.

## Responsibilities

Create the backend solution and projects.

Expected projects:

```text
api/Himendra.Portfolio.Api
api/Himendra.Portfolio.Application
api/Himendra.Portfolio.Domain
api/Himendra.Portfolio.Infrastructure
api/Himendra.Portfolio.Tests
```

Use these responsibilities:

- `Api`: HTTP endpoints, middleware registration, API configuration
- `Application`: service contracts, use cases, validation interfaces
- `Domain`: core entities and domain models
- `Infrastructure`: database, external services, email, AWS integrations later
- `Tests`: unit and integration tests

## Required Setup

Create a solution:

```bash
dotnet new sln -n Himendra.Portfolio
```

Create projects:

```bash
dotnet new webapi -n Himendra.Portfolio.Api -o api/Himendra.Portfolio.Api
dotnet new classlib -n Himendra.Portfolio.Application -o api/Himendra.Portfolio.Application
dotnet new classlib -n Himendra.Portfolio.Domain -o api/Himendra.Portfolio.Domain
dotnet new classlib -n Himendra.Portfolio.Infrastructure -o api/Himendra.Portfolio.Infrastructure
dotnet new xunit -n Himendra.Portfolio.Tests -o api/Himendra.Portfolio.Tests
```

Add projects to solution:

```bash
dotnet sln Himendra.Portfolio.sln add api/Himendra.Portfolio.Api/Himendra.Portfolio.Api.csproj
dotnet sln Himendra.Portfolio.sln add api/Himendra.Portfolio.Application/Himendra.Portfolio.Application.csproj
dotnet sln Himendra.Portfolio.sln add api/Himendra.Portfolio.Domain/Himendra.Portfolio.Domain.csproj
dotnet sln Himendra.Portfolio.sln add api/Himendra.Portfolio.Infrastructure/Himendra.Portfolio.Infrastructure.csproj
dotnet sln Himendra.Portfolio.sln add api/Himendra.Portfolio.Tests/Himendra.Portfolio.Tests.csproj
```

Add references:

```bash
dotnet add api/Himendra.Portfolio.Api reference api/Himendra.Portfolio.Application
dotnet add api/Himendra.Portfolio.Api reference api/Himendra.Portfolio.Infrastructure
dotnet add api/Himendra.Portfolio.Application reference api/Himendra.Portfolio.Domain
dotnet add api/Himendra.Portfolio.Infrastructure reference api/Himendra.Portfolio.Application
dotnet add api/Himendra.Portfolio.Infrastructure reference api/Himendra.Portfolio.Domain
dotnet add api/Himendra.Portfolio.Tests reference api/Himendra.Portfolio.Api
dotnet add api/Himendra.Portfolio.Tests reference api/Himendra.Portfolio.Application
dotnet add api/Himendra.Portfolio.Tests reference api/Himendra.Portfolio.Domain
```

## API Requirements

Add a health endpoint:

```http
GET /health
```

Expected response:

```json
{
  "status": "Healthy",
  "service": "Himendra.Portfolio.Api"
}
```

Add a root endpoint:

```http
GET /
```

Expected response:

```json
{
  "name": "Himendra Fernando Portfolio API",
  "status": "Running"
}
```

Swagger/OpenAPI must be enabled in development only.

Do not expose Swagger by default in production.

## Configuration Requirements

Set up environment-based configuration.

Use:

```text
appsettings.json
appsettings.Development.json
```

Add placeholder configuration sections only:

```json
{
  "Cors": {
    "AllowedOrigins": []
  },
  "RateLimiting": {
    "PermitLimit": 60,
    "WindowSeconds": 60
  },
  "Database": {
    "Provider": "PostgreSQL"
  }
}
```

Do not add real secrets.

Do not hardcode passwords, connection strings, API keys, email credentials, or AWS credentials.

## Logging Requirements

Use built-in ASP.NET Core logging.

Log application startup.

Do not log sensitive data.

Do not log request bodies.

## Code Quality Requirements

Use nullable reference types.

Use minimal APIs or controllers consistently. Prefer minimal APIs for this small portfolio backend unless the existing implementation strongly favors controllers.

Keep `Program.cs` readable. If it grows too large, move configuration into extension methods.

Suggested extension method files:

```text
api/Himendra.Portfolio.Api/Extensions/ServiceCollectionExtensions.cs
api/Himendra.Portfolio.Api/Extensions/WebApplicationExtensions.cs
```

## Testing Requirements

Add basic tests that verify:

- health endpoint returns success
- root endpoint returns success
- solution builds

Use xUnit.

If integration testing requires `WebApplicationFactory`, add the required package:

```bash
dotnet add api/Himendra.Portfolio.Tests package Microsoft.AspNetCore.Mvc.Testing
```

## Acceptance Criteria

This task is complete when:

- The .NET solution exists
- All backend projects are created
- Project references are correct
- `dotnet build Himendra.Portfolio.sln` succeeds
- `dotnet test Himendra.Portfolio.sln` succeeds
- `GET /health` returns a healthy response
- Swagger is available only in development
- No secrets are committed
- The frontend project remains untouched unless a small README update is needed

## Out of Scope

Do not implement:

- PostgreSQL
- EF Core migrations
- Row Level Security
- contact form endpoint
- authentication
- AWS deployment
- Docker
- Terraform
- GitHub Actions
- production WAF configuration

Those are handled by later agents.
