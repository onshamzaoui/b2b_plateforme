import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

// POST /api/invoices/generate-from-contract - Generate invoice from contract
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    if (session.user.role !== "FREELANCE") {
      return NextResponse.json({ error: "Seuls les freelances peuvent générer des factures" }, { status: 403 })
    }

    const body = await request.json()
    const { contractId, amount, description, dueDate, notes } = body

    if (!contractId) {
      return NextResponse.json({ error: "contractId requis" }, { status: 400 })
    }

    // Get the contract
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        freelancer: true,
        company: true,
        mission: true
      }
    })

    if (!contract) {
      return NextResponse.json({ error: "Contrat non trouvé" }, { status: 404 })
    }

    // Check if user owns this contract
    if (contract.freelancerId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Check if contract is active
    if (contract.status !== "ACTIVE") {
      return NextResponse.json({ error: "Seuls les contrats actifs peuvent générer des factures" }, { status: 400 })
    }

    // Check if invoice already exists for this contract
    const existingInvoice = await prisma.invoice.findFirst({
      where: { contractId }
    })

    if (existingInvoice) {
      return NextResponse.json({ error: "Une facture existe déjà pour ce contrat" }, { status: 400 })
    }

    // Generate unique invoice number
    const invoiceCount = await prisma.invoice.count()
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(6, '0')}`

    // Calculate amounts
    const numericAmount = amount ? parseFloat(amount) : (contract.dailyRate || 0)
    const invoiceAmount = isNaN(numericAmount) ? (contract.dailyRate || 0) : numericAmount
    const taxRate = 0.20
    const taxAmount = invoiceAmount * taxRate
    const totalAmount = invoiceAmount + taxAmount

    // Default due date (30 days from now)
    const defaultDueDate = new Date()
    defaultDueDate.setDate(defaultDueDate.getDate() + 30)

    // Create the invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        contractId,
        missionId: contract.missionId,
        freelancerId: contract.freelancerId,
        companyId: contract.companyId,
        amount: invoiceAmount,
        taxRate,
        taxAmount,
        totalAmount,
        description: description || `Facture pour le contrat: ${contract.title}`,
        dueDate: dueDate ? new Date(dueDate) : defaultDueDate,
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
    console.error("Erreur génération facture depuis contrat:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
