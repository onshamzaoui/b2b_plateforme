import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { stripe } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Get user's subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        stripeSubscriptionId: true,
        status: true
      }
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Aucun abonnement trouvé' }, { status: 404 })
    }

    if (subscription.status === 'CANCELLED') {
      return NextResponse.json({ error: 'L\'abonnement est déjà annulé' }, { status: 400 })
    }

    if (!subscription.stripeSubscriptionId) {
      return NextResponse.json({ error: 'ID d\'abonnement Stripe manquant' }, { status: 400 })
    }

    // Cancel the subscription in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    })

    // Update subscription status in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Abonnement annulé avec succès. Il restera actif jusqu\'à la fin de la période payée.'
    })

  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation de l\'abonnement' },
      { status: 500 }
    )
  }
}
