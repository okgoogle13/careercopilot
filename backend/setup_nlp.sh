#!/bin/bash
# Setup script for NLP optimization with spaCy

set -e

echo "🔧 Setting up NLP optimization with spaCy"
echo "======================================="

# Check if we're in the backend directory
if [[ ! -f "requirements.in" ]]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Install spaCy if not already installed
echo "📦 Installing spaCy..."
pip install spacy

# Download the English model
echo "📚 Downloading en_core_web_sm model..."
python -m spacy download en_core_web_sm

# Verify installation
echo "✅ Verifying spaCy installation..."
python -c "import spacy; nlp = spacy.load('en_core_web_sm'); print(f'spaCy {spacy.__version__} with en_core_web_sm model is ready!')"

echo ""
echo "🎉 NLP optimization setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your requirements: pip-compile requirements.in"
echo "2. Set environment variable: export ENABLE_NLP_PRELOAD=true"
echo "3. Test the optimization: python test_nlp_optimization.py"
echo ""
echo "Performance improvement expected:"
echo "- Before: ~2000-3000ms per resume parse (loading model each time)"
echo "- After: ~20-50ms per resume parse (using cached model)"
echo "- Speed improvement: ~50-100x faster!"
