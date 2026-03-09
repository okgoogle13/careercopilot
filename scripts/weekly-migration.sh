#!/bin/bash
# CareerCopilot KR/M3 Migration Weekly Ritual
# This script automates mapping, token sweeps, and report generation.

set -e

echo "================================================="
echo " KR/M3 Migration: Weekly Execution Ritual        "
echo "================================================="

# 1. Run inventory scan → update JSONs
echo "Step 1: Running Inventory Scan..."
cd frontend
npx tsx scripts/component-inventory.ts
npx tsx scripts/inventory-postprocess.ts
echo "Inventory updated."

# 2. migrate-component-m3.py sweep
echo "Step 2: Sweeping expressive transformations..."
cd ..
python3 scripts/migrate-component-m3.py --auto --design-level atom
python3 scripts/migrate-component-m3.py --auto --design-level molecule
echo "Expressive transformations applied to planned items."

# 3. Report & Storybook Reminder
echo "Step 3: Pending Manual Reviews"
echo "-> Review the top 5 'newly done' components in Storybook"
echo "-> Manually upgrade 1 target Hero Organism per week"

# 4. Git State
echo "Step 4: Committing reports"
git add frontend/reports/*.json
git add frontend/component-inventory.json
git commit -m "chore(design-system): weekly KR/M3 pipeline report update" || echo "No changes to commit"

echo "================================================="
echo " Pipeline Execution Complete!                    "
echo "================================================="
