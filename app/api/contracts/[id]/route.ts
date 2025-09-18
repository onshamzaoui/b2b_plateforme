import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

// GET /api/contracts/[id] - Get a specific contract
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

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            location: true,
            phone: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            companyLogo: true,
            location: true,
            phone: true
          }
        },
        mission: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true
          }
        },
        application: {
          select: {
            id: true,
            motivation: true,
            experience: true,
            skills: true
          }
        }
      }
    })

    if (!contract) {
      return NextResponse.json({ error: "Contrat non trouvé" }, { status: 404 })
    }

    // Check if user has access to this contract
    if (contract.freelancerId !== session.user.id && contract.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    return NextResponse.json(contract)

  } catch (error) {
    console.error("Erreur récupération contrat:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH /api/contracts/[id] - Update contract (sign, update status, etc.)
export async function PATCH(
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

    // Get the contract
    const contract = await prisma.contract.findUnique({
      where: { id }
    })

    if (!contract) {
      return NextResponse.json({ error: "Contrat non trouvé" }, { status: 404 })
    }

    // Check if user has access to this contract
    if (contract.freelancerId !== session.user.id && contract.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    let updateData: any = {}

    // Handle signing
    if (body.action === "sign") {
      if (session.user.id === contract.freelancerId) {
        updateData.signedByFreelancer = true
      } else if (session.user.id === contract.companyId) {
        updateData.signedByCompany = true
      }

      // Check if both parties have signed
      const newFreelancerSigned = session.user.id === contract.freelancerId ? true : contract.signedByFreelancer
      const newCompanySigned = session.user.id === contract.companyId ? true : contract.signedByCompany

      if (newFreelancerSigned && newCompanySigned) {
        updateData.status = "ACTIVE"
        updateData.signedAt = new Date()
      } else {
        updateData.status = "PENDING_SIGNATURE"
      }
    }

    // Handle status updates (only by company)
    if (body.status && session.user.id === contract.companyId) {
      updateData.status = body.status
    }

    // Handle other updates
    if (body.title) updateData.title = body.title
    if (body.description) updateData.description = body.description
    if (body.terms) updateData.terms = body.terms
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate) updateData.endDate = new Date(body.endDate)
    if (body.dailyRate) updateData.dailyRate = parseInt(body.dailyRate)
    if (body.totalAmount) updateData.totalAmount = parseFloat(body.totalAmount)

    const updatedContract = await prisma.contract.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedContract)

  } catch (error) {
    console.error("Erreur mise à jour contrat:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
