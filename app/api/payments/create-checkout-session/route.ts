import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { stripe } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'
import { PRICING_PLANS, getPlanById } from '@/lib/stripe'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { planId, userType } = await request.json()

    if (!planId || !userType) {
      return NextResponse.json({ error: 'Plan et type d\'utilisateur requis' }, { status: 400 })
    }

    // Get the plan details
    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Plan introuvable' }, { status: 400 })
    }

    // Check if it's a free plan
    if (plan.price === 0) {
      return NextResponse.json({ error: 'Ce plan est gratuit' }, { status: 400 })
    }

    // Check if plan has Stripe price ID
    if (!plan.stripePriceId) {
      return NextResponse.json({ error: 'Configuration de paiement manquante pour ce plan' }, { status: 400 })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        currentPlan: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    // Validate user type matches plan
    if (userType === 'freelance' && user.role !== 'FREELANCE') {
      return NextResponse.json({ error: 'Type d\'utilisateur invalide' }, { status: 400 })
    }
    if (userType === 'entreprise' && user.role !== 'ENTREPRISE') {
      return NextResponse.json({ error: 'Type d\'utilisateur invalide' }, { status: 400 })
    }

    let customerId = user.stripeCustomerId

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
          userType: userType
        }
      })
      customerId = customer.id

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payments/cancel`,
      metadata: {
        userId: user.id,
        planId: planId,
        userType: userType
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: planId,
          userType: userType
        }
      }
    })

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id 
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}
