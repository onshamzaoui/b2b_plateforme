import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"  // adapte bien le chemin si besoin

const prisma = new PrismaClient()

// GET -> liste toutes les missions
export async function GET() {
  try {
    const missions = await prisma.mission.findMany({
      include: { company: true }, // optionnel
    })
    return NextResponse.json(missions)
  } catch (error) {
    console.error("❌ Erreur API GET missions:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

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

    const body = await request.json()

    const mission = await prisma.mission.create({
      data: {
        title: body.title,
        description: body.description,
        budget: body.budgetMax ?? 0,
        status: "PUBLISHED",
        companyId: session.user.id, // ✅ on prend l’id de l’utilisateur connecté
      },
    })

    return NextResponse.json(mission, { status: 201 })
  } catch (error) {
    console.error("❌ Erreur API POST mission:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
