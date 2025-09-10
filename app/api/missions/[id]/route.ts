import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params  // ✅ await required in Next.js 15

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { company: true }
    })

    if (!mission) {
      return NextResponse.json({ error: "CHARGEMENT..." }, { status: 404 })
    }

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Erreur API mission :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
