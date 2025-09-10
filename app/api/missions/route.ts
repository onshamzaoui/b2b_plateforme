import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 👉 GET: toutes les missions
export async function GET() {
  try {
    const missions = await prisma.mission.findMany({
      include: { company: true }, // si tu veux inclure les infos entreprise
    })
    return NextResponse.json(missions)
  } catch (error) {
    console.error("Erreur GET missions :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// 👉 POST: créer une mission
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const mission = await prisma.mission.create({
      data: {
        title: body.title,
        description: body.description,
        budget: body.budgetMax || 0, // ⚡ adapte si tu veux budgetMin/Max
        status: "PUBLISHED",
        companyId: "f047bf36-3dd4-4fa8-8c6d-febd8cdae28a", // ⚡ remplace par l'entreprise connectée
        // ajoute d’autres champs si tu les as dans le modèle
      },
    })

    return NextResponse.json(mission, { status: 201 })
  } catch (error) {
    console.error("Erreur POST mission :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
