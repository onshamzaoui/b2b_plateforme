import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un freelance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || user.role !== "FREELANCE") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Récupérer les missions disponibles (missions publiées)
    const availableMissions = await prisma.mission.findMany({
      where: {
        status: "PUBLISHED"
      },
      include: {
        company: {
          select: {
            name: true,
            companyName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Récupérer les candidatures de l'utilisateur
    const applications = await prisma.application.findMany({
      where: {
        freelancerId: session.user.id
      },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            duration: true,
            pricing: true,
            budget: true,
            company: {
              select: {
                name: true,
                companyName: true
              }
            }
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    })

    // Récupérer les factures de l'utilisateur
    const invoices = await prisma.invoice.findMany({
      where: {
        freelancerId: session.user.id
      },
      orderBy: {
        issuedAt: 'desc'
      }
    })

    return NextResponse.json({
      availableMissionsCount: availableMissions.length - applications.length,
      applicationsCount: applications.length,
      invoicesCount: invoices.length,
      availableMissions,
      applications,
      invoices
    })
  } catch (error) {
    console.error("Erreur récupération dashboard freelance:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
