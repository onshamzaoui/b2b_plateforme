import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Récupérer tous les CVs de l'utilisateur
    const cvs = await prisma.cV.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(cvs)
  } catch (error) {
    console.error("Erreur récupération CVs:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 })
    }

    // Vérifier le type de fichier
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non supporté. Seuls les fichiers PDF et Word sont acceptés." }, { status: 400 })
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Le fichier est trop volumineux. Taille maximale: 5MB" }, { status: 400 })
    }

    // Créer le dossier de stockage s'il n'existe pas
    const uploadDir = join(process.cwd(), "public", "uploads", "cvs")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${session.user.id}_${timestamp}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Sauvegarder les informations en base de données
    const cv = await prisma.cV.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        path: `/uploads/cvs/${fileName}`
      }
    })

    return NextResponse.json(cv)
  } catch (error) {
    console.error("Erreur upload CV:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cvId = searchParams.get("id")

    if (!cvId) {
      return NextResponse.json({ error: "ID du CV requis" }, { status: 400 })
    }

    // Vérifier que le CV appartient à l'utilisateur
    const cv = await prisma.cV.findFirst({
      where: { 
        id: cvId,
        userId: session.user.id 
      }
    })

    if (!cv) {
      return NextResponse.json({ error: "CV non trouvé" }, { status: 404 })
    }

    // Supprimer le fichier du système de fichiers
    const filePath = join(process.cwd(), "public", cv.path)
    if (existsSync(filePath)) {
      const { unlink } = await import("fs/promises")
      await unlink(filePath)
    }

    // Supprimer de la base de données
    await prisma.cV.delete({
      where: { id: cvId }
    })

    return NextResponse.json({ message: "CV supprimé avec succès" })
  } catch (error) {
    console.error("Erreur suppression CV:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
