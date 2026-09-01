# FoodAdda Vercel Deployment Guide

## What Was Fixed

### 1. **src/lib/prisma.ts** ✅
**Issue**: Prisma connection was not being reused in production (Vercel runs with NODE_ENV=production)
**Fix**: Changed line:
```typescript
// Before:
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// After:
globalForPrisma.prisma = prisma; // Always reuse connection
```
**Why**: Vercel serverless functions need connection pooling to avoid exhausting connections.

### 2. **package.json** ✅
**Already Fixed**:
- `"build": "prisma generate && next build"` - Generates Prisma Client before build
- `"postinstall": "prisma generate"` - Generates Prisma Client after npm install

### 3. **next.config.mjs** ✅
**Added**: Vercel optimizations and experimental features to improve build performance

### 4. **.gitignore** ✅
**Updated**: Comprehensive ignore rules including .next/, node_modules, .env.production.local, .vercel, etc.

### 5. **.env.production** ✅
**Created**: Documentation for Vercel environment variables setup

## Required Vercel Setup

To deploy successfully on Vercel, you MUST set these environment variables in your Vercel project dashboard:

### Go to: Project Settings → Environment Variables

Add these variables:

```
DATABASE_URL = postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
AUTH_SECRET = [generate with: openssl rand -base64 32]
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
IMAGE_STORAGE_KEY = [your-image-storage-key]
```

**Important**: These must be set BEFORE deployment.

## Deployment Steps

1. **Push code to GitHub** (already done)
   ```bash
   git add .
   git commit -m "fix: Vercel deployment issues"
   git push origin main
   ```

2. **Connect Vercel to GitHub**
   - Go to https://vercel.com/new
   - Connect your GitHub account
   - Select repository: `naveedjumma61-dev/FoodAdda`

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings
   - Environment Variables section
   - Add all required variables listed above

4. **Deploy**
   - Click "Deploy" button
   - Vercel will automatically:
     - Run `npm install`
     - Run `prisma generate` (postinstall)
     - Run `npm run build` (which runs `prisma generate && next build`)
     - Deploy to production

## Troubleshooting

If you still get "Failed to collect page data for /api/auth/login":

1. **Check DATABASE_URL exists** in Vercel Environment Variables
2. **Verify database credentials** are correct
3. **Check database is accessible** from Vercel (firewall/IP whitelist)
4. **For Neon/Supabase**: Add `?sslmode=require` to connection string

## Files Changed

| File | Change | Purpose |
|------|--------|---------|
| `src/lib/prisma.ts` | Fixed connection reuse | Proper Prisma Client pooling in production |
| `package.json` | (already correct) | Build & postinstall scripts |
| `next.config.mjs` | Added Vercel optimizations | Performance & compatibility |
| `.gitignore` | Improved ignore rules | Clean deployments |
| `.env.production` | Created | Documentation for env vars |

## Next Steps

1. Set environment variables in Vercel dashboard
2. Push this code to GitHub
3. Connect Vercel to your GitHub repository
4. Vercel will automatically build and deploy
