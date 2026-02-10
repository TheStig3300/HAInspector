# CI/CD Pipeline Documentation

This document describes the automated CI/CD pipeline for HAInspector.

## 📋 Overview

The project uses **GitHub Actions** for CI/CD with automatic deployments to **Vercel**.

### Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **CI/CD Pipeline** | Push/PR to main | Build, test, and deploy |
| **Code Quality** | Push/PR to main | Lint and verify build |
| **Security & Quality** | Push/PR/Weekly | Security scans and code analysis |
| **Dependency Review** | Pull Requests | Check for vulnerable dependencies |

## 🚀 Deployment Process

### Production Deployment
- **Trigger**: Push to `main` or `master` branch
- **URL**: https://hainspector.vercel.app
- **Process**:
  1. Build verification
  2. Vercel production deployment
  3. Deployment summary posted to GitHub

### Preview Deployment
- **Trigger**: Pull Request to `main` or `master`
- **URL**: Auto-generated Vercel preview URL
- **Process**:
  1. Build verification
  2. Vercel preview deployment
  3. Preview URL commented on PR

## 🔧 Required Secrets

Configure these in GitHub Repository Settings → Secrets and Variables → Actions:

| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel authentication token | [Vercel Dashboard](https://vercel.com/account/tokens) → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | Run `vercel link` locally, found in `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Vercel project ID | Run `vercel link` locally, found in `.vercel/project.json` |

### Setting up Vercel Secrets

1. Install Vercel CLI: `npm install -g vercel`
2. Link your project: `vercel link`
3. Pull environment info: `vercel pull`
4. Find IDs in `.vercel/project.json`:
   ```json
   {
     "orgId": "your-org-id-here",
     "projectId": "your-project-id-here"
   }
   ```
5. Add secrets to GitHub:
   - Go to repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add each secret with the values from `.vercel/project.json`

## 📊 Workflow Details

### 1. CI/CD Pipeline (ci-cd.yml)

```yaml
Jobs:
├── build              # Builds the project and uploads artifacts
├── deploy-preview     # Deploys preview on PRs
└── deploy-production  # Deploys to production on main
```

**Features:**
- Node.js 20 with npm caching
- Artifact retention (7 days)
- Automatic PR commenting with preview URLs
- Deployment summaries with version info

### 2. Code Quality (lint.yml)

```yaml
Jobs:
├── lint          # JavaScript syntax validation
└── build-check   # Build verification
```

**Checks:**
- JavaScript syntax errors
- Build success verification
- Output directory validation

### 3. Security & Quality (security.yml)

```yaml
Jobs:
├── code-quality          # Code analysis
├── security-scan         # Vulnerability scanning
├── build-size-check      # Bundle size analysis
└── browser-compatibility # Browser API checks
```

**Features:**
- Console statement detection
- TODO/FIXME tracking
- Large file detection
- npm audit for vulnerabilities
- Hardcoded secret detection
- Build size monitoring (warns if >5MB)
- Browser compatibility validation

**Schedule:** Runs weekly on Mondays at 9 AM UTC

### 4. Dependency Review (dependency-review.yml)

```yaml
Jobs:
└── dependency-review  # Scans PRs for vulnerable dependencies
```

**Configuration:**
- Fails on moderate+ severity vulnerabilities
- Automatically comments on PRs with findings

## 🎯 Local Development

### Testing Build Locally
```bash
npm run build
```

### Preview Locally
```bash
npm run dev
```

### Manual Vercel Deployment
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## 🔍 Monitoring

### Build Status
- Check the "Actions" tab in GitHub
- View real-time logs for each workflow run
- Deployment summaries appear in workflow run summaries

### Vercel Dashboard
- View deployments: https://vercel.com/dashboard
- Check analytics and performance
- Review deployment logs

## 🐛 Troubleshooting

### Build Fails on GitHub but Works Locally

**Possible causes:**
- Missing dependencies in package.json
- Environment-specific code
- Node version mismatch

**Solution:**
```bash
# Test with clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Fails

**Check:**
1. Vercel token is valid
2. All required secrets are set
3. Vercel project is linked correctly
4. Build succeeds in CI

### Preview URL Not Posted to PR

**Check:**
1. GitHub Actions has write permissions
2. `GITHUB_TOKEN` has issues permission
3. Workflow run succeeded

## 📈 Performance Optimization

### Build Size Monitoring
The `build-size-check` job warns if the build exceeds 5MB.

**To optimize:**
- Review largest files in the build size report
- Consider code splitting
- Optimize images and assets
- Remove unused dependencies

### Browser API Requirements
- Web Bluetooth API
- Web Serial API
- ES Modules support

**Minimum Browser Versions:**
- Chrome/Edge: 89+
- Opera: 76+
- Safari: Not supported (lacks Web Bluetooth/Serial)

## 🔄 Workflow Triggers

| Event | Workflows Triggered |
|-------|-------------------|
| Push to main/master | CI/CD, Code Quality, Security |
| Pull Request | All workflows |
| Weekly (Monday 9 AM) | Security scan |

## 📝 Best Practices

1. **Always create PRs** for changes to trigger preview deployments
2. **Review deployment summaries** after merging to main
3. **Monitor build sizes** to prevent bloat
4. **Check security alerts** from weekly scans
5. **Keep dependencies updated** to avoid vulnerabilities

## 🎨 Customization

### Changing Deployment URL
Edit `.github/workflows/ci-cd.yml` line 115:
```yaml
echo "🌐 **URL:** https://your-new-url.vercel.app" >> $GITHUB_STEP_SUMMARY
```

### Adjusting Build Size Warning
Edit `.github/workflows/security.yml` line 100:
```bash
if [ "$size_bytes" -gt 5242880 ]; then  # Change 5242880 (5MB) to your threshold
```

### Modifying Security Scan Schedule
Edit `.github/workflows/security.yml` line 13:
```yaml
- cron: '0 9 * * 1'  # Change cron expression
```

## 🆘 Support

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Vercel Docs**: https://vercel.com/docs
- **Vite Build Docs**: https://vitejs.dev/guide/build.html

---

**Last Updated**: 2026-02-10
**Pipeline Version**: 2.0
**Maintained by**: HAInspector Team
