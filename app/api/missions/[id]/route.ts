import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

// 🔹 GET -> récupérer une mission par ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { company: true }
    })

    if (!mission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 })
    }

    // Access control based on user role
    if (session.user.role === "ENTREPRISE") {
      // Enterprises can only see their own missions
      if (mission.companyId !== session.user.id) {
        return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
      }
    } else if (session.user.role === "FREELANCE") {
      // Freelances can only see published missions
      if (mission.status !== "PUBLISHED") {
        return NextResponse.json({ error: "Mission non disponible" }, { status: 403 })
      }
    }
    // Admin can see all missions

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Erreur GET mission:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// 🔹 PATCH -> modifier une mission
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params

    // Check if mission exists and user owns it
    const existingMission = await prisma.mission.findUnique({
      where: { id }
    })

    if (!existingMission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 })
    }

    if (existingMission.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const body = await req.json()

    const mission = await prisma.mission.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        projectContext: body.projectContext,
        location: body.location,
        duration: body.duration,
        startDate: body.startDate ? new Date(body.startDate).toISOString() : null,
        budget: body.budget,
        pricing: body.pricing,
        skills: body.skills, // ⚠️ si c'est un tableau JSON, ton champ Prisma doit être Json
        status: body.status,
        companyDescription: body.companyDescription,
        companyLogo: body.companyLogo,
      },
    })

    return NextResponse.json(mission)
  } catch (error) {
    console.error("Erreur PATCH mission:", error)
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 })
  }
}

// 🔹 DELETE -> supprimer une mission
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params

    // Check if mission exists and user owns it
    const existingMission = await prisma.mission.findUnique({
      where: { id }
    })

    if (!existingMission) {
      return NextResponse.json({ error: "Mission introuvable" }, { status: 404 })
    }

    if (existingMission.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    await prisma.mission.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Mission supprimée ✅" })
  } catch (error) {
    console.error("Erreur DELETE mission:", error)
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 })
  }
}
