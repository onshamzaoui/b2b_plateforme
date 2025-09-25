# Payment System Setup Guide

This guide will help you set up the Stripe payment system for your B2B platform.

## Prerequisites

1. A Stripe account (create one at https://stripe.com)
2. Your Next.js application running
3. Database configured with Prisma

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..." # Your Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET="whsec_..." # Webhook endpoint secret (see below)

# Stripe Price IDs (create these in your Stripe dashboard)
STRIPE_PRICE_FREELANCER_PRO="price_..."
STRIPE_PRICE_FREELANCER_EXPERT="price_..."
STRIPE_PRICE_ENTERPRISE_STARTER="price_..."
STRIPE_PRICE_ENTERPRISE_BUSINESS="price_..."
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

In your Stripe dashboard, create the following products and prices:

#### Freelancer Plans
- **Freelancer Pro**: €29/month
- **Freelancer Expert**: €59/month

#### Enterprise Plans
- **Enterprise Starter**: €49/month
- **Enterprise Business**: €149/month

### 2. Set Up Webhook Endpoint

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/payments/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to your environment variables

## Database Migration

Run the database migration to create the payment tables:

```bash
npx prisma migrate deploy
```

## Testing the Payment Flow

### 1. Test Mode
- Use Stripe test mode for development
- Use test card numbers: `4242 4242 4242 4242`
- Any future expiry date and any 3-digit CVC

### 2. Payment Flow
1. User visits `/tarifs` page
2. User selects a paid plan
3. User is redirected to Stripe Checkout
4. After successful payment, user is redirected to `/payments/success`
5. Webhook updates user's plan in database

### 3. Webhook Testing
- Use Stripe CLI for local webhook testing: `stripe listen --forward-to localhost:3000/api/payments/webhook`
- Or use ngrok to expose your local server

## Features Implemented

✅ **Stripe Checkout Integration**
- Secure payment processing
- Subscription management
- Automatic plan upgrades

✅ **Webhook Handling**
- Real-time payment status updates
- Subscription lifecycle management
- Automatic plan expiration handling

✅ **User Experience**
- Loading states during payment
- Success/cancel pages
- Error handling

✅ **Database Integration**
- Payment records
- Subscription tracking
- User plan management

## Security Notes

- All payment processing is handled by Stripe
- Webhook signatures are verified
- User authentication is required for payments
- Sensitive data is not stored locally

## Support

For issues with the payment system:
1. Check Stripe dashboard for payment status
2. Verify webhook endpoint is receiving events
3. Check application logs for errors
4. Ensure all environment variables are set correctly
