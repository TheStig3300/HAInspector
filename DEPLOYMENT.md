
# Deployment Guide (HAInspector)

## CI/CD Pipeline

This project uses GitHub Actions for automated CI/CD with Vercel deployment for HAInspector.

### Workflows

#### 1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
Runs on every push to main/master and on pull requests.

**Jobs:**
- **Build**: Compiles the project and uploads artifacts
- **Deploy Preview**: Deploys PR previews to Vercel
- **Deploy Production**: Deploys to production on main/master branch

#### 2. **Code Quality** (`.github/workflows/lint.yml`)
Validates code quality on every push and PR.

**Jobs:**
- **Lint**: Checks JavaScript syntax
- **Build Check**: Verifies successful build

#### 3. **Dependency Review** (`.github/workflows/dependency-review.yml`)
Reviews dependencies for security vulnerabilities on PRs.

### Setup Instructions

#### Required Secrets

Add these secrets to your GitHub repository:
1. Go to `Settings` → `Secrets and variables` → `Actions`
2. Click `New repository secret`
3. Add the following:

**VERCEL_TOKEN**
- Get from: https://vercel.com/account/tokens
- Scope: Full Account
- Expiration: No expiration (or set to your preference)

**VERCEL_ORG_ID** (Optional for team projects)
- Find in `.vercel/project.json` after running `vercel link`

**VERCEL_PROJECT_ID** (Optional)
- Find in `.vercel/project.json` after running `vercel link`

#### First-Time Setup

1. **Link Vercel Project Locally**
   ```bash
   vercel link
   ```

2. **Get Vercel Token**
   ```bash
   # Visit https://vercel.com/account/tokens
   # Create new token with appropriate scope
   # Add to GitHub secrets as VERCEL_TOKEN
   ```

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add CI/CD pipeline"
   git push origin main
   ```

4. **Verify Workflows**
   - Check `Actions` tab in GitHub repository
   - Verify workflows are running
   - Check deployment status in Vercel dashboard

### Deployment Environments

- **Production**: https://hainspector.vercel.app
  - Deploys from `main` or `master` branch
  - Automatic deployment on every push

- **Preview**: Auto-generated URL for each PR
   - Format: `hainspector-<random>.vercel.app`
  - URL posted as comment on PR
  - Automatic deployment on every PR update

### Manual Deployment

If needed, you can still deploy manually:

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Workflow Triggers

- **Push to main/master**: Full CI/CD → Production deployment
- **Pull Request**: Build check → Preview deployment
- **Manual**: Can trigger manually from Actions tab

### Build Process

1. **Install Dependencies**: `npm ci`
2. **Build Project**: `npm run build`
3. **Upload Artifacts**: Stores `dist/` directory
4. **Deploy to Vercel**: Uses Vercel CLI

### Monitoring

- **GitHub Actions**: Monitor workflow runs in Actions tab
- **Vercel Dashboard**: View deployment status and logs
- **Production URL**: https://hainspector.vercel.app

### Troubleshooting

**Build Fails**
- Check syntax errors with `npm run build` locally
- Review workflow logs in GitHub Actions
- Verify all dependencies are in `package.json`

**Deployment Fails**
- Verify `VERCEL_TOKEN` is valid and has correct permissions
- Check Vercel dashboard for deployment errors
- Ensure `vercel.json` configuration is correct

**Preview Not Deploying**
- Verify PR is from the same repository (not a fork)
- Check workflow permissions in repository settings
- Ensure `VERCEL_TOKEN` secret is accessible

### Best Practices

1. **Always test locally** before pushing
   ```bash
   npm run build
   npm run preview
   ```

2. **Create feature branches** for new work
   ```bash
   git checkout -b feature/my-new-feature
   ```

3. **Open Pull Requests** for code review
   - Automatic preview deployment
   - CI checks must pass

4. **Merge to main** only after approval
   - Automatic production deployment
   - Monitor deployment status

5. **Tag releases** for version tracking
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

### Environment Variables

If your project needs environment variables:

1. Add to Vercel project settings
2. Add to GitHub secrets (if needed for build)
3. Use `.env.local` for local development (gitignored)

### Rollback

If production deployment fails:

1. **Via Vercel Dashboard**:
   - Go to deployment history
   - Click "Promote to Production" on previous working deployment

2. **Via Git**:
   ```bash
   git revert HEAD
   git push origin main
   ```

### Status Badges

Add to README.md:

```markdown
[![CI/CD](https://github.com/YOUR_USERNAME/HAInspector/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/HAInspector/actions/workflows/ci-cd.yml)
[![Code Quality](https://github.com/YOUR_USERNAME/HAInspector/actions/workflows/lint.yml/badge.svg)](https://github.com/YOUR_USERNAME/HAInspector/actions/workflows/lint.yml)
```
