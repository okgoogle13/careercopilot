# CareerCopilot Workspace Structure

This project uses npm workspaces to manage dependencies across multiple packages. All dependencies are pinned to exact versions for reproducible builds.

## Structure

## Available Commands

### Root Level Commands

```bash
# Development
npm run dev                 # Start frontend development server
npm run dev:frontend        # Start frontend development server (explicit)
npm run dev:functions       # Start Firebase functions emulator

# Building
npm run build               # Build both frontend and functions
npm run build:frontend      # Build frontend only
npm run build:functions     # Deploy functions only

# Code Quality
npm run type-check          # Run TypeScript type checking
npm run lint                # Lint frontend code
npm run lint:fix            # Fix linting issues
npm run format              # Format code with Prettier
npm run format:check        # Check code formatting

# Testing
npm run test                # Run frontend tests
npm run test:e2e            # Run end-to-end tests
npm run test:all            # Run all tests

# Utilities
npm run clean               # Clean all workspaces
npm run install:all         # Install all dependencies
```

### Workspace-Specific Commands

Run commands in specific workspaces:

```bash
# Frontend workspace
npm run dev --workspace=frontend
npm run build --workspace=frontend
npm run lint --workspace=frontend

# Functions workspace
npm run serve --workspace=functions
npm run deploy --workspace=functions
npm run logs --workspace=functions
```

## Dependency Management

### JavaScript/TypeScript Dependencies

All JavaScript dependencies are managed at the root level with exact version pinning:

- **No version ranges** (^, ~) - all versions are pinned exactly
- **Shared dependencies** are hoisted to the root
- **Workspace-specific** dependencies remain in individual package.json files

### Python Dependencies

Backend Python dependencies are managed in `backend/requirements.txt` with exact versions:

```bash
cd backend
pip install -r requirements.txt
```

## Development Workflow

1. **Install all dependencies:**
   ```bash
   npm install
   ```

2. **Start development:**
   ```bash
   npm run dev  # Frontend only
   # OR
   npm run dev:frontend & npm run dev:functions  # Both services
   ```

3. **Backend development:**
   ```bash
   cd backend
   python -m uvicorn app.main_simple:app --reload --port 8000
   ```

## Adding Dependencies

### Adding JavaScript Dependencies

For shared dependencies (used by multiple workspaces):
```bash
npm install --save-dev exact-package-name@1.2.3
```

For workspace-specific dependencies:
```bash
npm install package-name@1.2.3 --workspace=frontend
```

### Adding Python Dependencies

1. Install the package:
   ```bash
   cd backend
   pip install package-name==1.2.3
   ```

2. Update requirements.txt with exact version:
   ```bash
   pip freeze | grep package-name >> requirements.txt
   ```

## Version Pinning Policy

All dependencies are pinned to exact versions to ensure:

- **Reproducible builds** across different environments
- **Consistent behavior** for all team members
- **Predictable deployments** without surprise updates
- **Security** by avoiding automatic updates to potentially vulnerable versions

### Before Updating Dependencies

1. Test thoroughly in development
2. Update versions explicitly in package.json/requirements.txt
3. Run full test suite
4. Update this documentation if needed

## Troubleshooting

### Dependency Resolution Issues

If you encounter dependency conflicts:

```bash
# Clean everything and reinstall
rm -rf node_modules package-lock.json frontend/node_modules functions/node_modules
npm install
```

### Workspace Command Not Found

Make sure you're running commands from the root directory and the workspace name matches exactly.

### Python Environment Issues

Consider using a virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

## Benefits of This Structure

1. **Centralized dependency management** - easier to maintain
2. **Exact version control** - reproducible across environments
3. **Shared tooling** - ESLint, Prettier, TypeScript configs shared
4. **Simplified CI/CD** - single install step for all JS dependencies
5. **Better caching** - npm can optimize installs across workspaces
