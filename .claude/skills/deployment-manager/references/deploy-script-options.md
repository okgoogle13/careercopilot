# ./scripts/deploy.sh Options

The main deployment script `./scripts/deploy.sh` accepts a target and options.

**Available Targets:**

- `staging`: Deploy to staging environment
- `production`: Deploy to production environment (with safety prompt)
- `frontend`: Deploy only frontend
- `functions`: Deploy only functions
- `backend`: Backend deployment info
- `all`: Deploy everything (frontend + functions + backend)

**Available Options:**

- `--skip-tests`: Skip running tests
- `--skip-lint`: Skip linting
- `--help`: Show help message

Use these to modify the command run in Step 6 if the user specifies them.
