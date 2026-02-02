# CareerCopilot Security Policy

## Secrets Management

### Approved Storage Methods

1. **macOS Keychain** (Recommended)
   - GUI: Keychain Access.app
   - CLI: `security` command
   - Auto-loads on shell startup

2. **.env.local Files** (Development Only)
   - Git-ignored (in .gitignore)
   - Never committed to repository
   - Permissions: 0600

3. **Google Cloud Secret Manager** (Production)
   - For deployed applications
   - Accessed via gcloud CLI
   - Audit-logged access

### Forbidden Methods

- Hardcoded in config files
- Committed to git repository
- World-readable file permissions
- Shell history files
- Process environment variables (visible via `ps`)

### Credential Rotation Schedule

- GitHub PAT: Every 90 days
- API Keys: Every 60 days
- Database passwords: Every 30 days
- Emergency revocation: Immediately if compromised

### Incident Response

1. Immediately revoke exposed credentials
2. Generate audit logs for unauthorized access
3. Update all configs with new credentials
4. Notify team of security incident
5. Post-mortem review within 24 hours

## Audit and Compliance

- Monthly security audit of credentials
- Quarterly penetration testing
- Annual security review
- Continuous pre-commit secret scanning

## Team Training

All developers must:

- Complete security training before access
- Never share credentials via email/chat
- Report security concerns immediately
- Participate in security reviews

See [REMEDIATION_PLAN.md](MCP_REMEDIATION_PLAN.md) for implementation details.
