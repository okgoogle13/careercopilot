"""Tests for Service Layer Components."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import HTTPException, UploadFile

from app.services.smart_ingestion_service import (
    _build_confirmed_tags_dict,
    _dedupe_non_empty_values,
    _extract_resume_data,
    extract_and_store_document,
    extract_document_data,
    move_document_to_permanent_storage,
    read_document_from_storage,
    upload_document_to_storage,
)
from app.services.template_service import TemplateService, TemplateType


class TestTemplateService:
    @pytest.fixture
    def service(self):
        with patch("app.services.template_service.get_personal_config") as mock_config:
            mock_config.return_value.career_transition_from = "Retail"
            mock_config.return_value.career_transition_to = "Social Work"
            mock_config.return_value.target_industries = ["Nonprofit"]
            mock_config.return_value.target_roles = ["Case Manager"]
            mock_config.return_value.transferable_skills = ["Empathy"]
            mock_config.return_value.personal_story = {"motivation": "Helping people"}
            mock_config.return_value.location = "Sydney"
            return TemplateService()

    @pytest.mark.asyncio
    async def test_generate_template_fallback(self, service):
        """Should return fallback if AI fails."""
        service.ai_prompt_builder = AsyncMock()
        service.ai_prompt_builder.generate_ai_response.side_effect = Exception("AI Down")

        result = await service.generate_template(TemplateType.COVER_LETTER)
        assert result.content != ""
        assert "Dear Hiring Manager" in result.content

    @pytest.mark.asyncio
    async def test_generate_template_ai_success_json(self, service):
        """Should parse AI JSON response."""
        service.ai_prompt_builder = AsyncMock()
        service.ai_prompt_builder.generate_ai_response.return_value = (
            '{"email_body": "AI Content", "subject_line": "AI Subj"}'
        )

        result = await service.generate_template(TemplateType.FOLLOW_UP_EMAIL)
        assert result.content == "AI Content"
        assert result.subject_line == "AI Subj"

    @pytest.mark.asyncio
    async def test_generate_template_enhanced_fallback(self, service):
        """Should use enhanced fallback if AI produces generic string."""
        service.ai_prompt_builder = AsyncMock()
        service.ai_prompt_builder.generate_ai_response.return_value = (
            "Enhanced AI response for generic"
        )

        result = await service.generate_template(TemplateType.COVER_LETTER)
        assert "Dear Hiring Manager" in result.content

    def test_build_prompts_all_types(self, service):
        """Ensure _build_template_prompt works for all enum members."""
        for ttype in TemplateType:
            prompt = service._build_template_prompt(ttype)
            assert "Career Transition Context" in prompt

    @pytest.mark.asyncio
    async def test_generate_application_materials(self, service):
        """Should generate multiple documents."""
        service.ai_prompt_builder = AsyncMock()
        service.ai_prompt_builder.generate_ai_response.return_value = (
            '{"email_body": "X", "content": "Y"}'
        )

        results = await service.generate_application_materials(job_title="Dev", company_name="G")
        assert "email_application" in results
        assert "cover_letter" in results

    def test_parse_template_response_failure(self, service):
        """Should handle parsing failures."""
        result = service._parse_template_response(TemplateType.FOLLOW_UP_EMAIL, "Not JSON", None)
        assert result.content == "Not JSON"


class TestSmartIngestionServiceUnits:
    def test_dedupe_non_empty_values(self):
        """Should remove blanks and duplicates while preserving order."""
        skills = [" Python", "Java ", "Python", "", "  ", "Go"]
        result = _dedupe_non_empty_values(skills)
        assert result == ["Python", "Java", "Go"]

    def test_build_confirmed_tags_dict(self):
        """Should normalize tag payloads."""
        mock_tags = MagicMock()
        mock_tags.roleType = "Senior"
        mock_tags.subsectors = ["Tech"]

        result = _build_confirmed_tags_dict(mock_tags)
        assert result == {"roleType": "Senior", "subsectors": ["Tech"]}

    @pytest.mark.asyncio
    async def test_upload_document_to_storage_success(self):
        """Should upload file and return URI/size."""
        mock_file = MagicMock(spec=UploadFile)
        mock_file.filename = "test.pdf"
        mock_file.content_type = "application/pdf"
        mock_file.seek = AsyncMock()
        mock_file.read = AsyncMock(return_value=b"content")

        with patch("app.services.smart_ingestion_service.cloud_storage_client") as mock_csc:
            mock_csc.upload_file.return_value = "storage://bucket/test.pdf"

            uri, size = await upload_document_to_storage(mock_file, "user1")
            assert uri == "storage://bucket/test.pdf"
            assert size == 7

    @pytest.mark.asyncio
    async def test_read_document_from_storage_error(self):
        """Should raise HTTPException if storage read fails."""
        with patch("app.services.smart_ingestion_service.cloud_storage_client") as mock_csc:
            mock_csc.download_file.side_effect = Exception("Storage fail")

            with pytest.raises(HTTPException) as exc:
                await read_document_from_storage("storage://bucket/file.txt")
            assert exc.value.status_code == 500

    @pytest.mark.asyncio
    async def test_move_document_success(self):
        """Should copy blob and delete source."""
        with patch("app.services.smart_ingestion_service.cloud_storage_client") as mock_csc:
            mock_bucket = MagicMock()
            mock_csc.bucket = mock_bucket

            new_uri = await move_document_to_permanent_storage("storage://b/uploads/u1/f.pdf", "u1")
            assert "permanent/u1/f.pdf" in new_uri
            mock_bucket.copy_blob.assert_called_once()
            mock_bucket.blob().delete.assert_called_once()

    @pytest.mark.asyncio
    async def test_extract_resume_data_success(self):
        """Should run flows and merge results."""
        with (
            patch("app.services.smart_ingestion_service.resumeExtractorFlow") as mock_resume,
            patch("app.services.smart_ingestion_service.skillsExtractorFlow") as mock_skills,
        ):

            mock_profile = MagicMock()
            mock_profile.skills.technical = ["Python"]
            mock_profile.skills.tools = []
            mock_profile.skills.soft = []
            mock_profile.skills.methodologies = []
            mock_profile.model_dump.return_value = {
                "name": "John",
                "skills": {"technical": ["Python", "Go"]},
            }
            mock_resume.run.return_value = mock_profile

            mock_sk_res = MagicMock()
            mock_sk_res.technical = ["Go"]
            mock_sk_res.tools = []
            mock_sk_res.soft = []
            mock_sk_res.methodologies = []
            mock_skills.run.return_value = mock_sk_res

            result = await _extract_resume_data(
                document_text="Text", confirmed_tags=MagicMock(), user_id="u1"
            )
            assert result["name"] == "John"

    @pytest.mark.asyncio
    async def test_extract_document_data_resume(self):
        """Should route to resume extraction."""
        with patch("app.services.smart_ingestion_service._extract_resume_data") as mock_res:
            mock_res.return_value = {"ok": 1}
            res, label = await extract_document_data(
                document_type="resume", document_text="T", confirmed_tags=MagicMock(), user_id="u1"
            )
            assert label == "Resume"
            assert res == {"ok": 1}

    @pytest.mark.asyncio
    async def test_extract_document_data_ksc(self):
        """Should route to ksc extraction."""
        with patch("app.services.smart_ingestion_service.kscExtractorFlow") as mock_flow:
            mock_res = MagicMock()
            mock_res.examples = []
            mock_flow.run.return_value = mock_res
            res, label = await extract_document_data(
                document_type="ksc", document_text="T", confirmed_tags=MagicMock(), user_id="u1"
            )
            assert label == "Key Selection Criteria"
            assert "keySelectionCriteriaExamples" in res

    @pytest.mark.asyncio
    async def test_extract_document_data_voice(self):
        """Should handle voice profile type."""
        with patch("app.services.smart_ingestion_service.voiceProfileExtractorFlow") as mock_flow:
            mock_res = MagicMock()
            mock_res.model_dump.return_value = {"voice": "cool"}
            mock_flow.run.return_value = mock_res

            result, label = await extract_document_data(
                document_type="voice", document_text="T", confirmed_tags=MagicMock(), user_id="u1"
            )
            assert label == "Voice Profile"
            assert result["voice"] == "cool"

    @pytest.mark.asyncio
    async def test_extract_and_store_document(self):
        """Should extract data, move file, and update database."""
        mock_db = MagicMock()
        mock_req = MagicMock()
        mock_req.documentType = "resume"
        mock_req.fileId = "storage://b/uploads/f.pdf"
        mock_req.confirmedTags.roleType = "S"
        mock_req.confirmedTags.subsectors = []

        with (
            patch(
                "app.services.smart_ingestion_service.read_document_from_storage",
                return_value="Text",
            ),
            patch(
                "app.services.smart_ingestion_service.extract_document_data",
                return_value=({"ok": 1}, "Resume"),
            ),
            patch(
                "app.services.smart_ingestion_service.move_document_to_permanent_storage",
                return_value="new_uri",
            ),
            patch("app.services.smart_ingestion_service.AssetDocument") as mock_asset_doc,
            patch(
                "app.services.smart_ingestion_service.save_asset_document", return_value="asset123"
            ),
        ):

            asset_id, label = await extract_and_store_document(mock_req, "u1", mock_db)
            assert asset_id == "asset123"
            assert label == "Resume"

    @pytest.mark.asyncio
    async def test_save_asset_document(self):
        """Should persist document to DB."""
        from app.services.smart_ingestion_service import save_asset_document

        mock_db = MagicMock()
        mock_asset_doc = MagicMock()
        mock_asset_doc.documentType = "resume"
        mock_asset_doc.tags.roleType = "S"
        mock_asset_doc.metadata.fileName = "f.pdf"

        with patch("app.services.smart_ingestion_service.UserAsset") as mock_user_asset:
            asset_id = await save_asset_document(mock_asset_doc, "u1", mock_db)
            mock_db.add.assert_called_once()
            mock_db.commit.assert_called_once()
            assert isinstance(asset_id, str)
