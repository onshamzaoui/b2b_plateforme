import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

// GET /api/invoices/[id] - Get a specific invoice
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            location: true,
            phone: true
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            companyLogo: true,
            location: true,
            phone: true
          }
        },
        contract: {
          select: {
            id: true,
            title: true,
            description: true,
            dailyRate: true
          }
        },
        mission: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: "Facture non trouvée" }, { status: 404 })
    }

    // Check if user has access to this invoice
    if (invoice.freelancerId !== session.user.id && invoice.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    return NextResponse.json(invoice)

  } catch (error) {
    console.error("Erreur récupération facture:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH /api/invoices/[id] - Update invoice (mark as paid, update status, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    })

    if (!invoice) {
      return NextResponse.json({ error: "Facture non trouvée" }, { status: 404 })
    }

    // Check if user has access to this invoice
    if (invoice.freelancerId !== session.user.id && invoice.companyId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    let updateData: any = {}

    // Handle payment
    if (body.action === "mark_paid") {
      if (session.user.id === invoice.companyId) {
        updateData.status = "PAID"
        updateData.paidAt = new Date()
        updateData.paymentMethod = body.paymentMethod || "Bank Transfer"
      } else {
        return NextResponse.json({ error: "Seule l'entreprise peut marquer une facture comme payée" }, { status: 403 })
      }
    }

    // Handle status updates
    if (body.status && session.user.id === invoice.freelancerId) {
      updateData.status = body.status
    }

    // Handle other updates (only by freelancer)
    if (session.user.id === invoice.freelancerId) {
      if (body.description) updateData.description = body.description
      if (body.notes) updateData.notes = body.notes
      if (body.dueDate) updateData.dueDate = new Date(body.dueDate)
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedInvoice)

  } catch (error) {
    console.error("Erreur mise à jour facture:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE /api/invoices/[id] - Delete invoice (only by freelancer)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { id } = await params

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    })

    if (!invoice) {
      return NextResponse.json({ error: "Facture non trouvée" }, { status: 404 })
    }

    // Only freelancer can delete their own invoices
    if (invoice.freelancerId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Only allow deletion of pending invoices
    if (invoice.status !== "PENDING") {
      return NextResponse.json({ error: "Seules les factures en attente peuvent être supprimées" }, { status: 400 })
    }

    await prisma.invoice.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Facture supprimée avec succès" })

  } catch (error) {
    console.error("Erreur suppression facture:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
