variable "aws_region" {
  description = "AWS region for the dev environment."
  type        = string
  default     = "ap-southeast-2"
}

variable "project_name" {
  description = "Name prefix used for AWS resources."
  type        = string
  default     = "himendra-portfolio"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.40.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public ALB subnets."
  type        = list(string)
  default     = ["10.40.0.0/24", "10.40.1.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private ECS and RDS subnets."
  type        = list(string)
  default     = ["10.40.10.0/24", "10.40.11.0/24"]
}

variable "availability_zone_count" {
  description = "Number of availability zones to use."
  type        = number
  default     = 2
}

variable "enable_nat_gateway" {
  description = "Allow private ECS tasks to pull images and reach AWS APIs through NAT."
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Use one NAT gateway for dev cost control. Set false for multi-AZ production resilience."
  type        = bool
  default     = true
}

variable "api_assign_public_ip" {
  description = "Run ECS tasks in the supplied subnets with public IPs. Useful for minimal-cost dev without NAT."
  type        = bool
  default     = false
}

variable "api_container_port" {
  description = "Port exposed by the ASP.NET Core container."
  type        = number
  default     = 8080
}

variable "api_cpu" {
  description = "Fargate task CPU units."
  type        = number
  default     = 256
}

variable "api_memory" {
  description = "Fargate task memory in MiB."
  type        = number
  default     = 512
}

variable "api_desired_count" {
  description = "Desired ECS task count."
  type        = number
  default     = 1
}

variable "api_image_tag" {
  description = "Container image tag deployed by Terraform."
  type        = string
  default     = "latest"
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS. Leave empty to create HTTP-only dev listener."
  type        = string
  default     = ""
}

variable "cors_allowed_origin" {
  description = "Frontend origin allowed by API CORS."
  type        = string
  default     = ""
}

variable "auth_authority" {
  description = "JWT authority URL for admin authentication."
  type        = string
  default     = ""
}

variable "auth_audience" {
  description = "JWT audience for admin authentication."
  type        = string
  default     = ""
}

variable "db_connection_string_secret_arn" {
  description = "Secrets Manager ARN containing the production PortfolioDatabase connection string."
  type        = string
  default     = ""
}

variable "ip_hash_salt_secret_arn" {
  description = "Secrets Manager ARN containing Security__IpHashSalt."
  type        = string
  default     = ""
}

variable "database_name" {
  description = "Initial PostgreSQL database name."
  type        = string
  default     = "portfolio"
}

variable "enable_database" {
  description = "Create the RDS PostgreSQL database. Disable for minimal-cost API-only dev deployments."
  type        = bool
  default     = true
}

variable "database_instance_class" {
  description = "RDS PostgreSQL instance class."
  type        = string
  default     = "db.t4g.micro"
}

variable "database_allocated_storage_gb" {
  description = "RDS storage size in GiB."
  type        = number
  default     = 20
}

variable "database_backup_retention_days" {
  description = "RDS automated backup retention."
  type        = number
  default     = 7
}

variable "database_deletion_protection" {
  description = "Protect RDS from accidental deletion."
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "CloudWatch log retention for the API."
  type        = number
  default     = 30
}

variable "enable_waf" {
  description = "Attach AWS WAF managed protections to the ALB."
  type        = bool
  default     = true
}

variable "enable_cloudfront_https" {
  description = "Create a CloudFront distribution that provides HTTPS on the default cloudfront.net domain and forwards to the API ALB."
  type        = bool
  default     = false
}

variable "create_ip_hash_salt_secret" {
  description = "Create a Secrets Manager value for Security__IpHashSalt when ip_hash_salt_secret_arn is not supplied."
  type        = bool
  default     = false
}
