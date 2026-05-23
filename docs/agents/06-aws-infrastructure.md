# 06 AWS Infrastructure Agent

## Purpose

Prepare AWS deployment infrastructure for the Himendra Fernando portfolio backend.

This agent owns deployment architecture and infrastructure setup only. The backend foundation, API security, PostgreSQL/RLS, contact API, and admin auth agents should already be complete before this task starts.

The goal is to make the backend deployable on AWS with professional security defaults, clear environment configuration, and infrastructure-as-code.

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

- ASP.NET Core Web API
- rate limiting
- CORS
- secure headers
- global exception handling
- PostgreSQL EF Core
- Row Level Security migration SQL
- contact submission API
- admin JWT authorization
- admin contact review endpoints

## Responsibilities

Add AWS deployment infrastructure planning and code:

- deployment target selection
- Dockerfile for the API if needed
- AWS infrastructure-as-code
- RDS PostgreSQL configuration
- Secrets Manager configuration
- CloudWatch logging
- WAF/rate protection plan
- environment variable mapping
- GitHub Actions deployment skeleton if appropriate
- concise deployment documentation

Do not implement new backend business features in this task.

## Preferred AWS Architecture

Use a pragmatic architecture suitable for a portfolio backend.

Preferred option:

```text
React frontend hosting
  -> API domain / CloudFront or ALB
  -> ECS Fargate service running ASP.NET Core API
  -> RDS PostgreSQL in private subnets
  -> Secrets Manager for connection strings/auth secrets
  -> CloudWatch Logs
  -> AWS WAF on public entry point
```

Acceptable simpler option if the repo is not ready for ECS:

```text
Elastic Beanstalk running the ASP.NET Core API
RDS PostgreSQL
Secrets Manager / environment variables
CloudWatch
WAF where applicable
```

Prefer ECS Fargate if implementing infrastructure-as-code because it demonstrates stronger cloud/backend skills.

## Infrastructure-as-Code Requirement

Use Terraform or AWS CDK.

Preferred for CV value:

```text
Terraform
```

Suggested structure:

```text
infra/
  terraform/
    environments/
      dev/
        main.tf
        variables.tf
        outputs.tf
    modules/
      api/
      database/
      networking/
      security/
```

If the implementation is too large for this pass, create a well-scoped Terraform starter with documented next steps rather than a half-working complex setup.

Do not hardcode AWS account IDs, real domains, secrets, passwords, or access keys.

## Docker Requirements

Add a production-ready Dockerfile for the ASP.NET Core API.

Suggested location:

```text
api/Himendra.Portfolio.Api/Dockerfile
```

Requirements:

- multi-stage build
- .NET 8 SDK build image
- .NET 8 ASP.NET runtime image
- non-root runtime user if practical
- expose the correct port
- production environment defaults
- no secrets baked into the image

Add a `.dockerignore` if needed.

Do not containerize the frontend unless required by the deployment plan.

## AWS Resource Requirements

Plan or implement these resources:

### Networking

- VPC
- public subnets for load balancer
- private subnets for ECS tasks and RDS
- security groups with least privilege

### API Hosting

- ECS cluster
- ECS Fargate task definition
- ECS service
- Application Load Balancer
- target group
- HTTPS-ready listener design

If TLS/domain is not configured yet, document the ACM certificate and domain requirements.

### Database

- RDS PostgreSQL
- private subnet placement
- encryption at rest
- backup retention
- deletion protection configurable
- no public accessibility
- security group allowing access only from API tasks

### Secrets

Use AWS Secrets Manager for:

- database connection string or database credentials
- JWT authority/audience values if sensitive or environment-specific
- IP hash salt

Do not commit real secret values.

### Logging and Monitoring

- CloudWatch log group for API
- ECS task logs to CloudWatch
- basic retention policy
- recommended alarms documented

### WAF

Document or create WAF protection for:

- common managed rule sets
- request size limits
- basic IP reputation rules
- rate-based rules

If WAF is not implemented in Terraform yet, document a clear plan.

## Environment Variable Mapping

Document production environment variables required by the API.

Examples:

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__PortfolioDatabase
Authentication__Authority
Authentication__Audience
Authentication__RequireHttpsMetadata=true
Security__IpHashSalt
Cors__AllowedOrigins__0
```

Do not include real values.

## CI/CD Requirements

If adding GitHub Actions, keep it as a deployment skeleton unless credentials and AWS account details are already available.

Suggested file:

```text
.github/workflows/deploy-api.yml
```

Use OIDC-based AWS auth, not long-lived access keys.

Expected flow:

- checkout
- setup .NET 8
- restore/build/test
- docker build
- push to ECR
- update ECS service

Do not add fake secrets.

If CI/CD cannot be completed without AWS account details, document required GitHub secrets/variables and leave the workflow safely disabled or clearly marked as a template.

## Security Requirements

Infrastructure must follow these rules:

- RDS is not publicly accessible
- API does not use database master user
- security groups allow minimum required traffic
- secrets are not committed
- runtime config comes from environment variables/secrets
- HTTPS is planned for production
- CloudWatch logging is enabled
- WAF protection is planned or included
- no AWS credentials are stored in the repo

## Documentation Requirements

Create or update:

```text
infra/README.md
```

Document:

- selected AWS architecture
- local Docker build/run commands
- Terraform layout
- required AWS prerequisites
- required environment variables
- Secrets Manager expectations
- deployment steps
- security notes
- known TODOs

Keep documentation practical and clear.

## Testing and Verification Requirements

Run:

```bash
dotnet build Himendra.Portfolio.sln
dotnet test Himendra.Portfolio.sln
```

If Docker is available, verify:

```bash
docker build -f api/Himendra.Portfolio.Api/Dockerfile .
```

If Terraform is added, run formatting and validation where practical:

```bash
terraform fmt
terraform validate
```

Do not require real AWS deployment for this task unless credentials and account context are already available.

## Acceptance Criteria

This task is complete when:

- AWS deployment architecture is documented
- Dockerfile exists for the API
- Terraform or CDK starter exists
- RDS private PostgreSQL setup is planned or implemented
- Secrets Manager usage is planned or implemented
- CloudWatch logging is planned or implemented
- WAF protection is planned or implemented
- environment variable mapping is documented
- optional CI/CD skeleton avoids hardcoded credentials
- `dotnet build Himendra.Portfolio.sln` succeeds
- `dotnet test Himendra.Portfolio.sln` succeeds
- no real secrets are committed
- no unrelated frontend files are changed

## Out of Scope

Do not implement:

- new API features
- frontend admin UI
- email provider integration
- real AWS deployment unless explicitly configured
- real domain/ACM setup unless details are provided
- production secret values

Those can be handled by later deployment or integration agents.
