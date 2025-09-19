import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        currentPlan: true,
        planExpiresAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    // Check if plan is expired
    if (user.planExpiresAt && new Date() > user.planExpiresAt) {
      // Reset to free plan
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          currentPlan: 'FREE',
          planExpiresAt: null,
          applicationCredits: user.currentPlan === 'FREE' ? 3 : 0,
          missionCredits: user.currentPlan === 'STARTER' ? 0 : 0
        }
      })
      
      return NextResponse.json({ 
        currentPlan: 'FREE',
        planExpiresAt: null,
        isExpired: true
      })
    }

    return NextResponse.json({
      currentPlan: user.currentPlan,
      planExpiresAt: user.planExpiresAt,
      isExpired: false
    })

  } catch (error) {
    console.error('Error fetching user plan:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du plan' },
      { status: 500 }
    )
  }
}
