provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

module "networking" {
  source = "../../modules/networking"

  project_name            = var.project_name
  environment             = var.environment
  vpc_cidr                = var.vpc_cidr
  public_subnet_cidrs     = var.public_subnet_cidrs
  private_subnet_cidrs    = var.private_subnet_cidrs
  enable_nat_gateway      = var.enable_nat_gateway
  single_nat_gateway      = var.single_nat_gateway
  availability_zone_count = var.availability_zone_count
}

module "security" {
  source = "../../modules/security"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.networking.vpc_id
  vpc_cidr     = var.vpc_cidr
  api_port     = var.api_container_port
}

module "database" {
  count = var.enable_database ? 1 : 0

  source = "../../modules/database"

  project_name                  = var.project_name
  environment                   = var.environment
  private_subnet_ids            = module.networking.private_subnet_ids
  database_security_group_id    = module.security.database_security_group_id
  database_name                 = var.database_name
  database_instance_class       = var.database_instance_class
  database_allocated_storage_gb = var.database_allocated_storage_gb
  backup_retention_days         = var.database_backup_retention_days
  deletion_protection           = var.database_deletion_protection
}

module "api" {
  source = "../../modules/api"

  project_name                    = var.project_name
  environment                     = var.environment
  aws_region                      = var.aws_region
  vpc_id                          = module.networking.vpc_id
  public_subnet_ids               = module.networking.public_subnet_ids
  private_subnet_ids              = var.api_assign_public_ip ? module.networking.public_subnet_ids : module.networking.private_subnet_ids
  alb_security_group_id           = module.security.alb_security_group_id
  ecs_security_group_id           = module.security.ecs_security_group_id
  api_container_port              = var.api_container_port
  api_cpu                         = var.api_cpu
  api_memory                      = var.api_memory
  desired_count                   = var.api_desired_count
  image_tag                       = var.api_image_tag
  certificate_arn                 = var.certificate_arn
  cors_allowed_origin             = var.cors_allowed_origin
  auth_authority                  = var.auth_authority
  auth_audience                   = var.auth_audience
  db_connection_string_secret_arn = var.db_connection_string_secret_arn
  db_app_credentials_secret_arn   = try(module.database[0].app_credentials_secret_arn, "")
  database_host                   = try(module.database[0].database_address, "")
  database_port                   = try(module.database[0].database_port, 5432)
  database_name                   = var.database_name
  ip_hash_salt_secret_arn         = var.ip_hash_salt_secret_arn
  log_retention_days              = var.log_retention_days
  enable_waf                      = var.enable_waf
  assign_public_ip                = var.api_assign_public_ip
  enable_cloudfront_https         = var.enable_cloudfront_https
  create_ip_hash_salt_secret      = var.create_ip_hash_salt_secret
}
