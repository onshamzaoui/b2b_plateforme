import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    if (session.user.role !== "ENTREPRISE") {
      return NextResponse.json({ error: "Accès réservé aux entreprises" }, { status: 403 })
    }

    const body = await request.json()

    const mission = await prisma.mission.create({
      data: {
        title: body.title,
        description: body.description,
        budget: body.budget,
        status: "PUBLISHED",
        companyId: session.user.id, // 🔥 utilise l'id de l'entreprise connectée
      },
    })

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Erreur POST mission :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
