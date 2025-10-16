#!/bin/bash

# CareerCopilot API Keys and Configuration Setup Script
# This script helps you configure your API keys and validate your setup

set -e

echo "🚀 CareerCopilot Configuration & API Keys Setup"
echo "==============================================="
echo ""

# Function to check if Python script exists and run it
run_python_script() {
    local script_path="$1"
    local description="$2"

    if [ -f "$script_path" ]; then
        echo "🔧 Running $description..."
        python3 "$script_path" "$@"
    else
        echo "⚠️  $script_path not found, skipping $description"
    fi
}

# Check if we're in development or production mode
ENVIRONMENT=${ENVIRONMENT:-development}
echo "📋 Environment: $ENVIRONMENT"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    if [ -f .env.local.template ]; then
        cp .env.local.template .env.local
        echo "✅ Created .env.local from template"
    else
        echo "⚠️  .env.local.template not found, creating basic .env.local"
        cat > .env.local << EOF
# CareerCopilot Local Environment Configuration
ENVIRONMENT=development
DEBUG=true

# AI Service API Keys (get from respective platforms)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=

# Database (local development)
DATABASE_URL=sqlite:///data/careercopilot-dev.db

# Firebase Configuration
FIREBASE_PROJECT_ID=careercopilot-468811
GCP_PROJECT_ID=careercopilot-468811

# Security
SECRET_KEY=development-secret-key-change-for-production
EOF
        echo "✅ Created basic .env.local"
    fi
else
    echo "📋 .env.local already exists"
fi

echo ""
echo "🔍 Configuration Setup Options:"
echo "================================"
echo ""
echo "Choose your setup method:"
echo "1. Local Development (environment variables only)"
echo "2. Production Setup (Google Cloud Secret Manager)"
echo "3. Test Current Configuration"
echo "4. Skip configuration setup"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📝 Local Development Setup"
        echo "=========================="
        echo ""
        echo "Please edit .env.local with your API keys:"
        echo "• OpenAI: https://platform.openai.com/api-keys"
        echo "• Anthropic: https://console.anthropic.com/"
        echo "• Google Gemini: https://makersuite.google.com/app/apikey"
        echo ""
        echo "Then restart your development services."
        ;;
    2)
        echo ""
        echo "🔐 Production Setup with Secret Manager"
        echo "======================================"
        run_python_script "scripts/setup-production-secrets.py" "Production Secrets Setup"
        run_python_script "scripts/setup-firebase-config.py" "Firebase Configuration Setup"
        ;;
    3)
        echo ""
        echo "🧪 Testing Current Configuration"
        echo "==============================="
        run_python_script "scripts/test-configuration.py" "Configuration Test"
        ;;
    4)
        echo "⏭️  Skipping configuration setup"
        ;;
    *)
        echo "❌ Invalid choice, skipping configuration setup"
        ;;
esac

echo ""
echo "📋 Service Status Check:"
echo "========================"

# Check if docker-compose file exists and services are running
if [ -f docker-compose.production.yml ]; then
    echo "🔍 Checking production services..."
    if command -v docker-compose &> /dev/null; then
        docker-compose -f docker-compose.production.yml ps --format "table {{.Service}}\t{{.State}}\t{{.Status}}" || echo "No services running"
    else
        echo "Docker Compose not available"
    fi
else
    echo "docker-compose.production.yml not found"
fi

echo ""
echo "🌐 Application URLs:"
echo "==================="
echo "• Frontend (Dev): http://localhost:5173"
echo "• Backend (Prod): http://localhost:8000"
echo "• Backend (Dev):  http://localhost:8001"
echo "• Grafana:        http://localhost:3000"
echo "• PostgreSQL:     localhost:5432"
echo "• Redis:          localhost:6379"
echo ""

# Test basic connectivity
echo "🧪 Basic Connectivity Test:"
echo "============================"

# Test backend health
if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    echo "✅ Backend (Prod) - Responding"
else
    echo "❌ Backend (Prod) - Not responding"
fi

if curl -s http://localhost:8001/health >/dev/null 2>&1; then
    echo "✅ Backend (Dev) - Responding"
else
    echo "❌ Backend (Dev) - Not responding"
fi

# Test frontend
if curl -s http://localhost:5173 >/dev/null 2>&1; then
    echo "✅ Frontend - Responding"
else
    echo "❌ Frontend - Not responding"
fi

echo ""
echo "💡 Next Steps:"
echo "=============="

if [ "$choice" = "1" ]; then
    echo "1. Edit .env.local with your actual API keys"
    echo "2. Restart development services"
    echo "3. Test the application at http://localhost:5173"
elif [ "$choice" = "2" ]; then
    echo "1. Verify all secrets are configured in Google Cloud"
    echo "2. Deploy with production environment variables"
    echo "3. Run configuration test: python3 scripts/test-configuration.py"
else
    echo "1. Choose a configuration method above"
    echo "2. Run this script again to complete setup"
    echo "3. Test your configuration when ready"
fi

echo ""
echo "🔧 Available Configuration Scripts:"
echo "==================================="
echo "• scripts/setup-production-secrets.py - Set up production secrets"
echo "• scripts/setup-firebase-config.py - Configure Firebase"
echo "• scripts/test-configuration.py - Test all configurations"
echo ""
