# AWS Deployment Execution

This document captures the review-first deployment path and execution record for the first real AWS deployment of the portfolio backend.

## Current Status

- Ready for apply: applied for dev
- AWS CLI: installed and available at `C:\Program Files\Amazon\AWSCLIV2\aws.exe`
- AWS profile: `himendra-dev`
- AWS identity: account `395833164852`, assumed role `AWSReservedSSO_AdministratorAccess_ced0be72c45bd38d/HimendraFernando`
- Terraform CLI: installed and available at `C:\Users\ferna\AppData\Local\Microsoft\WinGet\Packages\Hashicorp.Terraform_Microsoft.Winget.Source_8wekyb3d8bbwe\terraform.exe`
- Docker CLI: installed and Docker Desktop engine is running
- Docker image build: passed for `himendra-portfolio-api:local`
- Docker image push: passed for `395833164852.dkr.ecr.ap-southeast-2.amazonaws.com/himendra-portfolio-dev-api:bootstrap`
- Terraform backend: no active remote backend file is configured; state is local only
- Terraform fmt: passed
- Terraform init: passed with `-backend=false`
- Terraform validate: passed
- Terraform plan: passed with `terraform.tfvars.example`
- Terraform ECR bootstrap apply: passed, 1 resource added
- Terraform full apply: passed, 38 resources added
- Terraform apply summary: 39 total resources added, 0 changed, 0 destroyed
- ECS service: active, 1 desired task, 1 running task, steady state reached
- ALB target health: healthy
- Health endpoint: `http://himendra-portfolio-dev-api-alb-88743127.ap-southeast-2.elb.amazonaws.com/health` returned `200`
- Final Terraform drift check: no changes

## Required Preflight Values

Recommended first-pass values when the user has not chosen otherwise:

```text
AWS region: ap-southeast-2
Environment name: dev
Domain name: none for first deployment
Expected monthly budget: minimal / AWS Free Tier where eligible
Hosting: ECS Fargate behind ALB, because the existing Terraform stack already supports it
Database: RDS PostgreSQL Free Tier shape
```

Confirm these before running real AWS deployment commands:

```text
AWS region:
Environment name:
Domain name, if any:
Expected monthly budget:
Use ECS Fargate or simpler hosting:
Create RDS now or defer database hosting:
```

## Terraform State

The dev environment currently has no committed active backend configuration, so this deployment is using local state. Local state is acceptable only for a short-lived dev experiment and should be migrated to a remote backend before ongoing production use.

For an ongoing deployment, use an S3 backend with DynamoDB locking:

- S3 bucket with server-side encryption
- S3 bucket versioning enabled
- S3 public access blocked
- DynamoDB lock table
- State files never committed to git

An example backend file is provided at `infra/terraform/environments/dev/backend.s3.tf.example`. Copy it to `backend.tf` locally only after the bucket and lock table exist.

## Variables

Safe example values are provided at `infra/terraform/environments/dev/terraform.tfvars.example`.

Required deployment values:

- `aws_region`
- `environment`
- `project_name`
- `cors_allowed_origin`
- `api_image_tag`
- `api_assign_public_ip`
- `enable_nat_gateway`
- `enable_waf`
- `enable_database`
- `database_instance_class`
- `database_allocated_storage_gb`
- `database_deletion_protection`
- `db_connection_string_secret_arn`
- `ip_hash_salt_secret_arn`
- `auth_authority`
- `auth_audience`

Do not commit a real `terraform.tfvars` file. It may contain account-specific values and secret ARNs.

## Secrets Strategy

Runtime secret values must live in AWS Secrets Manager or an equivalent secure provider, not in Terraform variable files.

Required API secrets:

- `ConnectionStrings__PortfolioDatabase`
- `Security__IpHashSalt`

Authentication values currently flow as ECS environment variables:

- `Authentication__Authority`
- `Authentication__Audience`

If either authentication value becomes sensitive, move it to ECS task secrets before production use.

For the Free Tier RDS dev plan, `enable_database = true`, `database_instance_class = "db.t4g.micro"`, and `database_allocated_storage_gb = 20`. This is intended to stay inside AWS RDS Free Tier limits when the account is eligible and usage stays within those limits.

## Docker and ECR Path

The API Terraform module creates an ECR repository and exposes it as `api_ecr_repository_url`.

First deployment sequence:

1. Run Terraform plan and review the ECR repository that will be created.
2. After apply is approved and ECR exists, build the API image:

   ```bash
   docker build -f api/Himendra.Portfolio.Api/Dockerfile -t himendra-portfolio-api:local .
   ```

3. Authenticate Docker to ECR:

   ```bash
   aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com
   ```

4. Tag and push the image:

   ```bash
   docker tag himendra-portfolio-api:local <repository-url>:<image-tag>
   docker push <repository-url>:<image-tag>
   ```

5. Set `api_image_tag` to the pushed tag and run a reviewed Terraform plan.

Do not push images until the target AWS account and repository are confirmed.

## Plan Commands

Run from `infra/terraform/environments/dev` after prerequisites are installed and preflight values are confirmed:

```bash
terraform fmt -recursive
terraform init -backend=false
terraform validate
terraform plan -var-file=terraform.tfvars
```

Use `terraform init` with the configured backend for the final reviewed deployment path. `-backend=false` is only for local syntax/planning work where remote state is not ready.

## Expected Cost Drivers

- RDS PostgreSQL instance and storage
- NAT Gateway and Elastic IP
- Application Load Balancer
- ECS Fargate task runtime
- CloudWatch logs
- WAF web ACL and managed rules
- Route 53 hosted zone or domain, if added later

Cost-conscious dev options:

- Keep `api_desired_count = 1`
- Keep `database_instance_class = "db.t4g.micro"`
- Keep log retention short, such as 14 days
- Keep `enable_database = true` only while AWS Free Tier/credits cover RDS, or disable it when persistence is not needed
- Keep `enable_nat_gateway = false` and `api_assign_public_ip = true` for minimal-cost dev image pulls
- Keep `enable_waf = false` for temporary dev if WAF cost is not acceptable
- For a longer-running private-subnet deployment, replace public task IPs with NAT or VPC endpoints

## Latest Deployment Summary

The latest reviewed Free Tier RDS plan was generated and applied with:

```bash
terraform plan -var-file terraform.tfvars.example
terraform apply -target=module.api.aws_ecr_repository.api -var-file terraform.tfvars.example
terraform apply -var-file terraform.tfvars.example
```

It created 39 resources and made no in-place changes or destroys.

The current Free Tier RDS example changes the intended plan to:

- No NAT Gateway
- No WAF
- RDS PostgreSQL enabled as Single-AZ `db.t4g.micro` with 20 GB storage
- ECS Fargate task placed in public subnets with a public IP for dev egress
- ALB retained as the main remaining non-Free-Tier always-on infrastructure cost

Major resources expected in the Free Tier RDS plan:

- VPC, internet gateway, public/private subnets, and route tables
- ALB, target group, HTTP listener, and public HTTP/HTTPS ingress security rules
- ECS cluster, Fargate service, task definition, task role, and execution role
- ECR repository for the API image
- RDS PostgreSQL instance in private subnets
- Secrets Manager secret for generated app database credentials
- CloudWatch log group

Security-sensitive planned resources:

- Public ALB ingress on ports 80 and 443
- ECS task egress to HTTPS
- Public IP on ECS tasks for minimal-cost dev egress
- Private RDS PostgreSQL reachable only from ECS tasks
- Generated database app credentials stored in Secrets Manager

Resources were created only after explicit approval for the ECR bootstrap apply and full Terraform apply.

Live outputs:

- API ECR repository: `395833164852.dkr.ecr.ap-southeast-2.amazonaws.com/himendra-portfolio-dev-api`
- API image tag: `bootstrap`
- API load balancer: `himendra-portfolio-dev-api-alb-88743127.ap-southeast-2.elb.amazonaws.com`
- Health endpoint: `http://himendra-portfolio-dev-api-alb-88743127.ap-southeast-2.elb.amazonaws.com/health`
- Database endpoint: `himendra-portfolio-dev-postgres.c5o26mck8nj3.ap-southeast-2.rds.amazonaws.com:5432`

Remaining application setup:

- The RDS instance exists, but the API task is not yet configured with a `ConnectionStrings__PortfolioDatabase` secret.
- Database-backed contact/admin workflows require creating the least-privilege database user, running migrations, storing the final connection string in Secrets Manager, and updating `db_connection_string_secret_arn`.
- Admin authentication values are still empty until a real identity provider is configured.

## Future User Approval

Future infrastructure changes still require reviewing `terraform plan` before running:

```bash
terraform apply
```

Do not run further applies or destroys until the Terraform plan and likely cost impact have been reviewed and explicitly approved.
