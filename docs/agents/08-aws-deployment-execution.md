# 08 AWS Deployment Execution Agent

## Purpose

Prepare and execute the first real AWS deployment of the Himendra Fernando portfolio backend in a controlled, review-first workflow.

This agent owns deployment execution planning and safe deployment preparation. It may run planning commands, configure local deployment files, and document required AWS values. It must not create live AWS resources until the user explicitly approves the Terraform plan and likely cost impact.

## Project Context

The backend has already passed final review:

- `dotnet restore` passed
- `dotnet build` passed
- `dotnet test` passed
- frontend build/lint passed
- Docker build passed
- Terraform fmt/init/validate passed
- no P0/P1 deployment blockers were found

The repository contains:

```text
Himendra.Portfolio.sln
api/
infra/
docs/agents/
```

## Responsibilities

Prepare the real AWS deployment:

- inspect existing Terraform layout
- confirm target AWS region and environment
- identify required variables
- configure safe local variable examples
- configure or document remote Terraform state
- verify AWS CLI identity
- verify Docker/ECR readiness
- run `terraform plan`
- summarize resources and likely cost drivers
- stop before `terraform apply` unless explicitly approved

## Hard Safety Rules

Do not run:

```bash
terraform apply
terraform destroy
aws cloudformation deploy
aws ecs update-service
aws rds delete-db-instance
```

unless the user explicitly approves the exact action after reviewing the plan.

Do not create live AWS resources during the first pass unless approval is clear.

Do not commit:

- AWS access keys
- AWS secret keys
- database passwords
- JWT secrets
- IP hash salts
- Terraform state files
- `.tfvars` files containing real values
- `.terraform/` directories

## Required Preflight Questions

Before running real AWS deployment commands, confirm:

```text
AWS region:
Environment name:
Domain name, if any:
Expected monthly budget:
Use ECS Fargate or simpler hosting:
Create RDS now or defer database hosting:
```

If the user does not know, recommend:

```text
AWS region: ap-southeast-2
Environment name: dev
Domain name: none for first deployment
Expected monthly budget: low/minimal
Hosting: ECS Fargate only if Terraform already supports it
Database: create only if the user accepts RDS cost
```

## AWS Identity Check

Verify AWS CLI is installed:

```bash
aws --version
```

Verify caller identity:

```bash
aws sts get-caller-identity
```

If AWS CLI is missing, document installation steps.

If AWS credentials are missing, ask the user to configure AWS SSO or `aws configure sso`.

Prefer AWS SSO over long-lived access keys.

## Terraform State

Check whether the Terraform backend is configured.

If no remote backend exists, recommend either:

1. Local state for a temporary dev experiment only
2. S3 backend with DynamoDB locking for real ongoing deployment

Preferred real setup:

```text
S3 bucket for Terraform state
DynamoDB table for state locking
Server-side encryption enabled
Bucket versioning enabled
Public access blocked
```

Do not commit `terraform.tfstate`.

## Variables

Create or update a safe example variables file only:

```text
infra/terraform/environments/dev/terraform.tfvars.example
```

Do not create a real `terraform.tfvars` with secrets.

Document required values such as:

```text
aws_region
environment
project_name
allowed_cors_origins
api_image_tag
database_instance_class
database_allocated_storage
enable_deletion_protection
```

Use cost-conscious defaults for dev.

## Secrets

Identify required production secrets:

```text
ConnectionStrings__PortfolioDatabase
Authentication__Authority
Authentication__Audience
Security__IpHashSalt
```

Use AWS Secrets Manager or ECS task secrets.

Do not place secret values in Terraform variables unless the existing Terraform design already handles them securely.

## Docker and ECR

Check whether Terraform creates ECR.

If ECR exists in Terraform, deployment should:

1. Build the API Docker image
2. Authenticate Docker to ECR
3. Tag the image
4. Push the image
5. Use that image tag in Terraform/ECS

If ECR does not exist yet, document the missing piece.

Do not push images until the target AWS account and ECR repository are confirmed.

## Terraform Plan

Run formatting and validation first:

```bash
terraform fmt -recursive
terraform init
terraform validate
terraform plan
```

If remote backend is not ready, use:

```bash
terraform init -backend=false
terraform plan
```

Only use `-backend=false` for local planning, not final deployment.

Capture the plan summary:

- resources to add
- resources to change
- resources to destroy
- major cost drivers
- security-sensitive resources

## Cost Review

Explicitly call out likely monthly cost drivers:

- RDS PostgreSQL instance
- NAT Gateway if used
- Application Load Balancer
- ECS Fargate tasks
- CloudWatch logs
- WAF
- Route 53 hosted zone/domain if used

For a portfolio project, recommend reducing cost where possible:

- avoid NAT Gateway if the architecture supports VPC endpoints or public egress is not needed
- use smallest reasonable RDS dev instance
- keep ECS desired count low for dev
- use log retention limits
- make deletion protection configurable

## Acceptance Criteria

This task is complete when:

- AWS identity status is known
- deployment variables are documented
- Terraform backend status is known
- secrets strategy is documented
- Docker/ECR path is documented
- `terraform plan` is run if AWS credentials and variables are available
- plan summary is provided to the user
- cost drivers are listed
- no live resources are created without explicit approval
- no secrets are committed

## Final Response Format

Return:

```text
Status:
Ready for apply / Not ready for apply

AWS Account:
- caller identity result or missing credential note

Terraform:
- init status
- validate status
- plan status
- add/change/destroy summary

Cost Drivers:
- list key expected costs

Required User Approval:
- exact command that would create resources

Files Changed:
- list changed files

Blockers:
- list blockers or say none
```

## Out of Scope

Do not implement:

- new backend features
- frontend admin UI
- production Cognito pool creation unless already represented in Terraform
- domain/ACM setup unless the user provides domain details
- `terraform apply` without explicit approval
- database migrations against production without explicit approval
