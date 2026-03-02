#!/usr/bin/env python3
"""
Validate GitHub Actions workflows for syntax, best practices, and common issues.
"""

import yaml
import sys
from pathlib import Path
from typing import Dict, List, Tuple

class WorkflowValidator:
    def __init__(self, workflow_path: str):
        self.workflow_path = Path(workflow_path)
        self.workflow_name = self.workflow_path.name
        self.issues = []
        self.warnings = []
        self.info = []

    def validate(self) -> bool:
        """Run all validation checks."""
        print(f"\n{'='*80}")
        print(f"Validating: {self.workflow_name}")
        print(f"{'='*80}\n")

        # Load YAML
        try:
            with open(self.workflow_path) as f:
                self.workflow = yaml.safe_load(f)
        except Exception as e:
            self.issues.append(f"❌ YAML parsing error: {e}")
            self._print_results()
            return False

        # Run checks
        self._check_required_fields()
        self._check_permissions()
        self._check_concurrency()
        self._check_job_dependencies()
        self._check_action_versions()
        self._check_secrets_usage()
        self._check_caching_strategy()
        self._check_timeout_settings()
        self._check_matrix_strategies()

        # Print results
        self._print_results()

        return len(self.issues) == 0

    def _check_required_fields(self):
        """Check for required top-level fields."""
        required = ['name', 'on', 'jobs']
        for field in required:
            if field not in self.workflow:
                self.issues.append(f"❌ Missing required field: '{field}'")
            else:
                self.info.append(f"✅ Required field present: '{field}'")

        # Check workflow name
        if 'name' in self.workflow:
            name = self.workflow['name']
            if len(name) > 0:
                self.info.append(f"✅ Workflow name: '{name}'")
            else:
                self.warnings.append("⚠️  Workflow name is empty")

    def _check_permissions(self):
        """Check permissions configuration."""
        if 'permissions' in self.workflow:
            perms = self.workflow['permissions']
            if isinstance(perms, dict):
                self.info.append(f"✅ Permissions defined: {', '.join(perms.keys())}")

                # Check for overly permissive settings
                if perms.get('contents') == 'write':
                    self.warnings.append("⚠️  'contents: write' permission - ensure this is necessary")
                if perms.get('pull-requests') == 'write':
                    self.info.append("✅ PR write permission for comments")
            else:
                self.warnings.append("⚠️  Permissions should be a dictionary")
        else:
            self.warnings.append("⚠️  No permissions defined (using defaults)")

    def _check_concurrency(self):
        """Check concurrency configuration."""
        if 'concurrency' in self.workflow:
            conc = self.workflow['concurrency']
            if 'group' in conc:
                self.info.append("✅ Concurrency group defined")
            if conc.get('cancel-in-progress'):
                self.info.append("✅ Cancel-in-progress enabled (saves CI minutes)")
            else:
                self.warnings.append("⚠️  Consider enabling 'cancel-in-progress' to save CI minutes")
        else:
            self.warnings.append("⚠️  No concurrency control (multiple runs may overlap)")

    def _check_job_dependencies(self):
        """Check job dependencies and conditions."""
        jobs = self.workflow.get('jobs', {})

        for job_name, job_config in jobs.items():
            # Check for needs
            if 'needs' in job_config:
                needs = job_config['needs']
                if isinstance(needs, list):
                    self.info.append(f"✅ Job '{job_name}' depends on: {', '.join(needs)}")
                else:
                    self.info.append(f"✅ Job '{job_name}' depends on: {needs}")

            # Check for if conditions
            if 'if' in job_config:
                self.info.append(f"✅ Job '{job_name}' has conditional execution")

            # Check for timeout
            if 'timeout-minutes' in job_config:
                timeout = job_config['timeout-minutes']
                self.info.append(f"✅ Job '{job_name}' has timeout: {timeout} minutes")
                if timeout > 60:
                    self.warnings.append(f"⚠️  Job '{job_name}' has long timeout ({timeout}min)")

    def _check_action_versions(self):
        """Check for pinned action versions."""
        jobs = self.workflow.get('jobs', {})

        for job_name, job_config in jobs.items():
            steps = job_config.get('steps', [])
            for step in steps:
                if 'uses' in step:
                    action = step['uses']

                    # Check for version pinning
                    if '@' not in action:
                        self.issues.append(f"❌ Action not pinned: '{action}' in job '{job_name}'")
                    elif action.endswith('@v4') or action.endswith('@v3') or action.endswith('@v2'):
                        self.info.append(f"✅ Action pinned: '{action}'")
                    elif len(action.split('@')[1]) == 40:  # SHA
                        self.info.append(f"✅ Action pinned to SHA: '{action.split('/')[1]}'")

    def _check_secrets_usage(self):
        """Check secrets usage patterns."""
        workflow_str = yaml.dump(self.workflow)

        if 'secrets.' in workflow_str:
            self.info.append("✅ Using GitHub secrets (secure)")

        # Check for potential hardcoded secrets (basic check)
        suspicious_patterns = ['password:', 'token:', 'api_key:', 'secret:']
        for pattern in suspicious_patterns:
            if pattern in workflow_str.lower():
                self.warnings.append(f"⚠️  Found '{pattern}' - ensure no hardcoded secrets")

    def _check_caching_strategy(self):
        """Check for caching usage."""
        jobs = self.workflow.get('jobs', {})
        cache_count = 0

        for job_name, job_config in jobs.items():
            steps = job_config.get('steps', [])
            for step in steps:
                if 'uses' in step and 'actions/cache@' in step['uses']:
                    cache_count += 1
                    cache_name = step.get('name', 'unnamed')
                    self.info.append(f"✅ Caching enabled: '{cache_name}' in job '{job_name}'")

                # Check for setup actions with cache
                if 'uses' in step:
                    if 'setup-node@' in step['uses']:
                        with_cache = step.get('with', {}).get('cache')
                        if with_cache:
                            self.info.append(f"✅ Node.js caching enabled: '{with_cache}'")
                        else:
                            self.warnings.append(f"⚠️  setup-node without cache in job '{job_name}'")

                    if 'setup-python@' in step['uses']:
                        with_cache = step.get('with', {}).get('cache')
                        if with_cache:
                            self.info.append(f"✅ Python caching enabled: '{with_cache}'")

        if cache_count > 0:
            self.info.append(f"✅ Total cache steps: {cache_count}")
        else:
            self.warnings.append("⚠️  No caching configured (consider adding for better performance)")

    def _check_timeout_settings(self):
        """Check for timeout configurations."""
        jobs = self.workflow.get('jobs', {})
        jobs_without_timeout = []

        for job_name, job_config in jobs.items():
            if 'timeout-minutes' not in job_config:
                jobs_without_timeout.append(job_name)

        if jobs_without_timeout:
            self.warnings.append(f"⚠️  Jobs without timeout: {', '.join(jobs_without_timeout[:3])}")

    def _check_matrix_strategies(self):
        """Check matrix strategies."""
        jobs = self.workflow.get('jobs', {})

        for job_name, job_config in jobs.items():
            if 'strategy' in job_config:
                strategy = job_config['strategy']
                if 'matrix' in strategy:
                    self.info.append(f"✅ Matrix strategy in job '{job_name}'")

                    # Check fail-fast
                    if 'fail-fast' in strategy:
                        if strategy['fail-fast']:
                            self.warnings.append(f"⚠️  fail-fast=true in '{job_name}' (may hide issues)")
                        else:
                            self.info.append(f"✅ fail-fast=false in '{job_name}' (all variants run)")

    def _print_results(self):
        """Print validation results."""
        print("\n📊 Validation Results:\n")

        # Print issues (errors)
        if self.issues:
            print(f"❌ ISSUES ({len(self.issues)}):")
            for issue in self.issues:
                print(f"   {issue}")
            print()

        # Print warnings
        if self.warnings:
            print(f"⚠️  WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings[:10]:  # Limit to 10
                print(f"   {warning}")
            if len(self.warnings) > 10:
                print(f"   ... and {len(self.warnings) - 10} more warnings")
            print()

        # Print info (limited)
        if self.info:
            print(f"✅ PASSED CHECKS ({len(self.info)}):")
            for info in self.info[:5]:  # Show first 5
                print(f"   {info}")
            if len(self.info) > 5:
                print(f"   ... and {len(self.info) - 5} more checks passed")
            print()

        # Summary
        print(f"{'='*80}")
        if not self.issues:
            if not self.warnings:
                print(f"✅ {self.workflow_name}: EXCELLENT - No issues or warnings!")
            else:
                print(f"✅ {self.workflow_name}: GOOD - No issues, {len(self.warnings)} warnings")
        else:
            print(f"❌ {self.workflow_name}: FAILED - {len(self.issues)} issues found")
        print(f"{'='*80}\n")


def main():
    """Validate all workflows."""
    workflows_dir = Path("/home/user/careercopilot/.github/workflows")

    # Workflows to validate
    workflows_to_check = [
        "auto-fix-enhanced.yml",
        "ci-optimized.yml"
    ]

    results = {}

    for workflow_file in workflows_to_check:
        workflow_path = workflows_dir / workflow_file
        if workflow_path.exists():
            validator = WorkflowValidator(workflow_path)
            results[workflow_file] = validator.validate()
        else:
            print(f"❌ Workflow not found: {workflow_file}")
            results[workflow_file] = False

    # Final summary
    print("\n" + "="*80)
    print("FINAL SUMMARY")
    print("="*80)
    for workflow, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {workflow}")
    print("="*80 + "\n")

    # Exit with error if any failed
    if not all(results.values()):
        sys.exit(1)
    else:
        print("✅ All workflows validated successfully!\n")
        sys.exit(0)


if __name__ == "__main__":
    main()
