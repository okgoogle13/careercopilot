# backend/app/core/pdf_renderer.py
"""
PDF Renderer: Generates PDF documents from structured career data.
Uses WeasyPrint for HTML-to-PDF conversion to allow for CSS styling.
"""

from typing import Any

from weasyprint import HTML


def _generate_html_from_content(title: str, content_html: str, theme_id: str = "minimal") -> str:
    """Helper to wrap content in a basic HTML structure with styling."""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{title}</title>
        <style>
            body {{
                font-family: 'Calibri', 'Arial', sans-serif;
                line-height: 1.5;
                color: #333;
                margin: 40px;
            }}
            h1 {{ color: #1a1a1a; border-bottom: 2px solid #eee; padding-bottom: 10px; }}
            h2 {{ color: #2c3e50; border-bottom: 1px solid #eee; margin-top: 25px; }}
            .header {{ text-align: left; margin-bottom: 30px; }}
            .contact {{ font-size: 0.9em; color: #666; }}
            .section {{ margin-bottom: 20px; }}
            .job-title {{ font-weight: bold; }}
            .job-dates {{ font-style: italic; color: #777; float: right; }}
            ul {{ padding-left: 20px; }}
            li {{ margin-bottom: 5px; }}
        </style>
    </head>
    <body>
        {content_html}
    </body>
    </html>
    """


def render_cover_letter_pdf(
    content: str,
    candidate_name: str | None = None,
    theme_id: str = "minimal",
) -> bytes:
    """Renders a cover letter to PDF."""
    paragraphs = content.split("\n\n")
    body_html = "".join([f"<p>{p.strip()}</p>" for p in paragraphs if p.strip()])

    header_html = f"<h1>{candidate_name}</h1>" if candidate_name else ""
    full_html = _generate_html_from_content(
        title="Cover Letter", content_html=f"{header_html}{body_html}", theme_id=theme_id
    )

    return HTML(string=full_html).write_pdf()


def render_resume_pdf(
    sections: dict[str, Any],
    candidate_name: str | None = None,
    theme_id: str = "minimal",
) -> bytes:
    """Renders a resume to PDF."""
    basics = sections.get("basics", {})
    name = candidate_name or basics.get("name", "Candidate")

    # Build sections
    content_parts = [f"<h1>{name}</h1>"]

    contact_parts = []
    if basics.get("email"):
        contact_parts.append(basics["email"])
    if basics.get("phone"):
        contact_parts.append(basics["phone"])
    if basics.get("location"):
        contact_parts.append(basics["location"])
    if contact_parts:
        content_parts.append(f"<div class='contact'>{' | '.join(contact_parts)}</div>")

    if sections.get("summary"):
        content_parts.append(
            f"<h2>Professional Summary</h2><div class='section'>{sections['summary']}</div>"
        )

    if sections.get("work"):
        content_parts.append("<h2>Work Experience</h2>")
        for job in sections["work"]:
            dates = f"<span class='job-dates'>{job.get('startDate', '')} - {job.get('endDate', 'Present')}</span>"
            content_parts.append(
                f"<div class='section'><span class='job-title'>{job.get('role', 'Role')}</span> at {job.get('company', 'Company')} {dates}"
            )
            bullets = "".join([f"<li>{b}</li>" for b in job.get("bullets", [])])
            content_parts.append(f"<ul>{bullets}</ul></div>")

    # Add Education, Skills similarly...
    # (Simplified for now, can be expanded)

    full_html = _generate_html_from_content(
        title="Resume", content_html="".join(content_parts), theme_id=theme_id
    )

    return HTML(string=full_html).write_pdf()


def render_ksc_pdf(
    responses: list[dict[str, Any]],
    job_title: str = "Job Application",
    theme_id: str = "minimal",
) -> bytes:
    """Renders KSC responses to PDF."""
    content_parts = [f"<h1>Selection Criteria: {job_title}</h1>"]

    for item in responses:
        criterion = item.get("criterion", "Criterion")
        response = item.get("response", "")
        content_parts.append(f"<h2>{criterion}</h2>")
        paragraphs = response.split("\n\n")
        content_parts.append("".join([f"<p>{p.strip()}</p>" for p in paragraphs if p.strip()]))

    full_html = _generate_html_from_content(
        title="KSC Response", content_html="".join(content_parts), theme_id=theme_id
    )

    return HTML(string=full_html).write_pdf()
