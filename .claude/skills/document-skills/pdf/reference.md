# PDF Skill Reference Guide

This document provides common use cases and prompting strategies for the `pdf-text-extractor` skill (`SKILL.md`).

The skill is flexible and adapts its output based on your `$PROMPT`.

## 1. Full Text Extraction (Default)

This is the simplest use case. It extracts all text in reading order.

**Prompt ($PROMPT):** "Extract all text from the attached document."

**Output:** The `output` key will contain `extractedText` with the full text.

## 2. Summarization

Ask the skill to summarize the content instead of just extracting it.

**Prompt ($PROMPT):** "Summarize this 10-page report and provide 5 key bullet points."

**Output:** The `output` key will contain a `summary` string.

## 3. Question & Answer (Q&A)

Ask a specific question about the document's content.

**Prompt ($PROMPT):** "What was the company's total revenue in Q4 2023, according to this report?"

**Output:** The `output` key will contain an `answer` string.

## 4. Structured Data Extraction (Form Parsing)

This is the most powerful feature. Provide a JSON schema in your prompt to get structured output.

**See `forms.md` for a detailed example.**

**Prompt ($PROMPT):** "Extract the 'Education' and 'Work Experience' sections from this resume. Return the data in this JSON format:
```json
{
  "education": [
    { "degree": "...", "school": "...", "year": "..." }
  ],
  "workExperience": [
    { "title": "...", "company": "...", "duration": "..." }
  ]
}
```"

**Output:** The `output` key will contain `extractedFormFields` matching your JSON schema.
