import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ✅ GET mission par ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { company: true },
    })

    if (!mission) {
      return NextResponse.json({ error: "Mission non trouvée" }, { status: 404 })
    }

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Erreur GET mission :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// ✅ PUT (modifier une mission)
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const mission = await prisma.mission.update({
      where: { id },
      data: body, // ⚠️ tu peux filtrer les champs si tu veux
    })

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Erreur PUT mission :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// ✅ DELETE mission
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.mission.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Mission supprimée avec succès" })
  } catch (error) {
    console.error("Erreur DELETE mission :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
