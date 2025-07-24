# Deployment Guide

This guide will help you deploy your Physical Store e-commerce application to GitHub and Vercel.

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel account
- Supabase account
- Clerk account

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Physical Store e-commerce app"

# Add your GitHub repository as origin
git remote add origin https://github.com/yourusername/physical-store.git

# Push to GitHub
git push -u origin main
```

### 2. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`:

#### Required Environment Variables:

**Clerk Authentication:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Get from [Clerk Dashboard](https://dashboard.clerk.com)
- `CLERK_SECRET_KEY`: Get from [Clerk Dashboard](https://dashboard.clerk.com)

**Supabase Database:**
- `NEXT_PUBLIC_SUPABASE_URL`: Get from [Supabase Dashboard](https://supabase.com/dashboard)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Get from [Supabase Dashboard](https://supabase.com/dashboard)
- `SUPABASE_SERVICE_ROLE_KEY`: Get from [Supabase Dashboard](https://supabase.com/dashboard)

**App Configuration:**
- `NEXT_PUBLIC_APP_URL`: Your production URL (e.g., `https://your-app.vercel.app`)

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

#### Option B: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 4. Configure Environment Variables in Vercel

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add all the environment variables from your `.env.local` file
3. Make sure to set the correct values for production

#### Important Production Environment Variables:

```env
# Update these for production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://your-app.vercel.app/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://your-app.vercel.app/dashboard
```

### 5. Set Up Supabase Database

1. Create tables in your Supabase database:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR,
  category_id UUID,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. Set up Row Level Security (RLS) policies as needed

### 6. Configure Clerk for Production

1. In your Clerk dashboard, add your production domain
2. Update redirect URLs to use your production domain
3. Configure social login providers if needed

### 7. Test Your Deployment

1. Visit your deployed application
2. Test key functionality:
   - User authentication (sign up/sign in)
   - Product browsing
   - Cart functionality
   - Order placement
   - Admin dashboard (if implemented)

## 🔧 Troubleshooting

### Common Issues:

1. **Environment Variables Not Working**
   - Ensure all required environment variables are set in Vercel
   - Check that variable names match exactly (case-sensitive)
   - Redeploy after adding new environment variables

2. **Database Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check that your Supabase project is active
   - Ensure database tables are created

3. **Authentication Issues**
   - Verify Clerk keys are correct
   - Check that redirect URLs are properly configured
   - Ensure your domain is added in Clerk dashboard

4. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are listed in package.json
   - Fix any TypeScript errors

### Performance Optimization:

1. **Enable Vercel Analytics** (optional):
   ```bash
   npm install @vercel/analytics
   ```

2. **Enable Vercel Speed Insights** (optional):
   ```bash
   npm install @vercel/speed-insights
   ```

3. **Configure caching** in `next.config.ts` if needed

## 📊 Monitoring

After deployment, monitor your application:

1. **Vercel Dashboard**: Check deployment status, build logs, and analytics
2. **Supabase Dashboard**: Monitor database usage and performance
3. **Clerk Dashboard**: Track user authentication metrics

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch. To set up proper CI/CD:

1. Create feature branches for development
2. Use pull requests for code review
3. Deploy preview branches for testing
4. Merge to main for production deployment

## 📝 Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] User authentication works
- [ ] Database connections are working
- [ ] Environment variables are set
- [ ] SSL certificate is active
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking is working (if enabled)
- [ ] Error monitoring is set up
- [ ] Backup strategy is in place

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review Supabase logs
3. Check Clerk dashboard for auth issues
4. Consult the documentation for each service

---

**Congratulations! Your Physical Store e-commerce application is now live! 🎉**