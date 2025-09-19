import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { validateApplicationPayment, consumeApplicationCredit } from "@/lib/payment-utils"

const prisma = new PrismaClient()

// POST /api/missions/[missionId]/applications - Create new application
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      dailyRate,
      availability,
      motivation,
      experience,
      portfolio,
      skills,
      questions,
      selectedCvId
    } = body

    // Validate required fields
    if (!dailyRate || !motivation || !experience) {
      return NextResponse.json({ 
        error: "Champs requis manquants: dailyRate, motivation, experience" 
      }, { status: 400 })
    }

    // Check if mission exists
    const mission = await prisma.mission.findUnique({
      where: { id }
    })

    if (!mission) {
      return NextResponse.json({ error: "Mission non trouvée" }, { status: 404 })
    }

    // Check if user already applied to this mission
    const existingApplication = await prisma.application.findFirst({
      where: {
        missionId: id,
        freelancerId: session.user.id
      }
    })

    if (existingApplication) {
      return NextResponse.json({ 
        error: "Vous avez déjà postulé à cette mission" 
      }, { status: 400 })
    }

    // 🔹 Vérifier les droits de candidature
    const paymentValidation = await validateApplicationPayment(session.user.id)
    if (!paymentValidation.success) {
      return NextResponse.json({ 
        error: paymentValidation.error,
        code: "PAYMENT_REQUIRED"
      }, { status: 402 }) // 402 Payment Required
    }

    // Calculate match score based on skills overlap
    const missionSkills = mission.skills || []
    const userSkills = skills || []
    const commonSkills = missionSkills.filter(skill => 
      userSkills.some((userSkill: string) => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    )
    const matchScore = missionSkills.length > 0 
      ? Math.round((commonSkills.length / missionSkills.length) * 100)
      : 0

    // Create the application
    const application = await prisma.application.create({
      data: {
        missionId: id,
        freelancerId: session.user.id,
        dailyRate: parseInt(dailyRate),
        availability: availability || null,
        motivation: motivation,
        experience: experience,
        portfolio: portfolio || [],
        skills: skills || [],
        matchScore: matchScore,
        status: "Nouveau"
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            skills: true,
            dailyRate: true,
            experience: true
          }
        },
        mission: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true,
                companyName: true
              }
            }
          }
        }
      }
    })

    // 🔹 Consommer un crédit de candidature après création réussie
    await consumeApplicationCredit(session.user.id)

    return NextResponse.json({
      message: "Candidature envoyée avec succès",
      application
    }, { status: 201 })

  } catch (error) {
    console.error("Erreur création candidature:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// GET /api/missions/[missionId]/applications - Get applications for a mission
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params

    // Check if mission exists and user is the company owner
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { company: true }
    })

    if (!mission) {
      return NextResponse.json({ error: "Mission non trouvée" }, { status: 404 })
    }

    if (mission.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Get all applications for this mission
    const applications = await prisma.application.findMany({
      where: { missionId: id },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            skills: true,
            dailyRate: true,
            experience: true,
            location: true,
            linkedin: true,
            github: true,
            profileImage: true,
            profession: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    })

    return NextResponse.json(applications)

  } catch (error) {
    console.error("Erreur récupération candidatures:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH /api/missions/[missionId]/applications/[applicationId]
export async function PATCH(
  request: Request,
  { params }: { params: { missionId: string; applicationId: string } }
) {
  try {
    const body = await request.json()

    const updated = await prisma.application.update({
      where: { id: params.applicationId },
      data: { status: body.status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Erreur PATCH application:", error)
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 })
  }
}
