import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

// GET /api/invoices - Get invoices for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    let invoices

    if (session.user.role === "ENTREPRISE") {
      // Companies see invoices they need to pay
      invoices = await prisma.invoice.findMany({
        where: { companyId: session.user.id },
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true
            }
          },
          contract: {
            select: {
              id: true,
              title: true
            }
          },
          mission: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else if (session.user.role === "FREELANCE") {
      // Freelances see invoices they've sent
      invoices = await prisma.invoice.findMany({
        where: { freelancerId: session.user.id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              companyName: true,
              email: true,
              companyLogo: true
            }
          },
          contract: {
            select: {
              id: true,
              title: true
            }
          },
          mission: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    return NextResponse.json(invoices)

  } catch (error) {
    console.error("Erreur récupération factures:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (session.user.role !== "FREELANCE") {
      return NextResponse.json({ error: "Seuls les freelances peuvent créer des factures" }, { status: 403 })
    }

    const body = await request.json()
    const {
      contractId,
      missionId,
      companyId,
      amount,
      description,
      dueDate,
      notes
    } = body

    // Validate required fields
    if (!companyId || !amount || !description || !dueDate) {
      return NextResponse.json({ 
        error: "Champs requis manquants: companyId, amount, description, dueDate" 
      }, { status: 400 })
    }

    // Validate amount is a valid number
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ 
        error: "Le montant doit être un nombre positif valide" 
      }, { status: 400 })
    }

    // Generate unique invoice number
    const invoiceCount = await prisma.invoice.count()
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(6, '0')}`

    // Calculate tax (20% VAT by default)
    const taxRate = 0.20
    const taxAmount = numericAmount * taxRate
    const totalAmount = numericAmount + taxAmount

    // Create the invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        contractId: contractId || null,
        missionId: missionId || null,
        freelancerId: session.user.id,
        companyId,
        amount: numericAmount,
        taxRate,
        taxAmount,
        totalAmount,
        description,
        dueDate: new Date(dueDate),
        notes: notes || null,
        status: "PENDING"
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            companyLogo: true
          }
        },
        contract: {
          select: {
            id: true,
            title: true
          }
        },
        mission: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(invoice, { status: 201 })

  } catch (error) {
    console.error("Erreur création facture:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
