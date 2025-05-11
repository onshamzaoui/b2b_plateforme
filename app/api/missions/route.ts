import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const missions = await prisma.mission.findMany({
      include: { company: true } // inclut les infos de l'entreprise liée
    })
    return NextResponse.json(missions)
  } catch (error) {
    console.error("Erreur lors de la récupération des missions:", error)
    return new NextResponse("Erreur serveur", { status: 500 })
  }
}
