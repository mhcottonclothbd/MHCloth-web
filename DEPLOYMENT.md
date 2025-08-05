# Deployment Guide

This guide provides comprehensive instructions for deploying the MHCloth e-commerce application to Vercel and managing the GitHub repository.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel account (free tier available)
- Basic knowledge of command line

## 🔧 Environment Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
# Clerk Authentication (Optional - for user authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Next.js Configuration
NEXT_TELEMETRY_DISABLED=1

# Application URL (for production)
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### 2. Required Environment Variables for Production

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional | Clerk authentication public key |
| `CLERK_SECRET_KEY` | Optional | Clerk authentication secret key |
| `NEXT_TELEMETRY_DISABLED` | Recommended | Disables Next.js telemetry |
| `NEXT_PUBLIC_APP_URL` | Recommended | Your application URL |

## 🚀 Vercel Deployment

### Method 1: One-Click Deploy (Recommended)

1. Click the deploy button:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/devisTuhin/mhcloth.git)

2. Connect your GitHub account if not already connected

3. Configure your project:
   - **Project Name**: Choose a unique name
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)

4. Add environment variables in the deployment interface

5. Click "Deploy"

### Method 2: Manual Deployment

#### Step 1: Prepare Your Repository

```bash
# Clone the repository
git clone https://github.com/devisTuhin/mhcloth.git
cd mhcloth

# Install dependencies
npm install

# Test the build locally
npm run build
npm run start
```

#### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `https://github.com/devisTuhin/mhcloth.git`
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

#### Step 3: Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

**Production Environment:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**Preview Environment:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_test_key
CLERK_SECRET_KEY=sk_test_your_test_secret
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_APP_URL=https://your-app-name-preview.vercel.app
```

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔄 GitHub Actions CI/CD

The repository includes a comprehensive GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

- **Lints and type-checks** code on every push/PR
- **Builds and tests** the application
- **Deploys preview** versions for pull requests
- **Deploys to production** when merging to main/master

### Required GitHub Secrets

Add these secrets in GitHub Repository → Settings → Secrets and Variables → Actions:

| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | Run `vercel link` locally |
| `VERCEL_PROJECT_ID` | Vercel project ID | Run `vercel link` locally |

### Getting Vercel IDs

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# This will create .vercel/project.json with your IDs
cat .vercel/project.json
```

## 🛠️ Custom Domain Setup

### 1. Add Custom Domain in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `yourdomain.com`)
3. Configure DNS records as instructed by Vercel

### 2. Update Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. SSL Certificate

Vercel automatically provides SSL certificates for all domains.

## 🔍 Monitoring and Analytics

### Vercel Analytics

1. Enable in Vercel Dashboard → Project → Analytics
2. Add to your app:

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Performance Monitoring

1. Enable Web Vitals in Vercel Dashboard
2. Monitor Core Web Vitals and performance metrics

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: "Type errors"**
```bash
# Check TypeScript errors
npx tsc --noEmit
```

#### Runtime Errors

**Error: "Missing environment variables"**
- Verify all required environment variables are set in Vercel
- Check variable names match exactly (case-sensitive)
- Ensure `NEXT_PUBLIC_` prefix for client-side variables

**Error: "Authentication not working"**
- Verify Clerk keys are correct
- Check domain configuration in Clerk dashboard
- Ensure environment variables are set for the correct environment

### Performance Issues

**Slow Build Times**
- Enable Vercel's build cache
- Optimize dependencies
- Use `npm ci` instead of `npm install`

**Large Bundle Size**
- Analyze bundle with `npm run build`
- Implement code splitting
- Remove unused dependencies

## 📊 Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] TypeScript compilation successful
- [ ] ESLint passes (`npm run lint`)
- [ ] All tests pass (if applicable)
- [ ] Images optimized and properly sized
- [ ] SEO meta tags configured

### Post-Deployment

- [ ] Application loads correctly
- [ ] All pages accessible
- [ ] Authentication working (if enabled)
- [ ] Forms submitting properly
- [ ] Images loading correctly
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] Error monitoring configured

## 🔄 Continuous Deployment

The GitHub Actions workflow automatically:

1. **On Pull Request**: Creates preview deployment
2. **On Merge to Main**: Deploys to production
3. **On Push**: Runs tests and linting

### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 📞 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Check GitHub Actions logs for CI/CD issues
4. Contact support through respective platforms

---

**Your MHCloth application is now ready for production deployment!** 🚀