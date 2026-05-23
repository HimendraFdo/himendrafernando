locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

resource "random_password" "app_user" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "app_credentials" {
  name        = "${local.name_prefix}/database/app-user"
  description = "Generated credentials intended for the least-privilege API database user."
}

resource "aws_secretsmanager_secret_version" "app_credentials" {
  secret_id = aws_secretsmanager_secret.app_credentials.id
  secret_string = jsonencode({
    username = "${replace(var.project_name, "-", "_")}_${var.environment}_api"
    password = random_password.app_user.result
    database = var.database_name
  })
}

resource "aws_db_subnet_group" "this" {
  name       = "${local.name_prefix}-db-subnets"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${local.name_prefix}-db-subnets"
  }
}

resource "aws_db_instance" "this" {
  identifier                            = "${local.name_prefix}-postgres"
  engine                                = "postgres"
  engine_version                        = "16"
  instance_class                        = var.database_instance_class
  allocated_storage                     = var.database_allocated_storage_gb
  storage_encrypted                     = true
  db_name                               = var.database_name
  username                              = "portfolio_admin"
  manage_master_user_password           = true
  db_subnet_group_name                  = aws_db_subnet_group.this.name
  vpc_security_group_ids                = [var.database_security_group_id]
  publicly_accessible                   = false
  backup_retention_period               = var.backup_retention_days
  deletion_protection                   = var.deletion_protection
  skip_final_snapshot                   = !var.deletion_protection
  enabled_cloudwatch_logs_exports       = ["postgresql", "upgrade"]
  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  auto_minor_version_upgrade            = true
  copy_tags_to_snapshot                 = true

  tags = {
    Name = "${local.name_prefix}-postgres"
  }
}
