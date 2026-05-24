# AWS Infrastructure

This folder contains a Terraform starter for deploying the portfolio backend to AWS.

## Architecture

The selected deployment target is ECS Fargate because it keeps the ASP.NET Core API containerized, avoids server management, and demonstrates a production-style backend architecture.

```text
Frontend hosting or CloudFront
  -> API domain
  -> Application Load Balancer with optional ACM TLS
  -> ECS Fargate tasks running Himendra.Portfolio.Api
  -> RDS PostgreSQL in private subnets
  -> AWS Secrets Manager for runtime secrets
  -> CloudWatch Logs
  -> AWS WAF on the ALB
```

The Terraform dev environment creates:

- VPC with public subnets for the ALB and private subnets for ECS/RDS
- ECS cluster, Fargate service, task definition, ECR repository, and ALB
- RDS PostgreSQL with encryption, private subnet placement, backups, and deletion protection
- Security groups limited to ALB -> API and API -> PostgreSQL
- CloudWatch log group for container logs
- WAF managed rules, IP reputation protection, and a rate-based rule

## Local Docker

Build the API image from the repository root:

```bash
docker build -f api/Himendra.Portfolio.Api/Dockerfile -t himendra-portfolio-api:local .
```

Run it with local configuration:

```bash
docker run --rm -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__PortfolioDatabase="Host=host.docker.internal;Port=5432;Database=portfolio;Username=portfolio_api;Password=change-me" \
  -e Authentication__Authority="https://issuer.example.com/" \
  -e Authentication__Audience="portfolio-admin" \
  -e Security__IpHashSalt="local-dev-only" \
  -e Cors__AllowedOrigins__0="http://localhost:5173" \
  himendra-portfolio-api:local
```

Do not use the sample values in production.

## Terraform Layout

```text
infra/
  terraform/
    environments/
      dev/
        main.tf
        variables.tf
        outputs.tf
        versions.tf
    modules/
      api/
      database/
      networking/
      security/
```

Initialize and review from the dev environment:

```bash
cd infra/terraform/environments/dev
terraform fmt -recursive
terraform init -backend=false
terraform validate
```

This validates Terraform syntax and provider configuration only. It does not deploy infrastructure and is not a substitute for reviewing `terraform plan` with real AWS variables, remote state, and deployment credentials configured.

## AWS Prerequisites

Before applying Terraform, configure:

- AWS account and region access
- Terraform backend if remote state is required
- ACM certificate ARN for HTTPS, or leave `certificate_arn` empty for HTTP-only dev testing
- Frontend origin for CORS
- JWT authority and audience for admin endpoints
- Secrets Manager values for the API database connection string and IP hash salt

The ECS tasks run in private subnets. NAT is enabled by default in dev so tasks can pull ECR images and reach AWS APIs. For a lower-cost or stricter production design, replace NAT with VPC endpoints for ECR, CloudWatch Logs, and Secrets Manager.

## Required Runtime Environment

The API expects these production settings:

```text
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ConnectionStrings__PortfolioDatabase
Authentication__Authority
Authentication__Audience
Authentication__RequireHttpsMetadata=true
Security__IpHashSalt
Cors__AllowedOrigins__0
```

Terraform passes non-secret values as ECS environment variables and reads secret values from Secrets Manager when these ARNs are supplied:

```text
db_connection_string_secret_arn
ip_hash_salt_secret_arn
```

## Secrets Manager

Use Secrets Manager for:

- `ConnectionStrings__PortfolioDatabase`
- `Security__IpHashSalt`
- environment-specific authentication values if they become sensitive

RDS is created with an AWS-managed master password. The API should not use the master user. The database module also creates generated app credentials in Secrets Manager; use those values to create a least-privilege PostgreSQL user and then store the final API connection string in the secret referenced by `db_connection_string_secret_arn`.

## Deployment Steps

1. Build and push the API image to the Terraform-created ECR repository.
2. Create the least-privilege PostgreSQL app user and run EF Core migrations.
3. Store the API connection string and IP hash salt in Secrets Manager.
4. Set Terraform variables for the secret ARNs, CORS origin, authentication values, and optional ACM certificate.
5. Run `terraform init` with the chosen backend, run `terraform plan`, review changes, then apply.
6. Point the API DNS record at the ALB and enable HTTPS through ACM.

## GitHub Actions

`.github/workflows/deploy-api.yml` is a manual deployment skeleton using GitHub OIDC. It does not use long-lived AWS access keys.

Required repository or environment variables:

```text
AWS_REGION
AWS_DEPLOY_ROLE_ARN
API_ECR_REPOSITORY
API_ECS_CLUSTER
API_ECS_SERVICE
```

The workflow builds/tests the .NET solution, builds the Docker image, pushes it to ECR, and forces a new ECS deployment. Update the ECS task definition image tag strategy before relying on it for automated production releases.

## Security Notes

- RDS is private and not publicly accessible.
- RDS storage is encrypted and deletion protection is configurable.
- ALB ingress is public on HTTP/HTTPS; ECS only accepts traffic from the ALB security group.
- Database ingress only accepts PostgreSQL from ECS tasks.
- Runtime secrets are not committed and should be supplied by Secrets Manager.
- CloudWatch container logging is enabled.
- WAF managed protections and rate limiting are attached to the public ALB when enabled.

## TODOs

- Add remote Terraform state and locking before team or production use.
- Decide final API domain and ACM certificate.
- Replace NAT with VPC endpoints if cost or egress control becomes important.
- Add CloudWatch alarms for ALB 5xx, ECS unhealthy tasks, RDS CPU/storage, and WAF blocked request spikes.
- Automate EF Core migrations through a controlled deployment step.
