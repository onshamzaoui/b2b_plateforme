import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, password, userType, company } = body

    if (!email || !password || !userType) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
    }

    // Vérifier si l’utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 })
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        role: userType.toUpperCase(), // "FREELANCE" | "ENTREPRISE"
        ...(userType === "entreprise" && { companyName: company || null }),
        // Initialize arrays and set default values
        skills: [],
        portfolio: [],
        notificationsNewMissions: true,
        notificationsApplications: true,
        notificationsMarketing: false,
      },
    })

    return NextResponse.json(
      { 
        message: "Utilisateur créé avec succès", 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          name: user.name
        } 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur création utilisateur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
