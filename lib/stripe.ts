import Stripe from 'stripe'

// Initialize Stripe only when needed to avoid build-time errors
export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
  })
}

// For backward compatibility, create a lazy-initialized stripe instance
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const stripeInstance = getStripe()
    return stripeInstance[prop as keyof Stripe]
  }
})

// Pricing configuration
export const PRICING_PLANS = {
  freelancer: {
    free: {
      id: 'FREE',
      name: 'Gratuit',
      price: 0,
      applicationCredits: 3,
      features: [
        'Accès aux missions publiques',
        '3 candidatures par mois',
        'Profil de base',
        'Support par email',
        'Commission de 8% sur les missions',
      ],
    },
    pro: {
      id: 'PRO',
      name: 'Pro',
      price: 2900, // in cents
      stripePriceId: process.env.STRIPE_PRICE_FREELANCER_PRO,
      applicationCredits: -1, // unlimited
      features: [
        'Candidatures illimitées',
        'Accès aux missions premium',
        'Profil mis en avant',
        'Statistiques détaillées',
        'Support prioritaire',
        'Commission réduite de 5%',
        'Badge professionnel',
        'Notifications en temps réel',
      ],
    },
    expert: {
      id: 'EXPERT',
      name: 'Expert',
      price: 5900, // in cents
      stripePriceId: process.env.STRIPE_PRICE_FREELANCER_EXPERT,
      applicationCredits: -1, // unlimited
      features: [
        'Tout du plan Pro',
        'Profil premium avec portfolio',
        'Accès aux missions exclusives',
        'Commission de seulement 3%',
        'Manager de compte dédié',
        'Certification de compétences',
        'Accès prioritaire aux nouvelles missions',
        'Outils d\'analyse avancés',
      ],
    },
  },
  enterprise: {
    starter: {
      id: 'STARTER',
      name: 'Starter',
      price: 4900, // in cents
      stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE_STARTER,
      missionCredits: 3,
      features: [
        'Jusqu\'à 3 missions actives',
        'Accès à tous les freelances',
        'Gestion des candidatures',
        'Support par email',
        'Facturation intégrée',
        'Tableau de bord basique',
      ],
    },
    business: {
      id: 'BUSINESS',
      name: 'Business',
      price: 14900, // in cents
      stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE_BUSINESS,
      missionCredits: -1, // unlimited
      features: [
        'Missions illimitées',
        'Accès prioritaire aux freelances',
        'Outils de collaboration avancés',
        'Analytics et reporting',
        'Support prioritaire',
        'API d\'intégration',
        'Gestion d\'équipe',
        'Contrats personnalisés',
      ],
    },
    enterprise: {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 0, // Custom pricing
      stripePriceId: null,
      missionCredits: -1, // unlimited
      features: [
        'Tout du plan Business',
        'Solution sur mesure',
        'Intégration SSO',
        'Manager de compte dédié',
        'SLA garanti',
        'Formation personnalisée',
        'Sécurité renforcée',
        'Support 24/7',
      ],
    },
  },
} as const

export type PricingPlan = keyof typeof PRICING_PLANS.freelancer | keyof typeof PRICING_PLANS.enterprise

// Helper functions
export function getPlanById(planId: string) {
  // Check freelancer plans
  for (const plan in PRICING_PLANS.freelancer) {
    const planData = PRICING_PLANS.freelancer[plan as keyof typeof PRICING_PLANS.freelancer]
    if (planData.id === planId) {
      return planData
    }
  }
  
  // Check enterprise plans
  for (const plan in PRICING_PLANS.enterprise) {
    const planData = PRICING_PLANS.enterprise[plan as keyof typeof PRICING_PLANS.enterprise]
    if (planData.id === planId) {
      return planData
    }
  }
  
  return null
}

export function canUserApplyToMission(user: any): boolean {
  if (user.role !== 'FREELANCE') return false
  
  if (user.currentPlan === 'FREE') {
    return user.applicationCredits > 0
  }
  
  // Pro and Expert have unlimited applications
  return ['PRO', 'EXPERT'].includes(user.currentPlan)
}

export function canUserPostMission(user: any): boolean {
  if (user.role !== 'ENTREPRISE') return false
  
  if (user.currentPlan === 'STARTER') {
    return user.missionCredits > 0
  }
  
  // Business and Enterprise have unlimited missions
  return ['BUSINESS', 'ENTERPRISE'].includes(user.currentPlan)
}

export function getCommissionRate(planId: string): number {
  switch (planId) {
    case 'FREE':
      return 0.08 // 8%
    case 'PRO':
      return 0.05 // 5%
    case 'EXPERT':
      return 0.03 // 3%
    default:
      return 0.08 // Default to 8%
  }
}
