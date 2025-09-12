import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validation des champs requis
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ 
        error: "Tous les champs sont requis" 
      }, { status: 400 })
    }

    // Vérification que les nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ 
        error: "Les nouveaux mots de passe ne correspondent pas" 
      }, { status: 400 })
    }

    // Validation de la force du mot de passe
    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: "Le nouveau mot de passe doit contenir au moins 8 caractères" 
      }, { status: 400 })
    }

    // Récupérer l'utilisateur avec son mot de passe actuel
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        error: "Le mot de passe actuel est incorrect" 
      }, { status: 400 })
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return NextResponse.json({ 
        error: "Le nouveau mot de passe doit être différent de l'actuel" 
      }, { status: 400 })
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({ 
      message: "Mot de passe mis à jour avec succès" 
    })
  } catch (error) {
    console.error("Erreur mise à jour mot de passe:", error)
    return NextResponse.json({ 
      error: "Erreur serveur lors de la mise à jour du mot de passe" 
    }, { status: 500 })
  }
}
