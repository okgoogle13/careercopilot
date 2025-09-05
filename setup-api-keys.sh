#!/bin/bash

# CareerCopilot API Keys Setup Script
# This script helps you configure your API keys securely

set -e

echo "🚀 CareerCopilot API Keys Configuration"
echo "========================================"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.template .env.local
    echo "✅ Created .env.local from template"
else
    echo "📋 .env.local already exists"
fi

echo ""
echo "📋 Current Service Status:"
echo "=========================="

# Check service health
echo "🔍 Checking services..."
docker-compose -f docker-compose.production.yml ps --format "table {{.Service}}\t{{.State}}\t{{.Status}}"

echo ""
echo "📝 To configure your API keys:"
echo "1. Edit .env.local with your actual API keys"
echo "2. Get API keys from:"
echo "   • OpenAI: https://platform.openai.com/api-keys"
echo "   • Anthropic: https://console.anthropic.com/"
echo "   • Google Gemini: https://makersuite.google.com/app/apikey"
echo ""
echo "3. After updating .env.local, restart services:"
echo "   docker-compose -f docker-compose.production.yml restart"
echo ""

# Show application URLs
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
    echo "❌ Backend (Prod) - Not responding (likely needs API keys)"
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
echo "1. Add your API keys to .env.local"
echo "2. Restart services: docker-compose -f docker-compose.production.yml restart"
echo "3. Test the application at http://localhost:5173"
echo ""
