output "database_endpoint" {
  value = aws_db_instance.this.endpoint
}

output "database_address" {
  value = aws_db_instance.this.address
}

output "database_port" {
  value = aws_db_instance.this.port
}

output "database_name" {
  value = aws_db_instance.this.db_name
}

output "app_credentials_secret_arn" {
  value     = aws_secretsmanager_secret.app_credentials.arn
  sensitive = true
}
