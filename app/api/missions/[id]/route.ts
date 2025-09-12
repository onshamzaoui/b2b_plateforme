import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 🔹 GET -> récupérer une mission par ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: params.id },
    })

    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 })
    }

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Erreur GET mission:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// 🔹 PATCH -> modifier une mission
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()

    const mission = await prisma.mission.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        location: body.location,
        duration: body.duration,
        startDate: body.startDate ? new Date(body.startDate).toISOString() : null,
        budget: body.budget,
        skills: body.skills, // ⚠️ si c'est un tableau JSON, ton champ Prisma doit être Json
        status: body.status,
      },
    })

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Erreur PATCH mission:", error)
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 })
  }
}

// 🔹 DELETE -> supprimer une mission
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.mission.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Mission supprimée ✅" })
  } catch (error) {
    console.error("Erreur DELETE mission:", error)
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 })
  }
}
