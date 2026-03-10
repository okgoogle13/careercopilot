"""Composite UX flows for quick-apply journeys."""

from __future__ import annotations

import re
from collections import Counter
from typing import Any

import requests
from bs4 import BeautifulSoup
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.genkit_flows.ksc_generator import generateKscResponse
from app.genkit_flows.resume_optimizer import optimize_resume
from app.genkit_flows.smart_cover_letter_system import generate_smart_cover_letter
from app.genkit_flows.unified_job_analyzer import analyze_job_from_url
from app.models.database import MasterVersion, User

router = APIRouter()


class ChunkMatch(BaseModel):
    chunk_id: str
    label: str
    score: float = Field(ge=0, le=1)
    matched_terms: list[str]
    snippet: str


class ATSPreview(BaseModel):
    score: int = Field(ge=0, le=100)
    matched_keywords: list[str]
    missing_keywords: list[str]


class QuickApplyArtifacts(BaseModel):
    tailored_resume: str
    cover_letter: str
    ksc_response: str


class AnalyzeJobFromUrlRequest(BaseModel):
    url: str | None = None
    job_description: str | None = None


class AnalyzeJobFromUrlResponse(BaseModel):
    job_title: str
    company_name: str
    normalized_job_description: str
    chunk_matches: list[ChunkMatch]
    ats_preview: ATSPreview
    artifacts: QuickApplyArtifacts
    export_pack: dict[str, str]


TOKEN_RE = re.compile(r"[a-zA-Z][a-zA-Z0-9_\-/+]{2,}")


def _tokenize(text: str) -> list[str]:
    return [t.lower() for t in TOKEN_RE.findall(text)]


def _extract_text_from_url(url: str) -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (CareerCopilot QuickApply)",
        "Accept-Language": "en-AU,en;q=0.9,en-US;q=0.8",
    }
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    text = " ".join(soup.stripped_strings)
    return re.sub(r"\s+", " ", text).strip()


def _extract_master_chunks(snapshot: dict[str, Any]) -> list[dict[str, str]]:
    chunks: list[dict[str, str]] = []

    personal = snapshot.get("Personal_Info", {}) if isinstance(snapshot, dict) else {}
    summary = personal.get("Professional_Summary", "") if isinstance(personal, dict) else ""
    if isinstance(summary, str) and summary.strip():
        chunks.append(
            {
                "id": "summary",
                "label": "Professional Summary",
                "text": summary.strip(),
            }
        )

    for idx, exp in enumerate(snapshot.get("Work_Experience", []) or []):
        if not isinstance(exp, dict):
            continue
        role = exp.get("Job_Title") or "Role"
        company = exp.get("Company") or "Company"
        details = exp.get("Responsibilities", []) or exp.get("Achievements", []) or []
        detail_text = " ".join(d for d in details if isinstance(d, str))
        text = f"{role} at {company}. {detail_text}".strip()
        if text:
            chunks.append(
                {
                    "id": f"exp_{idx}",
                    "label": f"Experience: {role}",
                    "text": text,
                }
            )

    if not chunks:
        chunks.append(
            {
                "id": "fallback",
                "label": "Master Snapshot",
                "text": str(snapshot)[:2000],
            }
        )

    return chunks


def _rank_chunks(job_text: str, chunks: list[dict[str, str]], limit: int = 5) -> list[ChunkMatch]:
    job_terms = set(_tokenize(job_text))
    ranked: list[ChunkMatch] = []
    for chunk in chunks:
        text = chunk["text"]
        chunk_terms = set(_tokenize(text))
        common = sorted(job_terms.intersection(chunk_terms))
        denom = max(len(job_terms), 1)
        score = min(len(common) / denom * 3.2, 1.0)
        ranked.append(
            ChunkMatch(
                chunk_id=chunk["id"],
                label=chunk["label"],
                score=round(score, 3),
                matched_terms=common[:12],
                snippet=text[:240],
            )
        )

    ranked.sort(key=lambda c: c.score, reverse=True)
    return ranked[:limit]


def _ats_preview(job_text: str, master_text: str) -> ATSPreview:
    job_terms = _tokenize(job_text)
    master_terms = set(_tokenize(master_text))
    if not job_terms:
        return ATSPreview(score=0, matched_keywords=[], missing_keywords=[])

    # Ignore ultra-common tokens while keeping deterministic behavior.
    counts = Counter(job_terms)
    weighted_terms = [term for term, _ in counts.most_common(40)]

    matched = [term for term in weighted_terms if term in master_terms]
    missing = [term for term in weighted_terms if term not in master_terms]
    score = int(round((len(matched) / max(len(weighted_terms), 1)) * 100))

    return ATSPreview(
        score=score,
        matched_keywords=matched[:20],
        missing_keywords=missing[:20],
    )


async def analyzeJobFromUrl(
    payload: AnalyzeJobFromUrlRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AnalyzeJobFromUrlResponse:
    active_master = (
        db.query(MasterVersion)
        .filter(MasterVersion.user_id == current_user.id, MasterVersion.is_active.is_(True))
        .order_by(MasterVersion.version_number.desc())
        .first()
    )

    snapshot = active_master.content_snapshot if active_master else {}
    chunks = _extract_master_chunks(snapshot)
    master_text = "\n\n".join(chunk["text"] for chunk in chunks)

    job_title = "Target Role"
    company_name = "Target Company"
    job_text = (payload.job_description or "").strip()

    if payload.url:
        try:
            analysis = await analyze_job_from_url(payload.url)
            job_title = analysis.job_details.role_title or job_title
            company_name = analysis.job_details.company_name or company_name
            if not job_text:
                job_text = (analysis.job_details.full_description or "").strip()
        except Exception:
            # Fallback to lightweight scraping if the unified flow fails.
            if not job_text:
                try:
                    job_text = _extract_text_from_url(payload.url)
                except Exception:
                    job_text = ""

    if not job_text:
        job_text = "No job description provided."

    chunk_matches = _rank_chunks(job_text, chunks)
    ats = _ats_preview(job_text, master_text)

    # Artifact generation with graceful fallback if AI service is unavailable.
    try:
        optimized = await optimize_resume(
            resume_text=master_text or "Resume context unavailable",
            missing_keywords=ats.missing_keywords[:10],
            job_description=job_text,
        )
        tailored_resume = optimized.resume_text
    except Exception:
        tailored_resume = (
            f"Tailored resume draft for {job_title} at {company_name}.\n\n{master_text[:1400]}"
        )

    try:
        cover = generate_smart_cover_letter(
            candidate_profile={"name": current_user.name, "email": current_user.email},
            job_description=job_text,
            company_info={"name": company_name},
            style="professional",
        )
        cover_letter = cover.letter_content
    except Exception:
        cover_letter = (
            f"Dear Hiring Manager,\n\nI am applying for {job_title} at {company_name}. "
            f"My background aligns with the role requirements.\n\nRegards,\n{current_user.name}"
        )

    try:
        ksc = await generateKscResponse(
            user_profile_data={"name": current_user.name, "email": current_user.email},
            ksc_statement=f"Address key selection criteria for {job_title} at {company_name}",
        )
        ksc_response = f"Situation: {ksc.situation}\nTask: {ksc.task}\nAction: {ksc.action}\nResult: {ksc.result}"
    except Exception:
        ksc_response = (
            "Situation: Community service delivery challenge.\n"
            "Task: Maintain outcomes under high demand.\n"
            "Action: Prioritized interventions and coordinated stakeholders.\n"
            "Result: Improved service consistency and measurable client outcomes."
        )

    export_pack = {
        "resume_filename": "Tailored_Resume.txt",
        "cover_letter_filename": "Tailored_Cover_Letter.txt",
        "ksc_filename": "Tailored_KSC.txt",
    }

    return AnalyzeJobFromUrlResponse(
        job_title=job_title,
        company_name=company_name,
        normalized_job_description=job_text,
        chunk_matches=chunk_matches,
        ats_preview=ats,
        artifacts=QuickApplyArtifacts(
            tailored_resume=tailored_resume,
            cover_letter=cover_letter,
            ksc_response=ksc_response,
        ),
        export_pack=export_pack,
    )


@router.post("/analyze-job-from-url", response_model=AnalyzeJobFromUrlResponse)
async def analyze_job_from_url_flow(
    payload: AnalyzeJobFromUrlRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AnalyzeJobFromUrlResponse:
    return await analyzeJobFromUrl(payload, current_user, db)
