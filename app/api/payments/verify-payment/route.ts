import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'
import { getPlanById } from '@/lib/stripe'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID requis' }, { status: 400 })
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    })

    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 400 })
    }

    // Get plan details
    const { planId } = session.metadata || {}
    const plan = getPlanById(planId || '')

    // Get subscription details if available
    let nextBillingDate = null
    if (session.subscription) {
      const subscription = session.subscription as any
      if (subscription.current_period_end) {
        nextBillingDate = new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR')
      }
    }

    return NextResponse.json({
      success: true,
      planName: plan?.name || 'Plan inconnu',
      amount: (session.amount_total || 0) / 100,
      nextBillingDate,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    )
  }
}
