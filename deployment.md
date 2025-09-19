# Deployment Configuration

## Environment Variables Required

### Database
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/b2b_plateforme"
```

### NextAuth
```bash
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret-key"
```

### Stripe
```bash
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Ably (Real-time messaging)
```bash
NEXT_PUBLIC_ABLY_API_KEY="your-production-ably-api-key"
```

### Email Configuration
```bash
EMAIL_SERVER_HOST="smtp.yourdomain.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="noreply@yourdomain.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### Production
```bash
NODE_ENV="production"
```

## GitHub Secrets Setup

Add these secrets to your GitHub repository:

1. Go to your repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following repository secrets:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_ABLY_API_KEY`
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`

## Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Railway
1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Configure build settings for Next.js

## Database Setup

### Production Database
1. Set up a PostgreSQL database (recommended providers):
   - Supabase
   - PlanetScale
   - Railway
   - AWS RDS

2. Run migrations:
```bash
npx prisma migrate deploy
```

3. Generate Prisma client:
```bash
npx prisma generate
```

## Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics** - Built-in analytics for Vercel deployments
- **Sentry** - Error tracking and performance monitoring
- **LogRocket** - Session replay and error tracking
- **Uptime Robot** - Uptime monitoring

### Health Checks
The CI/CD pipeline includes health checks that verify:
- Application builds successfully
- Database migrations run without errors
- All tests pass
- Security scans complete
