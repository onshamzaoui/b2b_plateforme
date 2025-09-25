import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'
import Stripe from 'stripe'

const prisma = new PrismaClient()

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('Received webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'invoice_payment.paid':
        // This is a newer Stripe event that also indicates successful payment
        await handleInvoicePaymentPaid(event.data.object as Stripe.InvoicePayment)
        break

      case 'payment_method.attached':
        // Payment method attached to customer - no action needed
        console.log('Payment method attached to customer')
        break

      case 'payment_intent.succeeded':
        // Payment intent succeeded - handled by other events
        console.log('Payment intent succeeded')
        break

      case 'charge.succeeded':
        // Charge succeeded - handled by other events
        console.log('Charge succeeded')
        break

      case 'payment_intent.created':
        // Payment intent created - no action needed
        console.log('Payment intent created')
        break

      case 'invoice.created':
        // Invoice created - no action needed
        console.log('Invoice created')
        break

      case 'invoice.finalized':
        // Invoice finalized - no action needed
        console.log('Invoice finalized')
        break

      case 'invoice.paid':
        // Invoice paid - handled by invoice.payment_succeeded
        console.log('Invoice paid')
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session completed:', session.id)

  const { userId, planId, userType } = session.metadata || {}
  
  if (!userId || !planId || !userType) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  try {
    // Create payment record
    const paymentData: any = {
      userId,
      amount: (session.amount_total || 0) / 100, // Convert from cents
      currency: session.currency || 'eur',
      status: 'COMPLETED',
      type: 'SUBSCRIPTION',
      description: `Abonnement ${planId}`,
      metadata: {
        sessionId: session.id,
        planId,
        userType
      }
    }

    // Add stripePaymentId if it exists, otherwise use session ID
    if (session.payment_intent) {
      paymentData.stripePaymentId = session.payment_intent as string
    } else {
      // Use session ID as fallback identifier
      paymentData.stripePaymentId = session.id
    }

    const payment = await prisma.payment.create({
      data: paymentData
    })

    // Update user plan
    const planExpiresAt = new Date()
    planExpiresAt.setMonth(planExpiresAt.getMonth() + 1) // 1 month from now

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentPlan: planId as any,
        planExpiresAt,
        // Set appropriate credits based on plan
        ...(userType === 'freelance' && planId !== 'FREE' && {
          applicationCredits: -1 // unlimited
        }),
        ...(userType === 'entreprise' && planId === 'STARTER' && {
          missionCredits: 3
        }),
        ...(userType === 'entreprise' && ['BUSINESS', 'ENTERPRISE'].includes(planId) && {
          missionCredits: -1 // unlimited
        })
      }
    })

    console.log(`Successfully updated user ${userId} to plan ${planId}`)
  } catch (error) {
    console.error('Error processing checkout session:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing subscription created:', subscription.id)

  const { userId, planId, userType } = subscription.metadata || {}
  
  if (!userId || !planId) {
    console.error('Missing metadata in subscription:', subscription.id)
    return
  }

  try {
    // Check if subscription already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    if (existingSubscription) {
      // Update existing subscription
      await prisma.subscription.update({
        where: { userId },
        data: {
          stripeSubscriptionId: subscription.id,
          pricingTier: planId as any,
          status: 'ACTIVE',
          startDate: new Date((subscription as any).current_period_start * 1000),
          endDate: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      })
      console.log(`Successfully updated subscription for user ${userId}`)
    } else {
      // Create new subscription record
      await prisma.subscription.create({
        data: {
          userId,
          stripeSubscriptionId: subscription.id,
          pricingTier: planId as any,
          status: 'ACTIVE',
          startDate: new Date((subscription as any).current_period_start * 1000),
          endDate: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      })
      console.log(`Successfully created subscription for user ${userId}`)
    }
  } catch (error) {
    console.error('Error creating/updating subscription:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription updated:', subscription.id)

  try {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELLED',
        endDate: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    })

    // If subscription is cancelled, update user plan
    if (subscription.status === 'canceled') {
      const subscriptionRecord = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
        include: { user: true }
      })

      if (subscriptionRecord) {
        const { userType } = subscription.metadata || {}
        const defaultPlan = userType === 'freelance' ? 'FREE' : 'STARTER'
        const defaultCredits = userType === 'freelance' ? 3 : 0

        await prisma.user.update({
          where: { id: subscriptionRecord.userId },
          data: {
            currentPlan: defaultPlan as any,
            planExpiresAt: null,
            ...(userType === 'freelance' && { applicationCredits: defaultCredits }),
            ...(userType === 'entreprise' && { missionCredits: defaultCredits })
          }
        })
      }
    }

    console.log(`Successfully updated subscription ${subscription.id}`)
  } catch (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deleted:', subscription.id)

  try {
    const subscriptionRecord = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
      include: { user: true }
    })

    if (subscriptionRecord) {
      const { userType } = subscription.metadata || {}
      const defaultPlan = userType === 'freelance' ? 'FREE' : 'STARTER'
      const defaultCredits = userType === 'freelance' ? 3 : 0

      // Update subscription status
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: 'CANCELLED' }
      })

      // Reset user to default plan
      await prisma.user.update({
        where: { id: subscriptionRecord.userId },
        data: {
          currentPlan: defaultPlan as any,
          planExpiresAt: null,
          ...(userType === 'freelance' && { applicationCredits: defaultCredits }),
          ...(userType === 'entreprise' && { missionCredits: defaultCredits })
        }
      })
    }

    console.log(`Successfully processed subscription deletion ${subscription.id}`)
  } catch (error) {
    console.error('Error processing subscription deletion:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment succeeded:', invoice.id)

  if ((invoice as any).subscription) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: (invoice as any).subscription as string },
        include: { user: true }
      })

      if (subscription) {
        // Extend user plan
        const newExpiryDate = new Date()
        newExpiryDate.setMonth(newExpiryDate.getMonth() + 1)

        await prisma.user.update({
          where: { id: subscription.userId },
          data: { planExpiresAt: newExpiryDate }
        })

        console.log(`Successfully extended plan for user ${subscription.userId}`)
      }
    } catch (error) {
      console.error('Error processing invoice payment:', error)
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment failed:', invoice.id)

  if ((invoice as any).subscription) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: (invoice as any).subscription as string },
        include: { user: true }
      })

      if (subscription) {
        // Update subscription status
        await prisma.subscription.update({
          where: { stripeSubscriptionId: (invoice as any).subscription as string },
          data: { status: 'EXPIRED' }
        })

        // Reset user to default plan
        const userType = subscription.user.role
        const defaultPlan = userType === 'FREELANCE' ? 'FREE' : 'STARTER'
        const defaultCredits = userType === 'FREELANCE' ? 3 : 0

        await prisma.user.update({
          where: { id: subscription.userId },
          data: {
            currentPlan: defaultPlan as any,
            planExpiresAt: null,
            ...(userType === 'FREELANCE' && { applicationCredits: defaultCredits }),
            ...(userType === 'ENTREPRISE' && { missionCredits: defaultCredits })
          }
        })

        console.log(`Successfully reset user ${subscription.userId} due to payment failure`)
      }
    } catch (error) {
      console.error('Error processing invoice payment failure:', error)
    }
  }
}

async function handleInvoicePaymentPaid(invoicePayment: Stripe.InvoicePayment) {
  console.log('Processing invoice payment paid:', invoicePayment.id)

  // For invoice_payment.paid events, we need to get the invoice to find the subscription
  if (invoicePayment.invoice) {
    try {
      // Retrieve the full invoice from Stripe
      const invoice = await stripe.invoices.retrieve(invoicePayment.invoice as string)
      
      if ((invoice as any).subscription) {
        const subscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: (invoice as any).subscription as string },
          include: { user: true }
        })

        if (subscription) {
          // Extend user plan
          const newExpiryDate = new Date()
          newExpiryDate.setMonth(newExpiryDate.getMonth() + 1)

          await prisma.user.update({
            where: { id: subscription.userId },
            data: { planExpiresAt: newExpiryDate }
          })

          console.log(`Successfully extended plan for user ${subscription.userId} via invoice payment`)
        }
      }
    } catch (error) {
      console.error('Error processing invoice payment paid:', error)
    }
  }
}
