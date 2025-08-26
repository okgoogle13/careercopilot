#!/bin/bash

# CareerCopilot Production Deployment Script
# This script deploys the complete CareerCopilot system to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_ENV=${1:-production}
BACKUP_DB=${2:-true}
RUN_MIGRATIONS=${3:-true}

echo -e "${BLUE}🚀 Starting CareerCopilot Production Deployment${NC}"
echo -e "${BLUE}Environment: ${DEPLOYMENT_ENV}${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: .env.production file not found${NC}"
    echo -e "${YELLOW}Please create .env.production with required environment variables${NC}"
    exit 1
fi

# Load environment variables
set -a
source .env.production
set +a

# Validate required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET_KEY" "OPENAI_API_KEY" "REDIS_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Error: Required environment variable $var is not set${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Environment validation passed${NC}"

# Create necessary directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p data/{cache/{ai_operations,ai_responses,general,jobs,profiles,research},uploads}
mkdir -p logs
mkdir -p backups
mkdir -p ssl

# Backup existing database if requested
if [ "$BACKUP_DB" = "true" ]; then
    echo -e "${BLUE}💾 Creating database backup...${NC}"
    timestamp=$(date +%Y%m%d_%H%M%S)
    
    if docker-compose -f docker-compose.production.yml ps postgres | grep -q "Up"; then
        docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U careercopilot careercopilot > "backups/careercopilot_backup_${timestamp}.sql"
        echo -e "${GREEN}✅ Database backup created: backups/careercopilot_backup_${timestamp}.sql${NC}"
    else
        echo -e "${YELLOW}⚠️  Database not running, skipping backup${NC}"
    fi
fi

# Pull latest images
echo -e "${BLUE}📥 Pulling latest Docker images...${NC}"
docker-compose -f docker-compose.production.yml pull

# Build custom images
echo -e "${BLUE}🔨 Building application images...${NC}"
docker-compose -f docker-compose.production.yml build --no-cache

# Stop existing services gracefully
echo -e "${BLUE}⏹️  Stopping existing services...${NC}"
docker-compose -f docker-compose.production.yml down --timeout 30

# Start infrastructure services first
echo -e "${BLUE}🗄️  Starting infrastructure services...${NC}"
docker-compose -f docker-compose.production.yml up -d postgres redis

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for infrastructure services to be healthy...${NC}"
timeout 60 sh -c 'until docker-compose -f docker-compose.production.yml ps postgres | grep -q "healthy"; do sleep 2; done'
timeout 60 sh -c 'until docker-compose -f docker-compose.production.yml ps redis | grep -q "healthy"; do sleep 2; done'

# Run database migrations if requested
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo -e "${BLUE}🔄 Running database migrations...${NC}"
    
    # Start backend temporarily for migrations
    docker-compose -f docker-compose.production.yml run --rm backend alembic upgrade head
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database migrations completed successfully${NC}"
    else
        echo -e "${RED}❌ Database migrations failed${NC}"
        exit 1
    fi
fi

# Start all services
echo -e "${BLUE}🚀 Starting all services...${NC}"
docker-compose -f docker-compose.production.yml up -d

# Wait for backend to be healthy
echo -e "${BLUE}⏳ Waiting for backend service to be healthy...${NC}"
timeout 120 sh -c 'until docker-compose -f docker-compose.production.yml ps backend | grep -q "healthy"; do sleep 5; done'

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend service is healthy${NC}"
else
    echo -e "${RED}❌ Backend service failed to start properly${NC}"
    echo -e "${YELLOW}Check logs with: docker-compose -f docker-compose.production.yml logs backend${NC}"
    exit 1
fi

# Test API endpoints
echo -e "${BLUE}🧪 Testing API endpoints...${NC}"
health_check=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health || echo "000")

if [ "$health_check" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed (HTTP $health_check)${NC}"
    echo -e "${YELLOW}Check logs with: docker-compose -f docker-compose.production.yml logs backend${NC}"
    exit 1
fi

# Show service status
echo -e "${BLUE}📊 Service Status:${NC}"
docker-compose -f docker-compose.production.yml ps

# Show resource usage
echo -e "${BLUE}💾 Resource Usage:${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}Access Points:${NC}"
echo -e "  🌐 API: http://localhost:8000"
echo -e "  📊 Grafana: http://localhost:3000 (admin/admin)"
echo -e "  📈 Prometheus: http://localhost:9090"
echo -e "  🔍 API Docs: http://localhost:8000/docs"
echo ""
echo -e "${BLUE}Management Commands:${NC}"
echo -e "  📋 View logs: ${YELLOW}docker-compose -f docker-compose.production.yml logs -f${NC}"
echo -e "  ⏹️  Stop services: ${YELLOW}docker-compose -f docker-compose.production.yml down${NC}"
echo -e "  📊 Monitor: ${YELLOW}docker-compose -f docker-compose.production.yml ps${NC}"
echo ""
echo -e "${GREEN}✅ CareerCopilot is now running in production mode!${NC}"