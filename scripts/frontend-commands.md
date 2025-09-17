# Frontend Deployment Commands

This document describes the deployment readiness commands for the CareerCopilot frontend built with Vite, React, and TypeScript.

## Available Scripts

### 1. Frontend Deployment Readiness Check

**Script:** `./scripts/frontend-deployment-readiness.sh`

Comprehensive deployment readiness validation including TypeScript, build, testing, linting, and security checks.

#### Usage

```bash
./scripts/frontend-deployment-readiness.sh [options]
```

#### Options

- `--skip-tests` - Skip running unit and E2E tests
- `--skip-build` - Skip build validation
- `--skip-lint` - Skip ESLint checks
- `--bundle-analyze` - Enable bundle analysis
- `-h, --help` - Show help message

#### What it checks

- ✅ Node.js and package manager versions
- ✅ Dependency installation and validation
- ✅ TypeScript type checking
- ✅ Code formatting (Prettier)
- ✅ ESLint linting
- ✅ Unit tests (Jest)
- ✅ E2E tests (Playwright)
- ✅ Production build validation
- ✅ Build artifact verification
- ✅ Bundle size analysis
- ✅ Security vulnerability scanning
- ✅ Environment configuration checks
- ✅ Performance optimization validation

#### Examples

```bash
# Full deployment readiness check
./scripts/frontend-deployment-readiness.sh

# Quick check without tests
./scripts/frontend-deployment-readiness.sh --skip-tests

# Check with bundle analysis
./scripts/frontend-deployment-readiness.sh --bundle-analyze

# Fast lint and build only
./scripts/frontend-deployment-readiness.sh --skip-tests --skip-lint
```

### 2. TypeScript Validation

**Script:** `./scripts/typescript-check.sh`

Dedicated TypeScript type checking and validation with detailed analysis.

#### Usage

```bash
./scripts/typescript-check.sh [options]
```

#### Options

- `--verbose` - Enable verbose output with detailed errors
- `--fix` - Attempt to fix auto-fixable TypeScript issues
- `-h, --help` - Show help message

#### What it checks

- ✅ TypeScript configuration validation
- ✅ Comprehensive type checking
- ✅ Strict mode configuration
- ✅ Unused code detection
- ✅ Import/export consistency
- ✅ Type definition validation
- ✅ Compilation performance analysis
- ✅ Code quality metrics

#### Examples

```bash
# Standard TypeScript check
./scripts/typescript-check.sh

# Verbose output with detailed errors
./scripts/typescript-check.sh --verbose

# Auto-fix TypeScript issues
./scripts/typescript-check.sh --fix
```

### 3. Vite Bundle Analysis

**Script:** `./scripts/vite-bundle-analyzer.sh`

Advanced bundle analysis and optimization recommendations for Vite builds.

#### Usage

```bash
./scripts/vite-bundle-analyzer.sh [options]
```

#### Options

- `--analyze-only` - Only analyze existing build, don't rebuild
- `--no-report` - Don't generate HTML report
- `--output-dir` - Specify custom output directory
- `-h, --help` - Show help message

#### What it analyzes

- 📦 JavaScript bundle sizes and chunks
- 🎨 CSS file analysis
- 🖼️ Asset optimization opportunities
- 🔍 Code splitting effectiveness
- 📊 Performance recommendations
- 📈 Gzipped size calculations
- 🚨 Large bundle warnings
- 💡 Optimization suggestions

#### Examples

```bash
# Full bundle analysis with rebuild
./scripts/vite-bundle-analyzer.sh

# Analyze existing build only
./scripts/vite-bundle-analyzer.sh --analyze-only

# Generate analysis without HTML report
./scripts/vite-bundle-analyzer.sh --no-report

# Custom output directory
./scripts/vite-bundle-analyzer.sh --output-dir build
```

## Package.json Integration

These scripts are integrated into the frontend package.json:

```json
{
  "scripts": {
    "bundle-analysis": "../scripts/vite-bundle-analyzer.sh --analyze-only",
    "bundle-analysis:build": "../scripts/vite-bundle-analyzer.sh",
    "deployment-check": "../scripts/frontend-deployment-readiness.sh",
    "typescript-check": "../scripts/typescript-check.sh"
  }
}
```

## Common Workflows

### Pre-deployment Validation

```bash
# Complete deployment readiness check
./scripts/frontend-deployment-readiness.sh

# If issues found, run specific checks
./scripts/typescript-check.sh --fix
```

### Bundle Optimization

```bash
# Analyze current bundle
./scripts/vite-bundle-analyzer.sh --analyze-only

# Full rebuild with analysis
./scripts/vite-bundle-analyzer.sh
```

### CI/CD Integration

```bash
# CI-friendly commands (non-interactive)
./scripts/frontend-deployment-readiness.sh --skip-tests
./scripts/typescript-check.sh
```

## Output Examples

### Successful Deployment Check

```
[INFO] Starting Frontend Deployment Readiness Check...
[SUCCESS] Dependencies are up to date
[SUCCESS] TypeScript type checking passed
[SUCCESS] Code formatting is correct
[SUCCESS] Linting passed
[SUCCESS] Unit tests passed
[SUCCESS] Production build successful
[SUCCESS] Build artifacts generated successfully
[INFO] Build size analysis: 2.1M
[SUCCESS] Frontend deployment readiness check completed!
[INFO] Ready for deployment! 🚀
```

### Bundle Analysis Report

```
=== Bundle Analysis Report ===
📦 JavaScript Bundles:
  ● index-a1b2c3.js: 245K (87K gzipped)
  ● vendor-d4e5f6.js: 180K (65K gzipped)
  ● firebase-g7h8i9.js: 95K (32K gzipped)

🎨 CSS Files:
  • style-j0k1l2.css: 45K

🖼️ Assets:
  • logo.svg: 2.1K
  • favicon.ico: 4.2K

📊 Performance Recommendations:
[SUCCESS] Main bundle size is optimal (245KB)
[SUCCESS] All JavaScript chunks are reasonably sized
```

## Error Handling

All scripts provide clear error messages and exit codes:

- ✅ Exit code 0: Success
- ❌ Exit code 1: Failure with detailed error information
- ⚠️ Warnings are logged but don't cause script failure

## Integration with Existing Tools

These scripts work with your existing toolchain:

- **Vite**: Uses existing vite.config.ts
- **TypeScript**: Uses existing tsconfig.json
- **ESLint**: Uses existing ESLint configuration
- **Prettier**: Uses existing Prettier configuration
- **Jest**: Uses existing Jest configuration
- **Playwright**: Uses existing Playwright configuration

## Best Practices

1. **Run deployment check before every deploy**
2. **Use TypeScript check during development**
3. **Analyze bundles when adding new dependencies**
4. **Monitor bundle sizes over time**
5. **Fix TypeScript issues immediately**
6. **Keep build times under 30 seconds**
7. **Maintain bundle sizes under 500KB per chunk**
