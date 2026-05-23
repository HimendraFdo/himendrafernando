output "api_ecr_repository_url" {
  description = "ECR repository URL for API images."
  value       = module.api.ecr_repository_url
}

output "api_load_balancer_dns_name" {
  description = "Public ALB DNS name for the API."
  value       = module.api.load_balancer_dns_name
}

output "database_endpoint" {
  description = "Private RDS PostgreSQL endpoint."
  value       = module.database.database_endpoint
}

output "database_app_credentials_secret_arn" {
  description = "Generated app database credentials secret ARN. Use these to create a least-privilege DB user."
  value       = module.database.app_credentials_secret_arn
  sensitive   = true
}
