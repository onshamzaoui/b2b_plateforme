import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import jsPDF from "jspdf"

const prisma = new PrismaClient()

// GET /api/invoices/[id]/pdf - Generate PDF for invoice
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
            location: true,
            phone: true
          }
        },
        contract: {
          select: {
            id: true,
            title: true,
            description: true
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

    // Generate PDF using jsPDF
    const doc = new jsPDF()
    
    // Set up fonts and colors
    const primaryColor = [41, 128, 185] // Blue
    const secondaryColor = [52, 73, 94] // Dark gray
    const lightGray = [236, 240, 241] // Light gray
    
    // Helper function to add text with line wrapping
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      const lines = doc.splitTextToSize(text, maxWidth)
      doc.setFontSize(fontSize)
      doc.text(lines, x, y)
      return y + (lines.length * (fontSize * 0.4))
    }
    
    // Helper function to add a line
    const addLine = (x1: number, y1: number, x2: number, y2: number) => {
      doc.line(x1, y1, x2, y2)
    }
    
    // Helper function to add a rectangle
    const addRect = (x: number, y: number, width: number, height: number, fill: boolean = false) => {
      if (fill) {
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
        doc.rect(x, y, width, height, 'F')
      } else {
        doc.rect(x, y, width, height)
      }
    }
    
    let yPosition = 20
    
    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 30, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('FACTURE', 105, 15, { align: 'center' })
    
    doc.setFontSize(12)
    doc.text(invoice.invoiceNumber, 105, 22, { align: 'center' })
    
    yPosition = 40
    
    // Invoice details
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.setFontSize(10)
    doc.text(`Date d'émission: ${new Date(invoice.issuedAt).toLocaleDateString("fr-FR")}`, 15, yPosition)
    doc.text(`Date d'échéance: ${new Date(invoice.dueDate).toLocaleDateString("fr-FR")}`, 15, yPosition + 5)
    
    // Status badge
    const statusText = invoice.status === "PENDING" ? "En attente" : 
                      invoice.status === "PAID" ? "Payée" : "Annulée"
    const statusColor = invoice.status === "PENDING" ? [255, 152, 0] :
                       invoice.status === "PAID" ? [76, 175, 80] : [244, 67, 54]
    
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2])
    doc.rect(150, yPosition - 5, 30, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text(statusText, 165, yPosition, { align: 'center' })
    
    yPosition += 20
    
    // From/To section
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('FREELANCE', 15, yPosition)
    doc.text('ENTREPRISE', 110, yPosition)
    
    yPosition += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    
    // Freelancer info
    doc.text(invoice.freelancer.name, 15, yPosition)
    doc.text(invoice.freelancer.email, 15, yPosition + 5)
    if (invoice.freelancer.location) {
      doc.text(invoice.freelancer.location, 15, yPosition + 10)
    }
    if (invoice.freelancer.phone) {
      doc.text(invoice.freelancer.phone, 15, yPosition + 15)
    }
    
    // Company info
    const companyName = invoice.company.name || invoice.company.companyName || 'N/A'
    doc.text(companyName, 110, yPosition)
    doc.text(invoice.company.email, 110, yPosition + 5)
    if (invoice.company.location) {
      doc.text(invoice.company.location, 110, yPosition + 10)
    }
    if (invoice.company.phone) {
      doc.text(invoice.company.phone, 110, yPosition + 15)
    }
    
    yPosition += 30
    
    // Description section
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('DESCRIPTION', 15, yPosition)
    yPosition += 8
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    yPosition = addText(invoice.description, 15, yPosition, 180) + 5
    
    // Contract/Mission info
    if (invoice.contract) {
      doc.setFont('helvetica', 'bold')
      doc.text('Contrat:', 15, yPosition)
      doc.setFont('helvetica', 'normal')
      yPosition = addText(invoice.contract.title, 35, yPosition, 160) + 3
    }
    
    if (invoice.mission) {
      doc.setFont('helvetica', 'bold')
      doc.text('Mission:', 15, yPosition)
      doc.setFont('helvetica', 'normal')
      yPosition = addText(invoice.mission.title, 35, yPosition, 160) + 3
    }
    
    yPosition += 10
    
    // Amounts table
    addRect(15, yPosition, 180, 25, true)
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    
    // Table headers
    doc.text('DÉTAIL', 20, yPosition + 8)
    doc.text('MONTANT', 160, yPosition + 8, { align: 'right' })
    
    addLine(15, yPosition + 12, 195, yPosition + 12)
    
    // Table rows
    doc.setFont('helvetica', 'normal')
    doc.text('Montant HT', 20, yPosition + 18)
    doc.text(`${invoice.amount.toFixed(2)}€`, 190, yPosition + 18, { align: 'right' })
    
    doc.text(`TVA (${(invoice.taxRate * 100).toFixed(0)}%)`, 20, yPosition + 23)
    doc.text(`${invoice.taxAmount.toFixed(2)}€`, 190, yPosition + 23, { align: 'right' })
    
    yPosition += 35
    
    // Total
    addRect(15, yPosition, 180, 12)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('TOTAL TTC', 20, yPosition + 8)
    doc.text(`${invoice.totalAmount.toFixed(2)}€`, 190, yPosition + 8, { align: 'right' })
    
    yPosition += 25
    
    // Payment information
    if (invoice.notes) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('NOTES', 15, yPosition)
      yPosition += 8
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      yPosition = addText(invoice.notes, 15, yPosition, 180) + 10
    }
    
    // Payment details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMATIONS DE PAIEMENT', 15, yPosition)
    yPosition += 8
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('IBAN: FR76 1234 5678 9012 3456 7890 123', 15, yPosition)
    doc.text('BIC: ABCD FR PP', 15, yPosition + 5)
    doc.text(`Référence: ${invoice.invoiceNumber}`, 15, yPosition + 10)
    
    // Payment date if paid
    if (invoice.paidAt) {
      doc.text(`Date de paiement: ${new Date(invoice.paidAt).toLocaleDateString("fr-FR")}`, 15, yPosition + 20)
      if (invoice.paymentMethod) {
        doc.text(`Méthode: ${invoice.paymentMethod}`, 15, yPosition + 25)
      }
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Généré automatiquement par la plateforme B2B', 105, pageHeight - 10, { align: 'center' })
    
    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${invoice.invoiceNumber}.pdf"`
      }
    })

  } catch (error) {
    console.error("Erreur génération PDF facture:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
