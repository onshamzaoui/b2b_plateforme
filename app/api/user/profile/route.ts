import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Récupérer les données complètes de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        // Personal Information
        phone: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
        profileImage: true,
        // Professional Information
        profession: true,
        bio: true,
        experience: true,
        dailyRate: true,
        availability: true,
        skills: true,
        portfolio: true,
        // Company Information
        companyDescription: true,
        companySize: true,
        companySector: true,
        companyWebsite: true,
        companyLogo: true,
        // Notification Preferences
        notificationsNewMissions: true,
        notificationsApplications: true,
        notificationsMarketing: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Erreur récupération profil:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Check if request contains FormData (file upload) or JSON
    const contentType = request.headers.get("content-type") || ""
    let body: any = {}
    
    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData()
      const profileImageFile = formData.get("profileImage") as File
      
      if (profileImageFile) {
        // For now, we'll store the file name/path
        // In a real app, you'd upload to a cloud storage service
        const fileName = `profile-${session.user.id}-${Date.now()}.${profileImageFile.name.split('.').pop()}`
        const filePath = `/uploads/profiles/${fileName}`
        
        // Save file to public/uploads/profiles directory
        const fs = require('fs')
        const path = require('path')
        
        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
        
        // Save file
        const fileBuffer = await profileImageFile.arrayBuffer()
        const filePathFull = path.join(uploadDir, fileName)
        fs.writeFileSync(filePathFull, Buffer.from(fileBuffer))
        
        body.profileImage = filePath
      }
    } else {
      // Handle JSON data
      body = await request.json()
    }
    const {
      name,
      email,
      companyName,
      // Personal Information
      phone,
      location,
      website,
      linkedin,
      github,
      profileImage,
      // Professional Information
      profession,
      bio,
      experience,
      dailyRate,
      availability,
      skills,
      portfolio,
      // Company Information
      companyDescription,
      companySize,
      companySector,
      companyWebsite,
      companyLogo,
      // Notification Preferences
      notificationsNewMissions,
      notificationsApplications,
      notificationsMarketing,
    } = body

    // Get current user data to ensure we don't lose required fields
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true }
    })

    if (!currentUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Debug logging
    console.log("Received data:", { name, email, companyName })
    console.log("Current user:", currentUser)

    // Mettre à jour les informations de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        // Basic Information - use provided values or keep current ones
        name: name && name.trim() !== "" ? name : currentUser.name,
        email: email && email.trim() !== "" ? email : currentUser.email,
        ...(companyName !== undefined && { companyName }),
        // Personal Information
        ...(phone !== undefined && phone !== "" && { phone }),
        ...(location !== undefined && location !== "" && { location }),
        ...(website !== undefined && website !== "" && { website }),
        ...(linkedin !== undefined && linkedin !== "" && { linkedin }),
        ...(github !== undefined && github !== "" && { github }),
        ...(profileImage !== undefined && profileImage !== "" && { profileImage }),
        // Professional Information
        ...(profession !== undefined && profession !== "" && { profession }),
        ...(bio !== undefined && bio !== "" && { bio }),
        ...(experience !== undefined && experience !== "" && { experience }),
        ...(dailyRate !== undefined && { dailyRate }),
        ...(availability !== undefined && availability !== "" && { availability }),
        ...(skills !== undefined && { skills }),
        ...(portfolio !== undefined && { portfolio }),
        // Company Information
        ...(companyDescription !== undefined && companyDescription !== "" && { companyDescription }),
        ...(companySize !== undefined && companySize !== "" && { companySize }),
        ...(companySector !== undefined && companySector !== "" && { companySector }),
        ...(companyWebsite !== undefined && companyWebsite !== "" && { companyWebsite }),
        ...(companyLogo !== undefined && companyLogo !== "" && { companyLogo }),
        // Notification Preferences
        ...(notificationsNewMissions !== undefined && { notificationsNewMissions }),
        ...(notificationsApplications !== undefined && { notificationsApplications }),
        ...(notificationsMarketing !== undefined && { notificationsMarketing }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        // Personal Information
        phone: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
        profileImage: true,
        // Professional Information
        profession: true,
        bio: true,
        experience: true,
        dailyRate: true,
        availability: true,
        skills: true,
        portfolio: true,
        // Company Information
        companyDescription: true,
        companySize: true,
        companySector: true,
        companyWebsite: true,
        companyLogo: true,
        // Notification Preferences
        notificationsNewMissions: true,
        notificationsApplications: true,
        notificationsMarketing: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Erreur mise à jour profil:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
