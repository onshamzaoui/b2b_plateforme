import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

// GET /api/contracts - Get contracts for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    let contracts

    if (session.user.role === "ENTREPRISE") {
      // Companies see contracts for their missions
      contracts = await prisma.contract.findMany({
        where: { companyId: session.user.id },
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true
            }
          },
          mission: {
            select: {
              id: true,
              title: true
            }
          },
          application: {
            select: {
              id: true,
              motivation: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else if (session.user.role === "FREELANCE") {
      // Freelances see their own contracts
      contracts = await prisma.contract.findMany({
        where: { freelancerId: session.user.id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              companyName: true,
              email: true,
              companyLogo: true
            }
          },
          mission: {
            select: {
              id: true,
              title: true
            }
          },
          application: {
            select: {
              id: true,
              motivation: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    return NextResponse.json(contracts)

  } catch (error) {
    console.error("Erreur récupération contrats:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/contracts - Create a new contract
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (session.user.role !== "ENTREPRISE") {
      return NextResponse.json({ error: "Seules les entreprises peuvent créer des contrats" }, { status: 403 })
    }

    const body = await request.json()
    const {
      applicationId,
      title,
      description,
      startDate,
      endDate,
      dailyRate,
      totalAmount,
      terms
    } = body

    // Validate required fields
    if (!applicationId || !title || !description || !startDate || !dailyRate) {
      return NextResponse.json({ 
        error: "Champs requis manquants: applicationId, title, description, startDate, dailyRate" 
      }, { status: 400 })
    }

    // Get application details
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        mission: true,
        freelancer: true
      }
    })

    if (!application) {
      return NextResponse.json({ error: "Candidature non trouvée" }, { status: 404 })
    }

    // Check if user owns the mission
    if (application.mission.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Check if application is accepted
    if (application.status !== "Accepté") {
      return NextResponse.json({ error: "Seules les candidatures acceptées peuvent avoir un contrat" }, { status: 400 })
    }

    // Check if contract already exists
    const existingContract = await prisma.contract.findUnique({
      where: { applicationId }
    })

    if (existingContract) {
      return NextResponse.json({ error: "Un contrat existe déjà pour cette candidature" }, { status: 400 })
    }

    // Create the contract
    const contract = await prisma.contract.create({
      data: {
        applicationId,
        missionId: application.missionId,
        freelancerId: application.freelancerId,
        companyId: session.user.id,
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        dailyRate: parseInt(dailyRate),
        totalAmount: totalAmount ? parseFloat(totalAmount) : null,
        terms: terms || "Contrat de prestation de services freelance.",
        status: "PENDING_SIGNATURE"
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            companyLogo: true
          }
        },
        mission: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(contract, { status: 201 })

  } catch (error) {
    console.error("Erreur création contrat:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
