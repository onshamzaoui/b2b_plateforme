import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"  // adapte bien le chemin si besoin
import { validateMissionPostingPayment, consumeMissionCredit } from "@/lib/payment-utils"

const prisma = new PrismaClient()

// GET -> liste les missions selon le rôle de l'utilisateur
export async function GET() {
  try {
    // 🔹 Vérifier la session utilisateur
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    let missions

    if (session.user.role === "ENTREPRISE") {
      // Les entreprises voient seulement leurs propres missions
      missions = await prisma.mission.findMany({
        where: { companyId: session.user.id },
        include: { company: true },
        orderBy: { createdAt: 'desc' }
      })
    } else if (session.user.role === "FREELANCE") {
      // Les freelances voient toutes les missions publiées
      missions = await prisma.mission.findMany({
        where: { status: "PUBLISHED" },
        include: { company: true },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // Admin ou autres rôles voient toutes les missions
      missions = await prisma.mission.findMany({
        include: { company: true },
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json(missions)
  } catch (error) {
    console.error("❌ Erreur API GET missions:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// GET -> liste toutes les missions
// export async function GET() {
//   try {
//     const missions = await prisma.mission.findMany({
//       include: { company: true }, // optionnel
//     })
//     return NextResponse.json(missions)
//   } catch (error) {
//     console.error("❌ Erreur API GET missions:", error)
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
//   }
// }

// POST -> crée une nouvelle mission
export async function POST(request: Request) {
  try {
    // 🔹 Vérifier la session utilisateur
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Vérifie que seul une entreprise peut publier
    if (session.user.role !== "ENTREPRISE") {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 })
    }

    // 🔹 Vérifier les droits de publication de mission
    const paymentValidation = await validateMissionPostingPayment(session.user.id)
    if (!paymentValidation.success) {
      return NextResponse.json({ 
        error: paymentValidation.error,
        code: "PAYMENT_REQUIRED"
      }, { status: 402 }) // 402 Payment Required
    }

    const body = await request.json()

    const mission = await prisma.mission.create({
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        projectContext: body.projectContext,
        location: body.location,
        duration: body.duration,
        startDate: body.startDate ? new Date(body.startDate).toISOString() : null,
        budget: body.budget ?? 0,
        pricing: body.pricing,
        skills: body.skills || [],
        status: "PUBLISHED",
        companyId: session.user.id, // ✅ on prend l'id de l'utilisateur connecté
        companyDescription: body.companyDescription,
        companyLogo: body.companyLogo,
      },
    })

    // 🔹 Consommer un crédit de mission après création réussie
    await consumeMissionCredit(session.user.id)

    return NextResponse.json(mission, { status: 201 })
  } catch (error) {
    console.error("❌ Erreur API POST mission:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
