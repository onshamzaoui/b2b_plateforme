import { PrismaClient } from '@prisma/client'
import { canUserApplyToMission, canUserPostMission } from './stripe'

const prisma = new PrismaClient()

export async function validateApplicationPayment(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        currentPlan: true,
        applicationCredits: true,
        planExpiresAt: true,
      }
    })

    if (!user) {
      return { success: false, error: 'Utilisateur introuvable' }
    }

    if (user.role !== 'FREELANCE') {
      return { success: false, error: 'Seuls les freelances peuvent postuler aux missions' }
    }

    // Check if plan is expired
    if (user.planExpiresAt && new Date() > user.planExpiresAt) {
      // Reset to free plan
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentPlan: 'FREE',
          planExpiresAt: null,
          applicationCredits: 3
        }
      })
      
      return validateApplicationPayment(userId) // Recursive call with updated data
    }

    if (!canUserApplyToMission(user)) {
      if (user.currentPlan === 'FREE' && user.applicationCredits <= 0) {
        return { 
          success: false, 
          error: 'Vous avez épuisé vos candidatures gratuites. Passez à un plan payant ou achetez des crédits supplémentaires.' 
        }
      }
      return { success: false, error: 'Vous n\'avez pas accès à cette fonctionnalité avec votre plan actuel' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error validating application payment:', error)
    return { success: false, error: 'Erreur lors de la validation du paiement' }
  }
}

export async function validateMissionPostingPayment(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        currentPlan: true,
        missionCredits: true,
        planExpiresAt: true,
      }
    })

    if (!user) {
      return { success: false, error: 'Utilisateur introuvable' }
    }

    if (user.role !== 'ENTREPRISE') {
      return { success: false, error: 'Seules les entreprises peuvent publier des missions' }
    }

    // Check if plan is expired
    if (user.planExpiresAt && new Date() > user.planExpiresAt) {
      // Reset to starter plan but with 0 credits
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentPlan: 'STARTER',
          planExpiresAt: null,
          missionCredits: 0
        }
      })
      
      return validateMissionPostingPayment(userId) // Recursive call with updated data
    }

    if (!canUserPostMission(user)) {
      if (user.currentPlan === 'STARTER' && user.missionCredits <= 0) {
        return { 
          success: false, 
          error: 'Vous avez épuisé vos crédits de publication. Passez à un plan supérieur ou achetez des crédits supplémentaires.' 
        }
      }
      return { success: false, error: 'Vous n\'avez pas accès à cette fonctionnalité avec votre plan actuel' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error validating mission posting payment:', error)
    return { success: false, error: 'Erreur lors de la validation du paiement' }
  }
}

export async function consumeApplicationCredit(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentPlan: true, applicationCredits: true }
  })

  if (user?.currentPlan === 'FREE' && user.applicationCredits > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        applicationCredits: {
          decrement: 1
        }
      }
    })
  }
}

export async function consumeMissionCredit(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentPlan: true, missionCredits: true }
  })

  if (user?.currentPlan === 'STARTER' && user.missionCredits > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        missionCredits: {
          decrement: 1
        }
      }
    })
  }
}
