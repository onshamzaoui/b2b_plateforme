import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: params.id },
      include: { company: true }
    })

    if (!mission) return new NextResponse("Mission non trouvée", { status: 404 })

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Erreur dans GET /api/missions/[id]:", error)
    return new NextResponse("Erreur serveur", { status: 500 })
  }
}
