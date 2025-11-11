# Technical Debt Registry

This document tracks identified technical debt items that have been converted to GitHub Issues for tracking and prioritization.

## Active Technical Debt

### High Priority

#### Issue #88: Implement skill extraction using Genkit
- **File**: `backend/app/ai/resume_service.py:208`
- **Status**: Open
- **Impact**: Core AI functionality - currently uses hardcoded placeholder skills
- **Effort**: Medium
- **Dependencies**: Genkit AI framework integration
- **Owner**: Backend team
- **Description**: The skill extraction method needs to analyze actual resume content using Genkit flows instead of returning placeholder data
- **Suggested Implementation**:
  - Create a Genkit flow for skill extraction
  - Parse resume text for technical skills
  - Use AI to identify skills and categorize them
  - Map to standardized skill taxonomy
  - Cache results for performance

#### Issue #89: Detect actual MIME type from file in ingestion
- **File**: `backend/app/api/routers/ingestion.py:424`
- **Status**: Open
- **Impact**: Feature limitation - only supports PDF files, blocks multi-format support
- **Effort**: Medium
- **Owner**: Backend team
- **Description**: Hardcoded MIME type prevents handling of multiple file formats
- **Suggested Implementation**:
  - Use python-magic or mimetypes for detection
  - Support PDF, DOCX, TXT, images, etc
  - Add file type validation
  - Handle format-specific processing

### Medium Priority

#### Issue #86: Render actual notifications list in Navbar
- **File**: `frontend/src/components/layout/Navbar.tsx:350`
- **Status**: Open
- **Impact**: UI/UX enhancement - notifications dropdown incomplete
- **Effort**: Small
- **Owner**: Frontend team
- **Description**: Notification dropdown shows count only, doesn't display list of notifications
- **Suggested Implementation**:
  - Create NotificationsList component
  - Fetch user notifications from API
  - Render notification items with actions
  - Add mark as read, delete functionality

#### Issue #87: Fix db import in test conftest
- **File**: `backend/app/tests/conftest.py:70`
- **Status**: Open
- **Impact**: Test infrastructure - database mocking may not work correctly
- **Effort**: Small
- **Owner**: Backend team
- **Description**: Database import is commented out in test fixture
- **Suggested Implementation**:
  - Review db module structure
  - Fix import paths
  - Uncomment and test db mocking

### Low Priority

#### Issue #90: Convert Tailwind classes in migration script
- **File**: `scripts/migrate-tailwind.js:112`
- **Status**: Open
- **Impact**: Build tooling - one-time migration script
- **Effort**: Small
- **Type**: Build/Migration tool
- **Description**: Some Tailwind classes need conversion in migration script
- **Status**: Low priority - script is one-time use, can be revisited if needed

## Retired Technical Debt

None yet - all items are active.

## Metrics

| Category | Count |
|----------|-------|
| High Priority | 2 |
| Medium Priority | 2 |
| Low Priority | 1 |
| **Total** | **5** |

## Next Steps

1. **Prioritize by impact**: Issues #88 and #89 are blockers for feature completeness
2. **Assign owners**: Assign issues to team members based on expertise
3. **Break into subtasks**: Create child issues for larger items
4. **Set sprint goals**: Include 1-2 technical debt items per sprint
5. **Review quarterly**: Re-evaluate priorities each quarter

## References

- GitHub Issues: See links in table above
- Related Documentation: See `/Applications/careercopilot/CLAUDE.md` for project setup
- Team Guidelines: See `.github/pull_request_template.md` for standards

---

Last Updated: 2025-11-11
Created During: Phase 4 Low Priority Cleanup
