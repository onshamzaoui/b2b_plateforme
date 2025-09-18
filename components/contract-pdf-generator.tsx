"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface ContractPDFGeneratorProps {
  contract: any
  className?: string
}

export function ContractPDFGenerator({ contract, className }: ContractPDFGeneratorProps) {
  const generatePDF = async () => {
    try {
      // Create a temporary div with the contract content
      const contractContent = document.createElement('div')
      contractContent.style.position = 'absolute'
      contractContent.style.left = '-9999px'
      contractContent.style.top = '0'
      contractContent.style.width = '800px'
      contractContent.style.backgroundColor = 'white'
      contractContent.style.padding = '40px'
      contractContent.style.fontFamily = 'Arial, sans-serif'
      contractContent.style.lineHeight = '1.6'
      contractContent.style.color = '#333'

      contractContent.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Freelance<span style="color: #6b7280; font-size: 18px; font-weight: 400; margin-left: 5px;">Connect</span></h1>
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">CONTRAT DE PRESTATION DE SERVICES</h1>
          <h2 style="margin: 10px 0 0 0; font-size: 18px; color: #666;">${contract.title}</h2>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #888;">Date de création: ${new Date(contract.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 18px;">Informations générales</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <div style="margin-bottom: 10px;">
                <strong style="display: block; margin-bottom: 5px;">Freelance:</strong>
                ${contract.freelancer.name}
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="display: block; margin-bottom: 5px;">Email:</strong>
                ${contract.freelancer.email}
              </div>
              ${contract.freelancer.location ? `
                <div style="margin-bottom: 10px;">
                  <strong style="display: block; margin-bottom: 5px;">Localisation:</strong>
                  ${contract.freelancer.location}
                </div>
              ` : ''}
            </div>
            <div>
              <div style="margin-bottom: 10px;">
                <strong style="display: block; margin-bottom: 5px;">Entreprise:</strong>
                ${contract.company.name || contract.company.companyName}
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="display: block; margin-bottom: 5px;">Email:</strong>
                ${contract.company.email}
              </div>
              ${contract.company.location ? `
                <div style="margin-bottom: 10px;">
                  <strong style="display: block; margin-bottom: 5px;">Localisation:</strong>
                  ${contract.company.location}
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 18px;">Détails de la mission</h2>
          <div style="margin-bottom: 10px;">
            <strong style="display: block; margin-bottom: 5px;">Mission:</strong>
            ${contract.mission.title}
          </div>
          ${contract.mission.description ? `
            <div style="margin-bottom: 10px;">
              <strong style="display: block; margin-bottom: 5px;">Description:</strong>
              ${contract.mission.description}
            </div>
          ` : ''}
          ${contract.mission.location ? `
            <div style="margin-bottom: 10px;">
              <strong style="display: block; margin-bottom: 5px;">Lieu:</strong>
              ${contract.mission.location}
            </div>
          ` : ''}
        </div>

        <div style="margin-bottom: 290px;">
          <h2 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 18px;">Conditions financières</h2>
          <div style="margin-bottom: 10px;">
            <strong style="display: block; margin-bottom: 5px;">Taux journalier:</strong>
            ${contract.dailyRate}€
          </div>
          ${contract.totalAmount ? `
            <div style="margin-bottom: 10px;">
              <strong style="display: block; margin-bottom: 5px;">Montant total:</strong>
              ${contract.totalAmount}€
            </div>
          ` : ''}
          <div style="margin-bottom: 10px;">
            <strong style="display: block; margin-bottom: 5px;">Date de début:</strong>
            ${new Date(contract.startDate).toLocaleDateString("fr-FR")}
          </div>
          ${contract.endDate ? `
            <div style="margin-bottom: 10px;">
              <strong style="display: block; margin-bottom: 5px;">Date de fin:</strong>
              ${new Date(contract.endDate).toLocaleDateString("fr-FR")}
            </div>
          ` : ''}
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 18px;">Conditions générales</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: monospace; font-size: 12px;">
            ${contract.terms}
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; font-size: 18px;">Statut du contrat</h2>
          <span style="display: inline-block; padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold; text-transform: uppercase; background-color: ${contract.status === 'ACTIVE' ? '#4CAF50' : contract.status === 'PENDING_SIGNATURE' ? '#FF9800' : '#9E9E9E'}; color: white;">
            ${contract.status === 'ACTIVE' ? 'Actif' : contract.status === 'PENDING_SIGNATURE' ? 'En attente de signature' : contract.status === 'COMPLETED' ? 'Terminé' : contract.status === 'CANCELLED' ? 'Annulé' : 'Brouillon'}
          </span>
          ${contract.signedAt ? `
            <p style="margin-top: 10px; font-size: 12px; color: #666;">
              Signé le: ${new Date(contract.signedAt).toLocaleDateString("fr-FR")}
            </p>
          ` : ''}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
          <div style="border-top: 1px solid #333; padding-top: 10px; text-align: center;">
            <p style="margin: 0; font-weight: bold;">Signature Freelance</p>
            <p style="margin: 5px 0; font-size: 12px;">${contract.signedByFreelancer ? '✓ Signé' : 'En attente'}</p>
            <br><br>
            <p style="margin: 0; border-top: 1px solid #333; padding-top: 10px;">${contract.freelancer.name}</p>
          </div>
          <div style="border-top: 1px solid #333; padding-top: 10px; text-align: center;">
            <p style="margin: 0; font-weight: bold;">Signature Entreprise</p>
            <p style="margin: 5px 0; font-size: 12px;">${contract.signedByCompany ? '✓ Signé' : 'En attente'}</p>
            <br><br>
            <p style="margin: 0; border-top: 1px solid #333; padding-top: 10px;">${contract.company.name || contract.company.companyName}</p>
          </div>
        </div>
      `

      document.body.appendChild(contractContent)

      // Generate canvas from HTML
      const canvas = await html2canvas(contractContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Remove the temporary element
      document.body.removeChild(contractContent)

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Download the PDF
      const fileName = `contrat-${contract.id}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

    } catch (error) {
      console.error('Erreur génération PDF:', error)
      alert('Erreur lors de la génération du PDF')
    }
  }

  return (
    <Button onClick={generatePDF} className={className}>
      <Download className="mr-2 h-4 w-4" />
      Télécharger PDF
    </Button>
  )
}
