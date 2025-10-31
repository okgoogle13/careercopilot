## Consolidated Claude Code Master Prompt: Production Readiness & Technical Debt Fixes

**Overall Instruction:** Execute all actions below across the repository. Prioritize security updates and the removal of deprecated features (Pinecone/Legacy UI) to stabilize the application for production launch.

---

### **1. Critical Security, Secrets Management, and Hardening**

| File/Context | Instruction | Priority/Source |
| :--- | :--- | :--- |
| **`backend/app/core/config.py`** | Implement logic to fetch all production secrets at runtime from **Google Secret Manager**, replacing the insecure `.env` file strategy. Remove all hardcoded fallbacks (e.g., `change-in-production`). | **CRITICAL (Original Audit)** |
| **`docker-compose.production.yml`** | Remove the exposed `ports` configuration for the **`postgres` and `redis`** services to restrict access to the internal container network only, eliminating host exposure. | **HIGH (Original Audit)** |
| **`firestore.rules`** | Manually review and harden the rules to enforce the **principle of least privilege**. | **HIGH (Original Audit)** |
| **All API Endpoints** | Integrate explicit **Input Sanitization and Validation** (leveraging Pydantic/FastAPI features) to mitigate XSS and SQL Injection vulnerabilities. | **HIGH (Original Audit)** |
| **Pinecone/Vector Logic** | **Delete all Pinecone integration code, configurations, and setup scripts** (e.g., references in `scripts/rotate-api-keys.sh`, `scripts/setup-secrets.sh`, `docs/setup/SETUP_GUIDE.md`, and any unused API fetching logic). | **HIGH (Copilot Cleanup)** |

---

### **2. Code Health, Dependency Audit, and Frontend Optimization**

| File/Context | Instruction | Priority/Source |
| :--- | :--- | :--- |
| **Dependencies** | Perform a comprehensive audit and **upgrade all critical dependencies** with known vulnerabilities or major version updates (e.g., Firebase, React, FastAPI, `urllib3`). | **CRITICAL (Original Audit)** |
| **Frontend Dependencies** | **Remove redundant/unused packages** in the frontend (e.g., duplicate Firebase packages, `styled-components` if fully migrated to MUI). | **HIGH (Original Audit)** |
| **`README.md` (Frontend)** | **Update the documented React version to reflect `v18`** to resolve the code-documentation mismatch. | **MEDIUM (Original Audit)** |
| **Legacy Component Files** | **Delete monolithic/legacy component files** identified in the cleanup notes, including redundant `ComponentLibrary.tsx` instances (e.g., in `Career Copilot (Community)/src/components/` and `frontend/src/components/features/demo/`). | **MEDIUM (Copilot Cleanup)** |
| **Frontend Styles/Components** | **Remove all unused Tailwind/legacy CSS classes and components** leftover from the migration to Material-UI. Review and remove legacy props/navigation logic, including those detailed in `frontend/src/components/README.md`. | **MEDIUM (Copilot Cleanup)** |
| **Storybook/Demo Files** | Review and **update or remove Storybook/demo files** (e.g., in `frontend/src/components/documents/__stories__/`) that reference deprecated props or components. | **LOW (Copilot Cleanup)** |
| **`scripts/vite-bundle-analyzer.sh`** | Integrate a bundle analyzer tool into the CI pipeline and reference the report findings to address unnecessarily large dependencies. | **MEDIUM (Original Audit)** |

---

### **3. DevOps Maturity, Observability, and Backend Cleanup**

| File/Context | Instruction | Priority/Source |
| :--- | :--- | :--- |
| **`.github/workflows/deploy.yml`** | **Implement an Automated Rollback Strategy**: Add mandatory post-deployment health checks and configure the pipeline to automatically revert to the previously known good version if checks fail. | **HIGH (Original Audit)** |
| **`backend/Dockerfile`** | **Optimize Docker layer caching** by moving `COPY requirements.txt .` and `pip install -r requirements.txt` before the full source code copy (`COPY . .`). | **MEDIUM (Original Audit)** |
| **`backend/app/core/logging_config.py`** | Configure logging to produce **Structured, Centralized JSON-formatted logs** (e.g., using `loguru`). | **HIGH (Original Audit)** |
| **`backend/app/core/monitoring.py`** & **`backend/app/main.py`** | **Instrument the FastAPI application** with a Prometheus client library to expose key application metrics (latency, error rates, AI flow execution time). Define critical alerts (high error rate, latency) in `monitoring/alerts.yml`. | **HIGH (Original Audit)** |
| **`backend/app/ai/vector_store.py`** | **Remove the large test/demo `main()` function** and any unused/legacy vector operation methods. | **Copilot Cleanup** |
| **`backend/app/core/config.py`** | **Remove unused legacy RAG settings** (e.g., `rag_chunk_overlap`, `rag_vector_collection`, etc.) and related code/scripts (`scripts/test-vector-search.py`). | **Copilot Cleanup** |
| **Backend AI Flows** | Implement **Distributed Tracing** (e.g., using OpenTelemetry, if already available) across the FastAPI backend and Celery workers for complex AI workflows. | **MEDIUM (Original Audit)** |
| **API Documentation** | Enable and configure **FastAPI's auto-generated OpenAPI (Swagger/ReDoc) documentation** as the single source of truth for the API contract. | **MEDIUM (Original Audit)** |
