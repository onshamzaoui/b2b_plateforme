import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"  // adapte bien le chemin si besoin

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Si c'est une entreprise → afficher seulement SES missions
    if (session && session.user.role === "ENTREPRISE") {
      const missions = await prisma.mission.findMany({
        where: { companyId: session.user.id },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(missions)
    }

    // Si c'est un freelance → afficher seulement les missions publiées
    const missions = await prisma.mission.findMany({
      where: { status: "PUBLISHED" },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    })

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
