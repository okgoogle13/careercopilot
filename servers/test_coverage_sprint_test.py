#!/usr/bin/env python3
"""
Unit tests for Test Coverage Sprint MCP server.
Tests coverage analysis, priority calculation, and batch processing.
"""
import asyncio
import json
import os
import pytest
import tempfile
from pathlib import Path
from unittest.mock import patch, MagicMock

# Import server functions
import sys
sys.path.insert(0, os.path.dirname(__file__))

from test_coverage_sprint import (
    _calculate_file_priority,
    _estimate_coverage_improvement,
    _identify_untested_files_frontend,
    _identify_untested_files_backend,
    _parse_jest_coverage,
    _parse_pytest_coverage,
)


class TestPriorityCalculation:
    """Test priority scoring algorithm."""

    def test_component_priority(self):
        """Frontend components should be high priority."""
        priority = _calculate_file_priority("src/components/Button.tsx", "components", "frontend")
        assert priority > 80  # Should be ~85

    def test_api_priority(self):
        """API files should be highest priority."""
        priority = _calculate_file_priority("src/api/service.ts", "api", "frontend")
        assert priority >= 85

    def test_backend_api_priority(self):
        """Backend API endpoints should be highest priority."""
        priority = _calculate_file_priority("app/api/endpoints/users.py", "api", "backend")
        assert priority >= 90

    def test_service_priority(self):
        """Service files should get boost."""
        priority = _calculate_file_priority("app/services/user_service.py", "services", "backend")
        assert priority > 70

    def test_utility_priority(self):
        """Utility files should be lower priority."""
        priority = _calculate_file_priority("src/utils/helpers.ts", "other", "frontend")
        assert priority < 70

    def test_index_file_priority_boost(self):
        """Index files should get boost for being public APIs."""
        priority_regular = _calculate_file_priority("src/components/Button.tsx", "components", "frontend")
        priority_index = _calculate_file_priority("src/components/index.tsx", "components", "frontend")
        assert priority_index > priority_regular

    def test_priority_clamped_at_100(self):
        """Priority should be clamped at 100."""
        priority = _calculate_file_priority("app/api/router.py", "api", "backend")
        assert priority <= 100


class TestCoverageImprovement:
    """Test coverage improvement estimation."""

    def test_base_improvement_calculation(self):
        """Should calculate base improvement at 3% per file."""
        improvement = _estimate_coverage_improvement(5, {})
        expected = 5 * 3.0  # 15%
        assert abs(improvement - expected) < 0.1

    def test_api_boost(self):
        """API category should get 2x boost."""
        improvement_with_api = _estimate_coverage_improvement(5, {"api": 5})
        improvement_no_api = _estimate_coverage_improvement(5, {})
        # With 5 API files: 5*3 + 5*2 = 25%
        # Without: 5*3 = 15%
        assert improvement_with_api > improvement_no_api

    def test_service_boost(self):
        """Service category should get 1.5x boost."""
        improvement_with_service = _estimate_coverage_improvement(5, {"services": 5})
        improvement_no_service = _estimate_coverage_improvement(5, {})
        # With 5 service files: 5*3 + 5*1.5 = 22.5%
        # Without: 5*3 = 15%
        assert improvement_with_service > improvement_no_service

    def test_improvement_clamped_at_40(self):
        """Improvement should be clamped at 40%."""
        # Pass many files
        improvement = _estimate_coverage_improvement(100, {"api": 50})
        assert improvement <= 40.0

    def test_mixed_categories(self):
        """Should handle mixed category distributions."""
        improvement = _estimate_coverage_improvement(
            5,
            {"api": 2, "services": 2, "components": 1}
        )
        # 5*3 + 2*2 + 2*1.5 = 15 + 4 + 3 = 22%
        assert 20 < improvement < 25


class TestCoverageReporting:
    """Test coverage JSON parsing."""

    def test_jest_coverage_parsing_valid(self):
        """Should parse valid Jest coverage JSON."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            coverage_data = {
                "total": {
                    "lines": {"pct": 75.5},
                    "statements": {"pct": 76.0},
                    "functions": {"pct": 70.0},
                    "branches": {"pct": 65.0}
                }
            }
            json.dump(coverage_data, f)
            temp_path = f.name

        try:
            result = _parse_jest_coverage(temp_path)
            assert result["lines"] == 75.5
            assert result["statements"] == 76.0
            assert result["functions"] == 70.0
            assert result["branches"] == 65.0
        finally:
            os.unlink(temp_path)

    def test_jest_coverage_file_not_found(self):
        """Should handle missing coverage file gracefully."""
        result = _parse_jest_coverage("/nonexistent/path/coverage.json")
        assert "error" in result

    def test_pytest_coverage_parsing_valid(self):
        """Should parse valid pytest coverage JSON."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            coverage_data = {
                "totals": {
                    "percent_covered": 72.5,
                    "num_statements": 500,
                    "covered_lines": 362,
                    "num_missing": 138
                }
            }
            json.dump(coverage_data, f)
            temp_path = f.name

        try:
            result = _parse_pytest_coverage(temp_path)
            assert result["lines"] == 72.5
            assert result["statements"] == 500
            assert result["covered"] == 362
            assert result["missing"] == 138
        finally:
            os.unlink(temp_path)

    def test_pytest_coverage_file_not_found(self):
        """Should handle missing coverage file gracefully."""
        result = _parse_pytest_coverage("/nonexistent/path/coverage.json")
        assert "error" in result


class TestUntestedFileDetection:
    """Test file enumeration and categorization."""

    def test_frontend_file_categorization(self):
        """Frontend files should be categorized correctly."""
        with tempfile.TemporaryDirectory() as tmpdir:
            # Create test structure
            src_dir = Path(tmpdir) / "src"
            src_dir.mkdir()

            # Components
            (src_dir / "components").mkdir()
            (src_dir / "components" / "Button.tsx").write_text("export const Button = () => {}")

            # Hooks
            (src_dir / "hooks").mkdir()
            (src_dir / "hooks" / "useAuth.tsx").write_text("export const useAuth = () => {}")

            # API - use .tsx for frontend API components
            (src_dir / "api").mkdir()
            (src_dir / "api" / "client.tsx").write_text("export const apiClient = {}")

            # Features
            (src_dir / "features").mkdir()
            (src_dir / "features" / "Dashboard.tsx").write_text("export const Dashboard = () => {}")

            untested = _identify_untested_files_frontend(tmpdir)

            categories = {f["category"] for f in untested}
            assert "components" in categories
            assert "hooks" in categories
            assert "api" in categories
            assert "features" in categories

    def test_backend_file_categorization(self):
        """Backend files should be categorized correctly."""
        with tempfile.TemporaryDirectory() as tmpdir:
            # Create test structure
            app_dir = Path(tmpdir) / "app"
            app_dir.mkdir()

            # API
            api_dir = app_dir / "api" / "endpoints"
            api_dir.mkdir(parents=True)
            (api_dir / "users.py").write_text("def get_users(): pass")

            # Services
            services_dir = app_dir / "services"
            services_dir.mkdir()
            (services_dir / "user_service.py").write_text("class UserService: pass")

            # Models
            models_dir = app_dir / "models"
            models_dir.mkdir()
            (models_dir / "user.py").write_text("class User: pass")

            untested = _identify_untested_files_backend(tmpdir)

            categories = {f["category"] for f in untested}
            assert "api" in categories
            assert "services" in categories
            assert "models" in categories

    def test_frontend_ignores_test_files(self):
        """Frontend detector should ignore existing test files."""
        with tempfile.TemporaryDirectory() as tmpdir:
            src_dir = Path(tmpdir) / "src"
            src_dir.mkdir()
            comp_dir = src_dir / "components"
            comp_dir.mkdir()

            # Create component AND its test
            (comp_dir / "Button.tsx").write_text("export const Button = () => {}")
            (comp_dir / "Button.test.tsx").write_text("test('Button renders', () => {})")

            untested = _identify_untested_files_frontend(tmpdir)

            # Button should not be in untested list (has test)
            button_paths = [f["path"] for f in untested if "Button" in f["path"]]
            assert len(button_paths) == 0  # No untested Buttons

    def test_backend_ignores_test_files(self):
        """Backend detector should ignore existing test files."""
        with tempfile.TemporaryDirectory() as tmpdir:
            app_dir = Path(tmpdir) / "app"
            app_dir.mkdir()
            test_dir = app_dir / "tests"
            test_dir.mkdir()

            # Create services
            services_dir = app_dir / "services"
            services_dir.mkdir()
            (services_dir / "user_service.py").write_text("class UserService: pass")

            # Create test
            test_services_dir = test_dir / "services"
            test_services_dir.mkdir()
            (test_services_dir / "user_service.py").write_text("def test_user_service(): pass")

            untested = _identify_untested_files_backend(tmpdir)

            # UserService should not be in untested (has test)
            service_paths = [f["path"] for f in untested if "user_service" in f["path"]]
            assert len(service_paths) == 0

    def test_priority_sorting(self):
        """Files should be sorted by priority."""
        with tempfile.TemporaryDirectory() as tmpdir:
            src_dir = Path(tmpdir) / "src"
            src_dir.mkdir()

            # Create API (high priority) - use .tsx for frontend
            api_dir = src_dir / "api"
            api_dir.mkdir()
            (api_dir / "client.tsx").write_text("export const api = {}")

            # Create utils (low priority) - use .tsx for frontend
            utils_dir = src_dir / "utils"
            utils_dir.mkdir()
            (utils_dir / "helpers.tsx").write_text("export const helper = () => {}")

            untested = _identify_untested_files_frontend(tmpdir)
            assert len(untested) >= 2

            # API should come before utils
            api_files = [f for f in untested if "api" in f["path"]]
            utils_files = [f for f in untested if "utils" in f["path"]]

            if api_files and utils_files:
                assert api_files[0]["priority"] > utils_files[0]["priority"]


class TestMCPToolSignatures:
    """Test that MCP tools are properly registered."""

    def test_analyze_coverage_gaps_exists(self):
        """analyze_coverage_gaps tool should exist."""
        from test_coverage_sprint import analyze_coverage_gaps
        # Check that the function exists and is async
        import inspect
        assert inspect.iscoroutinefunction(analyze_coverage_gaps)

    def test_generate_tests_parallel_exists(self):
        """generate_tests_parallel tool should exist."""
        from test_coverage_sprint import generate_tests_parallel
        # Check that the function exists and is async
        import inspect
        assert inspect.iscoroutinefunction(generate_tests_parallel)


class TestIntegration:
    """Integration tests with real server."""

    @pytest.mark.asyncio
    async def test_analyze_coverage_gaps_execution(self):
        """Should execute coverage gap analysis without crashing."""
        from test_coverage_sprint import analyze_coverage_gaps

        # This will use actual frontend/backend directories
        # Should not crash even if tests haven't been run
        result_json = await analyze_coverage_gaps(target_coverage=95.0)
        result = json.loads(result_json)

        assert "target_coverage" in result
        assert result["target_coverage"] == 95.0
        assert "duration_seconds" in result
        assert result["duration_seconds"] >= 0

    @pytest.mark.asyncio
    async def test_generate_tests_parallel_execution(self):
        """Should execute test generation without crashing."""
        from test_coverage_sprint import generate_tests_parallel

        result_json = await generate_tests_parallel(
            target_coverage=90.0,
            frontend=True,
            backend=False,
            batch_size=5
        )
        result = json.loads(result_json)

        assert "coverage_before" in result
        assert "coverage_after" in result
        assert "tests_generated" in result
        assert "batch_results" in result
        assert isinstance(result["batch_results"], list)
        assert result["token_efficiency"] >= 0

    @pytest.mark.asyncio
    async def test_generate_tests_with_priority_paths(self):
        """Should accept and process priority paths."""
        from test_coverage_sprint import generate_tests_parallel

        result_json = await generate_tests_parallel(
            target_coverage=90.0,
            frontend=True,
            batch_size=3,
            priority_paths=["src/api/", "src/components/"]
        )
        result = json.loads(result_json)

        assert "batch_results" in result


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
