import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; applicationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { applicationId } = await params

    // Check if the application exists and get the mission info
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        mission: {
          include: { company: true }
        }
      }
    })

    if (!application) {
      return NextResponse.json({ error: "Candidature non trouvée" }, { status: 404 })
    }

    // Check if the user is the company owner of the mission
    if (application.mission.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const body = await request.json()
    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: body.status },
    })

    // If application is accepted, create a contract
    if (body.status === "Accepté") {
      console.log("🔄 Application acceptée, création du contrat...")
      try {
        // Get application details for contract creation
        const applicationDetails = await prisma.application.findUnique({
          where: { id: applicationId },
          include: {
            mission: true,
            freelancer: true
          }
        })

        console.log("📋 Détails de l'application:", {
          applicationId,
          missionId: applicationDetails?.missionId,
          freelancerId: applicationDetails?.freelancerId,
          companyId: session.user.id,
          dailyRate: applicationDetails?.dailyRate
        })

        if (applicationDetails) {
          // Check if contract already exists
          const existingContract = await prisma.contract.findUnique({
            where: { applicationId: applicationId }
          })

          if (existingContract) {
            console.log("⚠️ Contrat existe déjà pour cette application")
          } else {
            // Create contract
            const contract = await prisma.contract.create({
              data: {
                applicationId: applicationId,
                missionId: applicationDetails.missionId,
                freelancerId: applicationDetails.freelancerId,
                companyId: session.user.id,
                title: `Contrat - ${applicationDetails.mission.title}`,
                description: `Contrat de prestation pour la mission "${applicationDetails.mission.title}"`,
                startDate: new Date(),
                dailyRate: applicationDetails.dailyRate || 0,
                terms: `Contrat de prestation de services freelance pour la mission "${applicationDetails.mission.title}".

Conditions générales :
- Taux journalier : ${applicationDetails.dailyRate || 0}€
- Mission : ${applicationDetails.mission.title}
- Description : ${applicationDetails.mission.description}

Le freelance s'engage à :
- Respecter les délais convenus
- Fournir un travail de qualité
- Maintenir la confidentialité des informations

L'entreprise s'engage à :
- Payer les honoraires selon les modalités convenues
- Fournir les informations nécessaires à la réalisation de la mission
- Respecter les conditions de travail

Ce contrat prend effet dès signature des deux parties.`,
                status: "PENDING_SIGNATURE"
              }
            })
            console.log("✅ Contrat créé avec succès:", contract.id)
          }
        } else {
          console.log("❌ ApplicationDetails non trouvée")
        }
      } catch (contractError) {
        console.error("❌ Erreur création contrat automatique:", contractError)
        // Don't fail the application update if contract creation fails
      }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Erreur PATCH application :", error)
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 })
  }
}
