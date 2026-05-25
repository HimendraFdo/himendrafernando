output "api_ecr_repository_url" {
  description = "ECR repository URL for API images."
  value       = module.api.ecr_repository_url
}

output "api_load_balancer_dns_name" {
  description = "Public ALB DNS name for the API."
  value       = module.api.load_balancer_dns_name
}

output "api_cloudfront_domain_name" {
  description = "CloudFront default HTTPS domain for the API."
  value       = module.api.cloudfront_domain_name
}

output "database_endpoint" {
  description = "Private RDS PostgreSQL endpoint."
  value       = try(module.database[0].database_endpoint, null)
}

output "database_app_credentials_secret_arn" {
  description = "Generated app database credentials secret ARN. Use these to create a least-privilege DB user."
  value       = try(module.database[0].app_credentials_secret_arn, null)
  sensitive   = true
}

output "api_ip_hash_salt_secret_arn" {
  description = "Secrets Manager ARN used by the API for Security__IpHashSalt."
  value       = module.api.ip_hash_salt_secret_arn
  sensitive   = true
}

output "api_ecs_cluster_name" {
  description = "ECS cluster that runs the API service."
  value       = module.api.ecs_cluster_name
}

output "api_ecs_service_name" {
  description = "ECS service that runs the API task."
  value       = module.api.ecs_service_name
}

output "api_ecs_task_definition_arn" {
  description = "Current API task definition ARN. Can be used for one-off migration tasks."
  value       = module.api.ecs_task_definition_arn
}

output "api_ecs_task_subnet_ids" {
  description = "Subnets used by API ECS tasks."
  value       = module.api.ecs_task_subnet_ids
}

output "api_ecs_task_security_group_id" {
  description = "Security group used by API ECS tasks."
  value       = module.api.ecs_task_security_group_id
}

output "api_ecs_task_assign_public_ip" {
  description = "Whether API ECS tasks receive a public IP."
  value       = module.api.ecs_task_assign_public_ip
}
