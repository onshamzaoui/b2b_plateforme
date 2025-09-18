import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

// GET /api/dashboard/entreprise - Get all applications for enterprise's missions
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (session.user.role !== "ENTREPRISE") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Get all applications for missions created by this enterprise
    const applications = await prisma.application.findMany({
      where: {
        mission: {
          companyId: session.user.id
        }
      },
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
      },
      orderBy: { appliedAt: 'desc' }
    })

    return NextResponse.json(applications)

  } catch (error) {
    console.error("Erreur récupération candidatures entreprise:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
