"""Comprehensive tests for opportunities endpoint module."""

from types import SimpleNamespace

import pytest

from app.api.endpoints import opportunities as module


@pytest.mark.asyncio
async def test_get_opportunities_returns_expected_shape():
    result = await module.get_opportunities(current_user=SimpleNamespace(id="u1"))

    assert len(result) == 2
    for item in result:
        assert {
            "id",
            "title",
            "company",
            "location",
            "salary",
            "matchScore",
            "tags",
            "postedDate",
            "description",
            "salaryRange",
            "isRemote",
            "isFavorited",
        }.issubset(item.keys())


@pytest.mark.asyncio
async def test_opportunities_validate_against_response_model():
    opportunities = await module.get_opportunities(current_user=SimpleNamespace(id="u1"))
    validated = [module.Opportunity.model_validate(item) for item in opportunities]

    assert all(isinstance(x.matchScore, int) for x in validated)
    assert all(isinstance(x.tags, list) for x in validated)
