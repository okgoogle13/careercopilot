# CareerCopilot Redis Cache Infrastructure
# Provisions Google Cloud Memorystore for Redis instance for LLM response caching

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "careercopilot-468811"
}

variable "region" {
  description = "The GCP region for resources"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
  default     = "production"
}

# Redis instance for LLM response caching
resource "google_redis_instance" "careercopilot_cache" {
  name           = "careercopilot-cache-${var.environment}"
  project        = var.project_id
  region         = var.region
  memory_size_gb = 1
  tier           = "BASIC"

  # Redis version
  redis_version = "REDIS_7_0"

  # Network configuration
  authorized_network = data.google_compute_network.default.id

  # Maintenance policy
  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 2
        minutes = 0
        nanos   = 0
      }
    }
  }

  # Labels for resource management
  labels = {
    environment = var.environment
    service     = "careercopilot"
    component   = "ai-cache"
    managed_by  = "terraform"
  }

  # Display name
  display_name = "CareerCopilot AI Cache (${var.environment})"
}

# Get default VPC network
data "google_compute_network" "default" {
  name = "default"
}

# Outputs
output "redis_host" {
  description = "The hostname/IP address of the Redis instance"
  value       = google_redis_instance.careercopilot_cache.host
}

output "redis_port" {
  description = "The port number of the Redis instance"
  value       = google_redis_instance.careercopilot_cache.port
}

output "redis_connection_string" {
  description = "Complete Redis connection string for application use"
  value       = "redis://${google_redis_instance.careercopilot_cache.host}:${google_redis_instance.careercopilot_cache.port}/0"
  sensitive   = true
}

output "redis_instance_id" {
  description = "The unique identifier of the Redis instance"
  value       = google_redis_instance.careercopilot_cache.id
}

output "redis_current_location_id" {
  description = "The current zone where the Redis endpoint is placed"
  value       = google_redis_instance.careercopilot_cache.current_location_id
}