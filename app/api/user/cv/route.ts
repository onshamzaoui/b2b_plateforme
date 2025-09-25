import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { put, del as deleteFromBlob } from "@vercel/blob"

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

    // Préparer les données du fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const baseFileName = `${session.user.id}_${timestamp}.${fileExtension}`

    const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production"

    let storedPathOrUrl: string

    if (isProd) {
      // Stockage dans Vercel Blob en production (public)
      const { url } = await put(`cvs/${baseFileName}`,
        buffer,
        {
          access: "public",
          contentType: file.type,
          addRandomSuffix: false
        }
      )
      storedPathOrUrl = url
    } else {
      // Stockage local en développement
      const uploadDir = join(process.cwd(), "public", "uploads", "cvs")
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
      const filePath = join(uploadDir, baseFileName)
      await writeFile(filePath, buffer)
      storedPathOrUrl = `/uploads/cvs/${baseFileName}`
    }

    // Sauvegarder les informations en base de données
    const cv = await prisma.cV.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        path: storedPathOrUrl
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

    // Supprimer le fichier du stockage
    try {
      if (cv.path.startsWith("http")) {
        // Suppression depuis Vercel Blob (production)
        await deleteFromBlob(cv.path)
      } else {
        // Suppression locale (développement)
        const filePath = join(process.cwd(), "public", cv.path)
        if (existsSync(filePath)) {
          const { unlink } = await import("fs/promises")
          await unlink(filePath)
        }
      }
    } catch (e) {
      // On log mais on ne bloque pas la suppression DB si le fichier n'existe plus
      console.error("Erreur suppression fichier CV:", e)
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
