#!/usr/bin/env python3
"""
Backend Feature Extraction Script
Analyzes all remote branches and generates a value-scored report for consolidation decisions.

Usage: python3 scripts/extract_backend_features.py
Output: branch_analysis.json
"""

import subprocess
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple
from collections import defaultdict


# File patterns and their scores
SCORING_PATTERNS = {
    'ai_genkit': {
        'patterns': ['genkit_flows/', 'ai_operations/', 'genkit_'],
        'score': 10,
        'label': '🤖 AI/Genkit'
    },
    'api_endpoints': {
        'patterns': ['api/endpoints/', 'api/routers/', 'api/routes/'],
        'score': 5,
        'label': '🔌 API Endpoints'
    },
    'core_logic': {
        'patterns': ['app/core/', 'app/services/', 'app/workflows/'],
        'score': 7,
        'label': '⚙️ Core Logic'
    },
    'frontend': {
        'patterns': ['frontend/', 'components/', '.tsx', '.jsx'],
        'score': -2,
        'label': '🎨 Frontend'
    },
    'tests': {
        'patterns': ['test_', '_test.py', '.test.ts', '.spec.'],
        'score': 3,
        'label': '🧪 Tests'
    },
    'docs': {
        'patterns': ['docs/', 'README', '.md'],
        'score': 1,
        'label': '📚 Documentation'
    }
}


def run_git_command(command: List[str]) -> str:
    """Run a git command and return the output."""
    try:
        result = subprocess.run(
            command,
            cwd=Path(__file__).parent.parent,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Warning: Git command failed: {' '.join(command)}", file=sys.stderr)
        print(f"   Error: {e.stderr}", file=sys.stderr)
        return ""


def get_base_branch() -> str:
    """Determine the base branch (develop or main)."""
    for branch in ['develop', 'main']:
        result = run_git_command(['git', 'rev-parse', '--verify', branch])
        if result:
            return branch
    
    # Fall back to current branch
    current = run_git_command(['git', 'rev-parse', '--abbrev-ref', 'HEAD'])
    if current:
        print(f"⚠️ Warning: Neither 'develop' nor 'main' exists, using current branch: {current}", file=sys.stderr)
        return current
    
    print("❌ Error: Could not determine base branch", file=sys.stderr)
    sys.exit(1)


def get_remote_branches() -> List[str]:
    """Get all remote branches except HEAD and the base branch."""
    output = run_git_command(['git', 'branch', '-r'])
    branches = []
    
    for line in output.split('\n'):
        line = line.strip()
        if 'HEAD' in line or not line:
            continue
        
        # Remove 'origin/' prefix
        if line.startswith('origin/'):
            branch = line.replace('origin/', '')
            branches.append(branch)
    
    return branches


def get_branch_info(branch: str, base_branch: str) -> Dict:
    """Get detailed information about a branch."""
    full_branch = f"origin/{branch}"
    
    # Get last commit date
    last_commit_date = run_git_command([
        'git', 'log', '-1', '--format=%ci', full_branch
    ])
    
    # Get last commit message
    last_commit_msg = run_git_command([
        'git', 'log', '-1', '--format=%s', full_branch
    ])
    
    # Get commit count ahead of base
    commits_ahead = run_git_command([
        'git', 'rev-list', '--count', f'{base_branch}..{full_branch}'
    ])
    
    # Get changed files
    changed_files_output = run_git_command([
        'git', 'diff', '--name-only', f'{base_branch}...{full_branch}'
    ])
    
    changed_files = [f for f in changed_files_output.split('\n') if f]
    
    return {
        'branch_name': branch,
        'last_commit_date': last_commit_date,
        'last_commit_message': last_commit_msg,
        'commits_ahead': int(commits_ahead) if commits_ahead.isdigit() else 0,
        'changed_files': changed_files,
        'total_files_changed': len(changed_files)
    }


def categorize_files(files: List[str]) -> Dict[str, List[str]]:
    """Categorize files based on patterns."""
    categorized = defaultdict(list)
    
    for file in files:
        file_lower = file.lower()
        matched = False
        
        for category, config in SCORING_PATTERNS.items():
            for pattern in config['patterns']:
                if pattern.lower() in file_lower:
                    categorized[category].append(file)
                    matched = True
                    break
            if matched:
                break
        
        if not matched:
            categorized['other'].append(file)
    
    return dict(categorized)


def calculate_value_score(categorized_files: Dict[str, List[str]]) -> Tuple[int, Dict[str, int]]:
    """Calculate the value score for a branch based on file categories."""
    score = 0
    breakdown = {}
    
    for category, files in categorized_files.items():
        if category in SCORING_PATTERNS:
            category_score = len(files) * SCORING_PATTERNS[category]['score']
            score += category_score
            breakdown[category] = {
                'count': len(files),
                'points_per_file': SCORING_PATTERNS[category]['score'],
                'total_points': category_score,
                'label': SCORING_PATTERNS[category]['label']
            }
    
    return score, breakdown


def get_value_category(score: int, total_files: int) -> Tuple[str, str]:
    """Determine the value category based on score."""
    if score >= 50 or (score >= 30 and total_files >= 10):
        return 'HIGH', '🟢'
    elif score >= 20 or (score >= 10 and total_files >= 5):
        return 'MEDIUM', '🟡'
    else:
        return 'LOW', '🔴'


def generate_recommendations(branch_data: Dict) -> List[str]:
    """Generate actionable recommendations for a branch."""
    recommendations = []
    
    score = branch_data['value_score']
    category = branch_data['value_category']
    categorized = branch_data['categorized_files']
    
    if category == 'HIGH':
        recommendations.append("✅ High priority for consolidation")
        recommendations.append("🔀 Merge entire branch or cherry-pick all backend commits")
        
        if 'ai_genkit' in categorized and len(categorized['ai_genkit']) > 0:
            recommendations.append("🤖 Contains valuable AI/Genkit work - review carefully")
        
        if 'api_endpoints' in categorized and len(categorized['api_endpoints']) > 0:
            recommendations.append("🔌 API endpoints added - check for conflicts with develop")
    
    elif category == 'MEDIUM':
        recommendations.append("⚠️ Medium priority - selective merge recommended")
        recommendations.append("🔍 Review commits individually before merging")
        
        if 'frontend' in categorized and len(categorized.get('frontend', [])) > 3:
            recommendations.append("🎨 High frontend changes - consider cherry-picking backend only")
        
        recommendations.append("🔀 Use cherry-pick helper for backend-only extraction")
    
    else:  # LOW
        recommendations.append("🔴 Low priority - likely skip or archive")
        
        if score < 0:
            recommendations.append("⚠️ Negative score - mostly frontend changes")
            recommendations.append("💡 Extract any backend work manually if needed")
        else:
            recommendations.append("📦 Consider archiving unless contains critical fixes")
    
    # Age-based recommendations
    if branch_data['commits_ahead'] > 50:
        recommendations.append("⚠️ Many commits ahead - expect merge conflicts")
    
    return recommendations


def analyze_all_branches() -> Dict:
    """Analyze all branches and generate a comprehensive report."""
    print("🔍 Starting branch analysis...")
    print()
    
    # Fetch latest branches
    print("⏳ Fetching remote branches...")
    run_git_command(['git', 'fetch', '--all', '--quiet'])
    print("✅ Branches fetched")
    print()
    
    base_branch = get_base_branch()
    print(f"📊 Base branch: {base_branch}")
    print()
    
    branches = get_remote_branches()
    
    # Filter out base branch
    branches = [b for b in branches if b != base_branch]
    
    print(f"📋 Found {len(branches)} branches to analyze")
    print()
    
    analyzed_branches = []
    
    for i, branch in enumerate(branches, 1):
        print(f"[{i}/{len(branches)}] Analyzing: {branch}...", end=' ')
        
        try:
            info = get_branch_info(branch, base_branch)
            categorized = categorize_files(info['changed_files'])
            value_score, score_breakdown = calculate_value_score(categorized)
            value_category, emoji = get_value_category(value_score, info['total_files_changed'])
            
            branch_analysis = {
                **info,
                'categorized_files': categorized,
                'value_score': value_score,
                'score_breakdown': score_breakdown,
                'value_category': value_category,
                'category_emoji': emoji,
                'recommendations': generate_recommendations({
                    'value_score': value_score,
                    'value_category': value_category,
                    'categorized_files': categorized,
                    'commits_ahead': info['commits_ahead']
                })
            }
            
            analyzed_branches.append(branch_analysis)
            print(f"{emoji} Score: {value_score}")
        
        except Exception as e:
            print(f"❌ Error: {e}")
            continue
    
    # Sort by value score (highest first)
    analyzed_branches.sort(key=lambda x: x['value_score'], reverse=True)
    
    print()
    print("✅ Analysis complete!")
    print()
    
    return {
        'analysis_date': datetime.now().isoformat(),
        'base_branch': base_branch,
        'total_branches_analyzed': len(analyzed_branches),
        'branches': analyzed_branches,
        'scoring_system': SCORING_PATTERNS
    }


def print_summary(analysis: Dict):
    """Print a human-readable summary of the analysis."""
    print("═" * 80)
    print("📊 BRANCH CONSOLIDATION ANALYSIS REPORT")
    print("═" * 80)
    print()
    print(f"📅 Analysis Date: {analysis['analysis_date']}")
    print(f"🌿 Base Branch: {analysis['base_branch']}")
    print(f"📋 Total Branches: {analysis['total_branches_analyzed']}")
    print()
    
    # Category counts
    high_value = sum(1 for b in analysis['branches'] if b['value_category'] == 'HIGH')
    medium_value = sum(1 for b in analysis['branches'] if b['value_category'] == 'MEDIUM')
    low_value = sum(1 for b in analysis['branches'] if b['value_category'] == 'LOW')
    
    print("📈 Category Distribution:")
    print(f"   🟢 HIGH VALUE: {high_value} branches")
    print(f"   🟡 MEDIUM VALUE: {medium_value} branches")
    print(f"   🔴 LOW VALUE: {low_value} branches")
    print()
    
    # Top branches
    print("🏆 TOP BRANCHES BY VALUE SCORE:")
    print("═" * 80)
    print(f"{'RANK':<6} {'BRANCH':<40} {'SCORE':<8} {'CATEGORY':<12} {'FILES':<8}")
    print("─" * 80)
    
    for i, branch in enumerate(analysis['branches'][:15], 1):
        branch_name = branch['branch_name'][:38]
        score = branch['value_score']
        category = f"{branch['category_emoji']} {branch['value_category']}"
        files = branch['total_files_changed']
        
        print(f"{i:<6} {branch_name:<40} {score:<8} {category:<12} {files:<8}")
    
    if len(analysis['branches']) > 15:
        print(f"\n... and {len(analysis['branches']) - 15} more branches")
    
    print()
    print("═" * 80)
    print()
    
    # Detailed recommendations for HIGH value branches
    high_branches = [b for b in analysis['branches'] if b['value_category'] == 'HIGH']
    
    if high_branches:
        print("🟢 HIGH VALUE BRANCHES - IMMEDIATE ACTION RECOMMENDED:")
        print("═" * 80)
        
        for branch in high_branches:
            print(f"\n📌 {branch['branch_name']}")
            print(f"   Score: {branch['value_score']} | Files: {branch['total_files_changed']} | Commits: {branch['commits_ahead']}")
            print(f"   Last commit: {branch['last_commit_date'][:10]}")
            print(f"   Message: {branch['last_commit_message'][:60]}")
            print("   Recommendations:")
            for rec in branch['recommendations']:
                print(f"      {rec}")
        
        print()
        print("═" * 80)
    
    print()
    print("💡 NEXT STEPS:")
    print("   1. Review the generated branch_analysis.json file for full details")
    print("   2. Start with HIGH value branches first")
    print("   3. Use scripts/cherry_pick_backend.sh for selective merging")
    print("   4. Consult docs/CONSOLIDATION_PLAN.md for detailed strategy")
    print()


def main():
    """Main execution function."""
    try:
        analysis = analyze_all_branches()
        
        # Print summary to console
        print_summary(analysis)
        
        # Save to JSON file
        output_file = Path(__file__).parent.parent / 'branch_analysis.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Full report saved to: {output_file}")
        print()
        
        # Exit with appropriate code
        if analysis['total_branches_analyzed'] == 0:
            print("⚠️ No branches found to analyze")
            sys.exit(1)
        
        sys.exit(0)
    
    except KeyboardInterrupt:
        print("\n\n⚠️ Analysis interrupted by user")
        sys.exit(130)
    
    except Exception as e:
        print(f"\n❌ Error during analysis: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
