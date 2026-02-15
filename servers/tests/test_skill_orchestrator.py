"""
Unit tests for MCP Skill Orchestration Server (Phase 1)
"""

import pytest
import json
import tempfile
import os
from pathlib import Path
from unittest.mock import patch, MagicMock

# Import the module to test
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from skill_orchestrator_mcp import (
    SkillRegistry,
    get_skill_registry,
    execute_skill,
    validate_skill_arguments,
    _simulate_skill_execution
)


@pytest.fixture
def temp_skills_dir():
    """Create a temporary skills directory with test SKILL.md files."""
    with tempfile.TemporaryDirectory() as tmpdir:
        skills_path = Path(tmpdir)

        # Create test skill 1: wireframe-annotator
        skill1_dir = skills_path / "wireframe-annotator"
        skill1_dir.mkdir()
        skill1_md = skill1_dir / "SKILL.md"
        skill1_md.write_text("""---
name: wireframe-annotator
description: Generate annotated ASCII wireframes
metadata:
  version: 2.0.0
  tags: [design-to-code, wireframe]
  priority: high
  roi_score: 2.67
---

## Purpose
Generates wireframes from design briefs.
""")

        # Create test skill 2: m3-expressive-ui-evaluator
        skill2_dir = skills_path / "m3-expressive-ui-evaluator"
        skill2_dir.mkdir()
        skill2_md = skill2_dir / "SKILL.md"
        skill2_md.write_text("""---
name: m3-expressive-ui-evaluator
description: Evaluate UI against M3 Expressive standards
metadata:
  version: 1.0.0
  tags: [design-to-code, evaluation]
  priority: medium
  sprint: 1
---

## Purpose
Evaluates design compliance.
""")

        # Create test skill 3: Invalid YAML (should be skipped)
        skill3_dir = skills_path / "invalid-skill"
        skill3_dir.mkdir()
        skill3_md = skill3_dir / "SKILL.md"
        skill3_md.write_text("""---
name: invalid-skill
description: Missing closing ---
metadata:
  version: 1.0.0

## Purpose
This skill has invalid YAML frontmatter.
""")

        yield str(skills_path)


class TestSkillRegistry:
    """Test SkillRegistry class."""

    def test_load_registry_success(self, temp_skills_dir):
        """Test loading skills from SKILL.md files."""
        registry = SkillRegistry(temp_skills_dir)

        assert len(registry._registry) == 2  # Only valid skills loaded
        assert "wireframe-annotator" in registry._registry
        assert "m3-expressive-ui-evaluator" in registry._registry
        assert "invalid-skill" not in registry._registry

    def test_load_registry_empty_dir(self):
        """Test loading from empty directory."""
        with tempfile.TemporaryDirectory() as tmpdir:
            registry = SkillRegistry(tmpdir)
            assert len(registry._registry) == 0

    def test_load_registry_nonexistent_dir(self):
        """Test loading from non-existent directory."""
        registry = SkillRegistry("/nonexistent/path")
        assert len(registry._registry) == 0

    def test_get_skill_exists(self, temp_skills_dir):
        """Test getting an existing skill."""
        registry = SkillRegistry(temp_skills_dir)
        skill = registry.get_skill("wireframe-annotator")

        assert skill is not None
        assert skill["name"] == "wireframe-annotator"
        assert skill["description"] == "Generate annotated ASCII wireframes"
        assert skill["metadata"]["version"] == "2.0.0"
        assert "design-to-code" in skill["metadata"]["tags"]

    def test_get_skill_not_exists(self, temp_skills_dir):
        """Test getting a non-existent skill."""
        registry = SkillRegistry(temp_skills_dir)
        skill = registry.get_skill("nonexistent-skill")

        assert skill is None

    def test_list_skills_no_filter(self, temp_skills_dir):
        """Test listing all skills without filter."""
        registry = SkillRegistry(temp_skills_dir)
        skills = registry.list_skills()

        assert len(skills) == 2
        names = [s["name"] for s in skills]
        assert "wireframe-annotator" in names
        assert "m3-expressive-ui-evaluator" in names

    def test_list_skills_with_tag_filter(self, temp_skills_dir):
        """Test listing skills filtered by tags."""
        registry = SkillRegistry(temp_skills_dir)
        skills = registry.list_skills(tags=["wireframe"])

        assert len(skills) == 1
        assert skills[0]["name"] == "wireframe-annotator"

    def test_list_skills_multiple_tags(self, temp_skills_dir):
        """Test listing skills with multiple tag filters."""
        registry = SkillRegistry(temp_skills_dir)
        skills = registry.list_skills(tags=["design-to-code", "evaluation"])

        assert len(skills) == 2  # Both skills match at least one tag


class TestGetSkillRegistryTool:
    """Test get_skill_registry MCP tool."""

    @patch('skill_orchestrator_mcp.registry')
    def test_get_skill_registry_success(self, mock_registry):
        """Test successful retrieval of skill registry."""
        mock_skills = [
            {
                "name": "test-skill",
                "description": "Test skill",
                "metadata": {
                    "version": "1.0.0",
                    "tags": ["test"],
                    "priority": "high",
                    "roi_score": 2.5,
                    "sprint": 1
                }
            }
        ]
        mock_registry.list_skills.return_value = mock_skills

        result = get_skill_registry()

        assert result["total_skills"] == 1
        assert len(result["skills"]) == 1
        assert result["skills"][0]["name"] == "test-skill"
        assert result["skills"][0]["version"] == "1.0.0"

    @patch('skill_orchestrator_mcp.registry')
    def test_get_skill_registry_with_tags(self, mock_registry):
        """Test skill registry with tag filter."""
        mock_skills = [{"name": "filtered-skill", "metadata": {}}]
        mock_registry.list_skills.return_value = mock_skills

        result = get_skill_registry(tags=["design-to-code"])

        mock_registry.list_skills.assert_called_once_with(tags=["design-to-code"])
        assert result["total_skills"] == 1

    @patch('skill_orchestrator_mcp.registry')
    def test_get_skill_registry_error(self, mock_registry):
        """Test error handling in get_skill_registry."""
        mock_registry.list_skills.side_effect = Exception("Registry error")

        result = get_skill_registry()

        assert "error" in result
        assert result["total_skills"] == 0
        assert len(result["skills"]) == 0


class TestExecuteSkillTool:
    """Test execute_skill MCP tool."""

    @patch('skill_orchestrator_mcp.registry')
    def test_execute_skill_success(self, mock_registry):
        """Test successful skill execution."""
        mock_registry.get_skill.return_value = {
            "name": "wireframe-annotator",
            "description": "Test skill"
        }

        result = execute_skill(
            skill_name="wireframe-annotator",
            arguments={"brief_path": "/path/to/brief.md"}
        )

        assert result["status"] == "success"
        assert result["skill"] == "wireframe-annotator"
        assert "output" in result
        assert "execution_time_sec" in result
        assert "timestamp" in result

    @patch('skill_orchestrator_mcp.registry')
    def test_execute_skill_not_found(self, mock_registry):
        """Test execution of non-existent skill."""
        mock_registry.get_skill.return_value = None
        mock_registry.list_skills.return_value = [
            {"name": "skill1"},
            {"name": "skill2"}
        ]

        result = execute_skill(
            skill_name="nonexistent-skill",
            arguments={}
        )

        assert result["status"] == "error"
        assert "not found" in result["error"]
        assert "available_skills" in result
        assert len(result["available_skills"]) == 2

    @patch('skill_orchestrator_mcp.registry')
    def test_execute_skill_invalid_arguments(self, mock_registry):
        """Test execution with invalid arguments type."""
        mock_registry.get_skill.return_value = {"name": "test-skill"}

        result = execute_skill(
            skill_name="test-skill",
            arguments="invalid"  # Should be dict
        )

        assert result["status"] == "error"
        assert "must be a dictionary" in result["error"]

    @patch('skill_orchestrator_mcp.registry')
    def test_execute_skill_with_validation(self, mock_registry):
        """Test skill execution with validation rules."""
        mock_registry.get_skill.return_value = {"name": "test-skill"}

        # Mock output with low score
        with patch('skill_orchestrator_mcp._simulate_skill_execution') as mock_exec:
            mock_exec.return_value = {"score": 280}

            result = execute_skill(
                skill_name="test-skill",
                arguments={},
                validation={"min_score": 320, "max_retries": 2}
            )

            assert result["status"] == "validation_failed"
            assert result["validation"]["score"] == 280
            assert result["validation"]["min_score"] == 320
            assert result["validation"]["gap"] == 40
            assert result["validation"]["retries_available"] is True

    @patch('skill_orchestrator_mcp.registry')
    def test_execute_skill_validation_pass(self, mock_registry):
        """Test skill execution passing validation."""
        mock_registry.get_skill.return_value = {"name": "test-skill"}

        with patch('skill_orchestrator_mcp._simulate_skill_execution') as mock_exec:
            mock_exec.return_value = {"score": 350}

            result = execute_skill(
                skill_name="test-skill",
                arguments={},
                validation={"min_score": 320}
            )

            assert result["status"] == "success"
            assert "validation" not in result


class TestSimulateSkillExecution:
    """Test _simulate_skill_execution helper function."""

    def test_simulate_wireframe_skill(self):
        """Test simulation of wireframe-annotator skill."""
        result = _simulate_skill_execution("wireframe-annotator", {})

        assert "file_path" in result
        assert "wireframe-annotator-output.md" in result["file_path"]
        assert result["score"] == 340
        assert "simulated" in result["notes"]

    def test_simulate_evaluator_skill(self):
        """Test simulation of evaluator skill."""
        result = _simulate_skill_execution("m3-expressive-ui-evaluator", {})

        assert result["score"] == 350
        assert result["compliance_percentage"] == 95
        assert result["issues"] == []

    def test_simulate_generic_skill(self):
        """Test simulation of generic skill."""
        result = _simulate_skill_execution("generic-skill", {})

        assert result["success"] is True
        assert "simulated" in result["notes"]


class TestValidateSkillArguments:
    """Test validate_skill_arguments MCP tool."""

    @patch('skill_orchestrator_mcp.registry')
    def test_validate_arguments_success(self, mock_registry):
        """Test successful argument validation."""
        mock_registry.get_skill.return_value = {"name": "test-skill"}

        result = validate_skill_arguments(
            skill_name="test-skill",
            arguments={"param1": "value1"}
        )

        assert result["valid"] is True
        assert len(result["errors"]) == 0

    @patch('skill_orchestrator_mcp.registry')
    def test_validate_arguments_skill_not_found(self, mock_registry):
        """Test validation for non-existent skill."""
        mock_registry.get_skill.return_value = None

        result = validate_skill_arguments(
            skill_name="nonexistent-skill",
            arguments={}
        )

        assert result["valid"] is False
        assert len(result["errors"]) == 1
        assert "not found" in result["errors"][0]

    @patch('skill_orchestrator_mcp.registry')
    def test_validate_arguments_invalid_type(self, mock_registry):
        """Test validation with invalid argument type."""
        mock_registry.get_skill.return_value = {"name": "test-skill"}

        result = validate_skill_arguments(
            skill_name="test-skill",
            arguments="invalid"
        )

        assert result["valid"] is False
        assert "must be a dictionary" in result["errors"][0]

    @patch('skill_orchestrator_mcp.registry')
    def test_validate_arguments_empty_warning(self, mock_registry):
        """Test validation with empty arguments."""
        mock_registry.get_skill.return_value = {"name": "test-skill"}

        result = validate_skill_arguments(
            skill_name="test-skill",
            arguments={}
        )

        assert result["valid"] is True
        assert len(result["warnings"]) == 1
        assert "No arguments provided" in result["warnings"][0]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
