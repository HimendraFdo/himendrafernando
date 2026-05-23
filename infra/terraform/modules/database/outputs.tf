output "database_endpoint" {
  value = aws_db_instance.this.endpoint
}

output "app_credentials_secret_arn" {
  value     = aws_secretsmanager_secret.app_credentials.arn
  sensitive = true
}
