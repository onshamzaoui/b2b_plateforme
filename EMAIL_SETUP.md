# Resend Email Setup for Password Reset

## Quick Setup with Resend (Recommended)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Get API Key
1. Go to [API Keys](https://resend.com/api-keys) in your Resend dashboard
2. Click "Create API Key"
3. Name it "B2B Platform Password Reset"
4. Copy the API key

### Step 3: Add to Environment Variables
Add these to your `.env.local` file:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=noreply@resend.dev
NEXTAUTH_URL=http://localhost:3000
```

**Note:** For testing, you can use `noreply@resend.dev` as the sender. For production, you'll want to add and verify your own domain.

### Step 4: Test the Setup
1. Start your development server: `npm run dev`
2. Go to `/auth/reset-password`
3. Enter a valid email address
4. Check your email for the reset link

## Production Setup

### Add Your Own Domain
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `yourdomain.com`)
3. Add the required DNS records
4. Update your `.env.local`:
   ```env
   RESEND_FROM=noreply@yourdomain.com
   ```

## Troubleshooting

- **"Invalid API key"**: Make sure your `RESEND_API_KEY` is correct
- **"Domain not verified"**: Use `noreply@resend.dev` for testing, or verify your domain
- **Rate limits**: Resend free tier allows 3,000 emails/month
- **Email not received**: Check spam folder, verify email address is correct

## Benefits of Resend

✅ **Reliable delivery** - Better than Gmail for transactional emails  
✅ **Easy setup** - No complex SMTP configuration  
✅ **Great developer experience** - Simple API  
✅ **Free tier** - 3,000 emails/month  
✅ **Email templates** - Built-in template support  
✅ **Analytics** - Track email delivery and opens
