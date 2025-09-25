"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface InvoicePDFGeneratorProps {
  invoice: any
  className?: string
}

export function InvoicePDFGenerator({ invoice, className }: InvoicePDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      // Create a temporary div with the invoice content
      const invoiceContent = document.createElement("div")
      invoiceContent.style.position = "absolute"
      invoiceContent.style.left = "-9999px"
      invoiceContent.style.top = "0"
      invoiceContent.style.width = "800px"
      invoiceContent.style.backgroundColor = "white"
      invoiceContent.style.padding = "40px"
      invoiceContent.style.fontFamily = "Arial, sans-serif"
      invoiceContent.style.fontSize = "14px"
      invoiceContent.style.lineHeight = "1.6"
      invoiceContent.style.color = "#333"

      // Generate the HTML content
      invoiceContent.innerHTML = generateInvoiceHTML(invoice)
      document.body.appendChild(invoiceContent)

      // Convert to canvas and then to PDF
      const canvas = await html2canvas(invoiceContent, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Clean up
      document.body.removeChild(invoiceContent)

      // Download the PDF
      pdf.save(`facture-${invoice.invoiceNumber}.pdf`)
    } catch (error) {
      console.error("Erreur génération PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      variant="outline"
      size="sm"
      className={className}
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Génération..." : "Télécharger PDF"}
    </Button>
  )
}

function generateInvoiceHTML(invoice: any): string {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR")
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente"
      case "PAID":
        return "Payée"
      case "CANCELLED":
        return "Annulée"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#FF9800"
      case "PAID":
        return "#4CAF50"
      case "CANCELLED":
        return "#f44336"
      default:
        return "#9E9E9E"
    }
  }

  return `
    <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px; color: #333;">FACTURE</h1>
        <h2 style="margin: 10px 0; font-size: 20px; color: #666;">${invoice.invoiceNumber}</h2>
        <p style="margin: 0; color: #666;">Date d'émission: ${formatDate(invoice.issuedAt)}</p>
      </div>

      <!-- Status Badge -->
      <div style="text-align: right; margin-bottom: 20px;">
        <span style="
          display: inline-block;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          color: white;
          background-color: ${getStatusColor(invoice.status)};
        ">
          ${getStatusText(invoice.status)}
        </span>
      </div>

      <!-- Company Information -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
        <div>
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
            Freelance
          </h3>
          <div style="line-height: 1.8;">
            <div><strong>${invoice.freelancer?.name || "N/A"}</strong></div>
            <div>${invoice.freelancer?.email || ""}</div>
            ${invoice.freelancer?.location ? `<div>📍 ${invoice.freelancer.location}</div>` : ""}
            ${invoice.freelancer?.phone ? `<div>📞 ${invoice.freelancer.phone}</div>` : ""}
          </div>
        </div>
        <div>
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
            Entreprise
          </h3>
          <div style="line-height: 1.8;">
            <div><strong>${invoice.company?.name || invoice.company?.companyName || "N/A"}</strong></div>
            <div>${invoice.company?.email || ""}</div>
            ${invoice.company?.location ? `<div>📍 ${invoice.company.location}</div>` : ""}
            ${invoice.company?.phone ? `<div>📞 ${invoice.company.phone}</div>` : ""}
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Détails de la facture</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <div style="margin-bottom: 10px;">
              <strong>Description:</strong><br>
              <span style="color: #666;">${invoice.description}</span>
            </div>
            ${invoice.contract ? `
              <div style="margin-bottom: 10px;">
                <strong>Contrat:</strong><br>
                <span style="color: #666;">${invoice.contract.title}</span>
              </div>
            ` : ""}
            ${invoice.mission ? `
              <div style="margin-bottom: 10px;">
                <strong>Mission:</strong><br>
                <span style="color: #666;">${invoice.mission.title}</span>
              </div>
            ` : ""}
          </div>
          <div>
            <div style="margin-bottom: 10px;">
              <strong>Date d'échéance:</strong><br>
              <span style="color: #666;">${formatDate(invoice.dueDate)}</span>
            </div>
            ${invoice.paidAt ? `
              <div style="margin-bottom: 10px;">
                <strong>Date de paiement:</strong><br>
                <span style="color: #666;">${formatDate(invoice.paidAt)}</span>
              </div>
            ` : ""}
            ${invoice.paymentMethod ? `
              <div style="margin-bottom: 10px;">
                <strong>Méthode de paiement:</strong><br>
                <span style="color: #666;">${invoice.paymentMethod}</span>
              </div>
            ` : ""}
          </div>
        </div>
      </div>

      <!-- Financial Details -->
      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Détails financiers</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Montant HT:</span>
          <span><strong>${invoice.amount.toFixed(2)}€</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>TVA (${(invoice.taxRate * 100).toFixed(0)}%):</span>
          <span><strong>${invoice.taxAmount.toFixed(2)}€</strong></span>
        </div>
        <div style="border-top: 2px solid #333; padding-top: 10px; margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
            <span>Total TTC:</span>
            <span>${invoice.totalAmount.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      ${invoice.notes ? `
        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Notes</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; color: #666; white-space: pre-wrap;">${invoice.notes}</p>
          </div>
        </div>
      ` : ""}

      <!-- Payment Information -->
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Informations de paiement</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <div style="margin-bottom: 10px;">
              <strong>IBAN:</strong><br>
              <span style="font-family: monospace; color: #666;">FR76 1234 5678 9012 3456 7890 123</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>BIC:</strong><br>
              <span style="font-family: monospace; color: #666;">ABCD FR PP</span>
            </div>
          </div>
          <div>
            <div style="margin-bottom: 10px;">
              <strong>Référence:</strong><br>
              <span style="font-family: monospace; color: #666;">${invoice.invoiceNumber}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong>Montant à payer:</strong><br>
              <span style="font-size: 16px; font-weight: bold; color: #333;">${invoice.totalAmount.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; color: #666; font-size: 12px;">
        <p>Cette facture a été générée automatiquement le ${formatDate(new Date().toISOString())}</p>
        <p>Pour toute question concernant cette facture, veuillez contacter le freelance.</p>
      </div>
    </div>
  `
}


