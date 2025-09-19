# Use the official Node.js 18 image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
# Set dummy environment variables for build time to prevent errors
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_SECRET=dummy_secret_for_build
ENV RESEND_API_KEY=dummy_key_for_build
ENV RESEND_FROM=noreply@example.com
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_dummy_key_for_build
ENV STRIPE_SECRET_KEY=sk_test_dummy_key_for_build
ENV STRIPE_WEBHOOK_SECRET=dummy_webhook_secret_for_build
ENV STRIPE_PRICE_FREELANCER_PRO=dummy_price_for_build
ENV STRIPE_PRICE_FREELANCER_EXPERT=dummy_price_for_build
ENV STRIPE_PRICE_ENTERPRISE_STARTER=dummy_price_for_build
ENV STRIPE_PRICE_ENTERPRISE_BUSINESS=dummy_price_for_build
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_ABLY_API_KEY=dummy_key_for_build
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files for migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Fix ownership of Prisma files
RUN chown -R nextjs:nodejs ./prisma ./node_modules/.prisma ./node_modules/@prisma

# Copy startup script
COPY --chown=nextjs:nodejs start.sh ./
RUN chmod +x start.sh

# Install Prisma CLI globally to avoid permission issues
RUN npm install -g prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# Use startup script that runs migrations before starting the app
CMD ["./start.sh"]