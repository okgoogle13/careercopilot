---
name: api-contract-validator
description: 'Validates type contracts between TypeScript interfaces and Pydantic
  models. Detects field mismatches and type inconsistencies. Related: frontend-backend-mapper
  for endpoint discovery.'
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

## Purpose

Ensures type safety and consistency between frontend TypeScript interfaces and backend Pydantic models by detecting field name differences, type mismatches, and missing fields.

## When to Use

- When validating API contracts before a release.
- When identifying breaking changes in data models between frontend and backend.
- When standardizing property casing (camelCase vs snake_case) across the stack.

## Process

1. **Scan TypeScript interfaces:**
   - Read frontend API service files (`frontend/src/api/*.ts`)
   - Extract TypeScript interfaces for requests/responses
   - Parse field types, optional fields, arrays, enums
   - Build TypeScript type inventory

2. **Scan Pydantic models:**
   - Read backend model files (`backend/app/models/*_schemas.py`)
   - Extract Pydantic BaseModel definitions
   - Parse field types, Optional types, Lists, Enums
   - Build Python type inventory

3. **Match and compare contracts:**
   - Match TypeScript interfaces to Pydantic models by name
   - Compare field names (check for camelCase vs snake_case)
   - Compare field types (string vs str, number vs int/float)
   - Check required vs optional field consistency
   - Validate enum values match

4. **Detect mismatches:**
   - **Field name differences**: `userId` vs `user_id`
   - **Type mismatches**: `string` vs `int`
   - **Missing fields**: Field in frontend but not backend (or vice versa)
   - **Optional inconsistencies**: Required in one but optional in another
   - **Enum value differences**: Different allowed values

5. **Generate validation report:**
   - Create `docs/API_CONTRACT_VALIDATION.md` with:
     - Contract health score
     - List of all validated contracts
     - Detailed mismatch reports
     - Recommended fixes (with code examples)
     - Breaking vs non-breaking changes

6. **Provide fix suggestions:**
   - Show exact code changes needed
   - Generate conversion utilities if needed
   - Suggest API versioning for breaking changes

## Validation Report Structure

````markdown
# API Contract Validation Report

Generated: 2025-01-06T12:00:00Z

## Summary

- Total Contracts Validated: 28
- ✅ Matching Contracts: 22 (78.6%)
- ⚠️ Mismatches Found: 6 (21.4%)
- 🔴 Breaking Issues: 2
- 🟡 Non-Breaking Issues: 4

## Contract Health Score: 79/100

### ✅ VALID CONTRACTS (22)

| Contract Name     | Frontend          | Backend             | Status           |
| ----------------- | ----------------- | ------------------- | ---------------- |
| `ATSScoreRequest` | aiServices.ts     | analysis_schemas.py | ✅ Perfect match |
| `UserProfile`     | profileService.ts | schemas.py          | ✅ Perfect match |
| ...               |

### 🔴 BREAKING MISMATCHES (2)

#### 1. NotificationPreferences

**Location:** `notificationService.ts` ↔ `notification_schemas.py`

**Issues:**

- Field type mismatch: `frequency` is `string` in TS but `int` in Python
- Missing required field: `user_id` required in backend but not sent from frontend

**Impact:** 🔴 API calls will fail with 422 validation errors

**Fix (Frontend):**

```typescript
// notificationService.ts
interface NotificationPreferences {
  frequency: number; // Change from string to number
  user_id: string; // Add missing field
  // ... other fields
}
```
````

**Fix (Backend - Alternative):**

```python
# notification_schemas.py
class NotificationPreferencesRequest(BaseModel):
    frequency: str  # Change from int to str
    # Remove user_id from request, get from auth instead
```

### 🟡 NON-BREAKING WARNINGS (4)

#### 1. Casing Inconsistency

**Issue:** Frontend uses camelCase, backend uses snake_case
**Affected:** 15 contracts
**Impact:** 🟡 Works but inconsistent (Pydantic auto-converts)
**Recommendation:** Standardize on one casing style

**Example:**

```typescript
// Frontend (camelCase)
interface JobListing {
  jobTitle: string;
  companyName: string;
}

// Backend (snake_case)
class JobListingResponse(BaseModel):
    job_title: str
    company_name: str
```

**Recommendation:** Add Pydantic alias config:

```python
class JobListingResponse(BaseModel):
    job_title: str = Field(alias="jobTitle")
    company_name: str = Field(alias="companyName")

    class Config:
        populate_by_name = True
```

## Type Mapping Reference

| TypeScript  | Python (Pydantic) | Compatible             |
| ----------- | ----------------- | ---------------------- |
| `string`    | `str`             | ✅                     |
| `number`    | `int`, `float`    | ✅                     |
| `boolean`   | `bool`            | ✅                     |
| `string[]`  | `List[str]`       | ✅                     |
| `Date`      | `datetime`        | ⚠️ Needs serialization |
| `any`       | `Any`             | ⚠️ Avoid if possible   |
| `T \| null` | `Optional[T]`     | ✅                     |

```

## Usage Tips

- Run validator before major releases
- Integrate into CI/CD pipeline
- Fix breaking issues immediately
- Schedule non-breaking fixes for next sprint
- Use validator output for API documentation
```
