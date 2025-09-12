import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; applicationId: string } }
) {
  try {
    const body = await request.json()
    const updated = await prisma.application.update({
      where: { id: params.applicationId },
      data: { status: body.status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Erreur PATCH application :", error)
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 })
  }
}
